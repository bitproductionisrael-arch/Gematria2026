#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Offline verification of the entire Genesis signed-word 136 atlas.
Data snapshots: WLC plain Hebrew under CC BY 4.0, via avisonofgod.github.io.
Usage from repository root:
    python research/rovgrid-genesis-all-1533-kol-136-2026-11-10-verify.py
"""
import json
import re
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
DATA = HERE / "data"
SHARDS = ("01-10", "11-25", "26-40", "41-50")
ORDER = "אבגדהוזחטיכלמנסעפצקרשת"
VAL = {}
for i, letter in enumerate(ORDER):
    VAL[letter] = i + 1 if i < 10 else 10 * (i - 8) if i < 18 else 100 * (i - 17)
for final, base in {"ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ"}.items():
    VAL[final] = VAL[base]

def words(text):
    return re.findall(r"[א-ת]+", text)

def word_value(text):
    return sum(VAL[c] for c in text)

def bit(bits, index):
    return (bits >> index) & 1 if index >= 0 else 0

def bitsets(values, max_terms):
    total = sum(values)
    initial = 1 << total
    dp = [initial] + [0] * max_terms
    unrestricted = initial
    for i, v in enumerate(values):
        new_unrestricted = unrestricted | (unrestricted << v) | (unrestricted >> v)
        for k in range(min(i + 1, max_terms), 0, -1):
            dp[k] |= (dp[k - 1] << v) | (dp[k - 1] >> v)
        unrestricted = new_unrestricted
    return total, dp, unrestricted

rows = []
for shard in SHARDS:
    file = DATA / ("genesis-kol-136-2026-11-10-chapters-" + shard + ".json")
    rows.extend(json.loads(file.read_text(encoding="utf-8"))["verses"])
extra_file = DATA / "genesis-kol-136-2026-11-10-witnesses-5plus.json"
extra = json.loads(extra_file.read_text(encoding="utf-8"))["witnesses"]
extra_by_ref = {(r["chapter"], r["verse"]): r for r in extra}

assert len(rows) == 1533
assert len(set((r["chapter"], r["verse"]) for r in rows)) == 1533
assert set(r["chapter"] for r in rows) == set(range(1, 51))

minimum_counts = Counter()
hit_short = Counter()
hit_any = Counter()
for record in rows:
    w = words(record["text"])
    values = [word_value(x) for x in w]
    assert len(w) == record["word_count"]
    assert sum(values) == record["total"]
    total, dp, unrestricted = bitsets(values, 7)
    key = (record["chapter"], record["verse"])
    for target in (135, 136, 137):
        answer = record["solutions"][str(target)]
        possible = bool(bit(unrestricted, total + target))
        assert possible == answer["any_terms"], (key, target, "any")
        smallest_to_4 = next((k for k in range(1, 5) if bit(dp[k], total + target)), None)
        assert smallest_to_4 == answer["min_terms_le4"], (key, target, "≤4")
        if possible:
            hit_any[target] += 1
        if smallest_to_4:
            hit_short[target] += 1
    answer = record["solutions"]["136"]
    min_terms = next((k for k in range(1, 8) if bit(dp[k], total + 136)), None)
    assert bool(min_terms) == answer["any_terms"], (key, "minimum")
    if min_terms:
        minimum_counts[min_terms] += 1
        if min_terms <= 4:
            assert min_terms == answer["min_terms_le4"]
            chosen = answer["terms"]
        else:
            assert key in extra_by_ref
            assert extra_by_ref[key]["min_terms"] == min_terms
            chosen = extra_by_ref[key]["terms"]
        assert len(chosen) == min_terms
        word_counts = Counter(w)
        assert all(word_value(term[0]) == term[2] for term in chosen)
        assert all(term[1] in (-1, 1) for term in chosen)
        assert sum(term[1] * term[2] for term in chosen) == 136
        for word, sign, value in chosen:
            word_counts[word] -= 1
            assert word_counts[word] >= 0
    else:
        assert key not in extra_by_ref

assert hit_short == {135: 1341, 136: 1367, 137: 1335}, hit_short
assert hit_any == {135: 1432, 136: 1451, 137: 1435}, hit_any
assert minimum_counts == {1: 57, 2: 343, 3: 698, 4: 269, 5: 65, 6: 17, 7: 2}, minimum_counts
assert len(extra_by_ref) == 84

print("PASS: 1,533 verses, 50 chapters, 3 targets (135, 136, 137).")
print("Minimum 136 term histogram:", dict(sorted(minimum_counts.items())))
print("Up to 4 terms:", dict(hit_short))
print("Unlimited terms:", dict(hit_any))
print("No 136 hit:", len(rows) - hit_any[136])
