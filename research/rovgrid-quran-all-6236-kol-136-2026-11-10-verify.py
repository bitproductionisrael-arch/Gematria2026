#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Verify the RovGrid Quran 135/136/137 full signed-word scan.

Offline: verifies all 6236 saved verse records, counts, shortest 136 witnesses.
Online:  --source downloads 114 Uthmani surah files pinned to a source Git SHA
         and recomputes every verse, word value, modulo and target status.

From repository root:
  python research/rovgrid-quran-all-6236-kol-136-2026-11-10-verify.py
  python research/rovgrid-quran-all-6236-kol-136-2026-11-10-verify.py --source
"""
import argparse
import json
import re
import urllib.request
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data"
PARTS = ("001-015", "016-030", "031-045", "046-060",
         "061-075", "076-090", "091-105", "106-114")
SOURCE_REPOSITORY = "semarketir/quranjson"
SOURCE_COMMIT = "7ca6f46ec9a1a029cdb220c2531d509f4a5b5e98"
ABJAD = "ابجدهوزحطيكلمنسعفصقرشتثخذضظغ"
VALUES = {}
for i, c in enumerate(ABJAD):
    VALUES[c] = (i + 1) if i < 9 else ((i - 8) * 10 if i < 18 else (i - 17) * 100)
VALUES.update({"أ": 1, "إ": 1, "آ": 1, "ٱ": 1, "ء": 1,
               "ؤ": 6, "ئ": 10, "ى": 10, "ة": 5})
REMOVE = re.compile(r"[\u064b-\u065f\u0670\u06d6-\u06ed\u0640\u200b-\u200f\ufeff]")
SPLIT = re.compile(r"[^\u0621-\u063a\u0641-\u064a\u0671\u0670]+")

def tokenize(text):
    return [w for w in SPLIT.split(REMOVE.sub("", text)) if w]

def gematria(word):
    if not all(c in VALUES for c in word):
        raise ValueError(f"Unexpected Arabic consonant: {word}")
    return sum(VALUES[c] for c in word)

def contains(bits, pos):
    return pos >= 0 and bool((bits >> pos) & 1)

def solve(values, targets=(135, 136, 137), min_cap=8):
    center = sum(values)
    max_terms = min(min_cap, len(values))
    each_k = [1 << center] + [0] * max_terms
    any_k = 1 << center
    for i, value in enumerate(values):
        # Each word occurrence may be omitted, added, or subtracted exactly once.
        any_k |= (any_k << value) | (any_k >> value)
        for k in range(min(max_terms, i + 1), 0, -1):
            each_k[k] |= (each_k[k - 1] << value) | (each_k[k - 1] >> value)
    return {
        t: {
            "any": contains(any_k, center + t),
            "k": next((k for k in range(1, max_terms + 1)
                       if contains(each_k[k], center + t)), None),
        }
        for t in targets
    }

def read_saved():
    verses = {}
    for group in PARTS:
        path = DATA / f"quran-abjad-136-2026-11-10-surahs-{group}.json"
        part = json.loads(path.read_text(encoding="utf-8"))
        assert part["unknown_letters"] == []
        for verse in part["verses"]:
            key = verse["s"], verse["a"]
            assert key not in verses, key
            verses[key] = verse
    assert len(verses) == 6236, len(verses)
    assert {s for (s, _) in verses} == set(range(1, 115))
    return verses

def saved_check(verses):
    controls = Counter()
    hist = Counter()
    extra = json.loads((DATA / "quran-abjad-136-2026-11-10-8plus-witnesses.json")
                       .read_text(encoding="utf-8"))["witnesses"]
    extra = {(p["s"], p["a"]): p for p in extra}
    assert len(extra) == 5
    for key, record in verses.items():
        assert record["words"] >= 1, key
        for target in (135, 136, 137):
            hit = record["hit"][str(target)]
            if hit["any"]:
                controls[target] += 1
        h = record["hit"]["136"]
        special = extra.get(key)
        chosen = special["terms"] if special else h["terms"]
        n = special["min_terms"] if special else h["k"]
        assert bool(n) == h["any"], key
        if n:
            hist[n] += 1
            assert len(chosen) == n
            assert sum(sign * value for word, sign, value in chosen) == 136, key
            assert all(sign in (-1, 1) and gematria(word) == value
                       for word, sign, value in chosen), key
    assert controls == {135: 4326, 136: 4378, 137: 4351}, controls
    assert hist == {1: 202, 2: 1142, 3: 1888, 4: 772,
                    5: 256, 6: 99, 7: 14, 8: 5}, hist
    assert len([v for v in verses.values() if v["values_sum"] % 136 == v["words"]]) == 46
    focus = verses[(2, 136)]
    assert focus["words"] == 31
    assert focus["values_sum"] == 4383 == 136 * 32 + 31
    print("OFFLINE PASS: 6236 verses in 114 surahs.")
    print("Targets:", dict(controls))
    print("Minimum words for 136:", dict(sorted(hist.items())))

def live_source_check(verses):
    checked = set()
    for s in range(1, 115):
        url = (f"https://raw.githubusercontent.com/{SOURCE_REPOSITORY}/"
               f"{SOURCE_COMMIT}/source/surah/surah_{s}.json")
        with urllib.request.urlopen(url, timeout=35) as response:
            chapter = json.load(response)
        for key, text in chapter["verse"].items():
            ayah = int(key.split("_")[1])
            if ayah == 0:
                continue  # Stand-alone Bismillah before most surahs.
            ref = (s, ayah)
            saved = verses[ref]
            words = tokenize(text)
            values = [gematria(w) for w in words]
            assert saved["words"] == len(words), ref
            assert saved["values_sum"] == sum(values), ref
            brute = solve(values)
            for target in (135, 136, 137):
                stored = saved["hit"][str(target)]
                assert stored["any"] == brute[target]["any"], (ref, target, "any")
                if stored["k"] is not None:
                    assert stored["k"] == brute[target]["k"], (ref, target, "k")
                else:
                    assert brute[target]["k"] is None or brute[target]["k"] == 8, (ref, target, "k8")
                # Verify term count multiplicity against actual word occurrences.
                if target == 136:
                    chosen = stored["terms"]
                    if chosen is None:
                        from_file = json.loads((DATA / "quran-abjad-136-2026-11-10-8plus-witnesses.json")
                                               .read_text(encoding="utf-8"))["witnesses"]
                        special = next((w for w in from_file if (w["s"], w["a"]) == ref), None)
                        chosen = special["terms"] if special else None
                    if chosen:
                        counts = Counter(words)
                        for word, sign, value in chosen:
                            counts[word] -= 1
                            assert counts[word] >= 0, (ref, word)
            checked.add(ref)
        print(f"Surah {s:3d}/114 source checked", flush=True)
    assert checked == set(verses), "Some source verses were not verified"
    print("SOURCE PASS: every verse independently recomputed from fixed source commit.")

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", action="store_true",
                    help="Also fetch pinned original Arabic text and recompute all results.")
    args = ap.parse_args()
    records = read_saved()
    saved_check(records)
    if args.source:
        live_source_check(records)
