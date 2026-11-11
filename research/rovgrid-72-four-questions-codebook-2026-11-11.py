#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""RovGrid: a reversible structural 6 x 4 x 3 codebook for all 72 Names.

Four user-defined questions are labels (NOT a historically proven plaintext).
Outputs 24 exact nine-letter packets, full gematria and invariant checks.

Usage:
  python3 research/rovgrid-72-four-questions-codebook-2026-11-11.py
  python3 research/rovgrid-72-four-questions-codebook-2026-11-11.py --json
  python3 research/rovgrid-72-four-questions-codebook-2026-11-11.py --self-test
"""
import argparse
import json
from collections import Counter

VERSE19 = "ויסעמלאכהאלהימההלכלפנימחנהישראלוילכמאחריהמויסעעמודהעננמפניהמויעמדמאחריהמ"
VERSE20 = "ויבאבינמחנהמצרימובינמחנהישראלויהיהעננוהחשכויאראתהלילהולאקרבזהאלזהכלהלילה"
VERSE21 = "ויטמשהאתידועלהימויולכיהוהאתהימברוחקדימעזהכלהלילהוישמאתהימלחרבהויבקעוהמימ"
ALPHABET = "אבגדהוזחטיכלמנסעפצקרשת"
REG = dict(zip(ALPHABET, [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
ORD = {c: i + 1 for i, c in enumerate(ALPHABET)}
ATB = {c: 22 - i for i, c in enumerate(ALPHABET)}
FINAL = str.maketrans("ךםןףץ", "כמנפצ")
DISPLAY_FINAL = dict(zip("כמנפצ", "ךםןףץ"))
QUESTIONS = ["מי אני","מי אתה","מה זה","איפה אנחנו"]

def canon(text):
    return "".join(c for c in text.translate(FINAL) if c in ALPHABET)

def score(text):
    s = canon(text)
    return {
        "letters": len(s),
        "regular": sum(REG[c] for c in s),
        "ordinal": sum(ORD[c] for c in s),
        "atbash_ordinal": sum(ATB[c] for c in s),
    }

def display_name(raw):
    return raw[:-1] + DISPLAY_FINAL.get(raw[-1], raw[-1])

def reconstruct():
    verses = [VERSE19, VERSE20, VERSE21]
    assert all(len(v) == 72 for v in verses), "Source verse not 72 letters"
    return [
        VERSE19[i] + VERSE20[71 - i] + VERSE21[i]
        for i in range(72)
    ]

def slot(index):
    """1..72 -> round 1..6, question 1..4, symbol 1..3."""
    assert 1 <= index <= 72
    k = index - 1
    return 1 + k // 12, 1 + (k % 12) // 3, 1 + k % 3

def index_of(round_number, question_number, symbol_number):
    assert 1 <= round_number <= 6
    assert 1 <= question_number <= 4
    assert 1 <= symbol_number <= 3
    return 12 * (round_number - 1) + 3 * (question_number - 1) + symbol_number

def build_codebook():
    names = reconstruct()
    words = []
    for i, name in enumerate(names, 1):
        rnd, question, symbol = slot(i)
        words.append({
            "index": i, "name": display_name(name),
            "canonical": name, "round": rnd, "question": question,
            "symbol": symbol, **score(name)
        })
    question_scores = [{"question": q, **score(q)} for q in QUESTIONS]
    packets = []
    lanes = []
    for rnd in range(1, 7):
        for q in range(1, 5):
            selected = [words[index_of(rnd, q, s) - 1] for s in (1, 2, 3)]
            raw = "".join(w["canonical"] for w in selected)
            packets.append({
                "round": rnd,
                "question_number": q, "question": QUESTIONS[q - 1],
                "indices": [w["index"] for w in selected],
                "names": [w["name"] for w in selected],
                "canonical_payload": raw,
                **score(raw),
            })
    for q in range(1, 5):
        group = [p for p in packets if p["question_number"] == q]
        lanes.append({
            "question_number": q, "question": QUESTIONS[q - 1],
            "indices": [i for p in group for i in p["indices"]],
            "letters": sum(p["letters"] for p in group),
            "regular": sum(p["regular"] for p in group),
            "ordinal": sum(p["ordinal"] for p in group),
            "atbash_ordinal": sum(p["atbash_ordinal"] for p in group)
        })
    return {
        "title": "RovGrid / 72 Names / Four Questions / 6x4x3",
        "protocol": {
            "verse_construction": "Exodus14:19[i] + reversed(14:20)[i] + 14:21[i]",
            "rounds": 6, "questions_per_round": 4,
            "names_per_question_per_round": 3,
            "semantics": "User-proposed four question labels; not a decrypted ancient sentence",
            "index_formula": "12*(round-1)+3*(question-1)+symbol",
        },
        "question_signatures": question_scores,
        "words": words,
        "packets": packets,
        "lane_totals": lanes,
        "source_totals": {
            "names": len(names), "letters": 3 * len(names),
            **{key: sum(w[key] for w in words)
               for key in ("regular", "ordinal", "atbash_ordinal")}
        },
    }

def self_test(codebook):
    names = reconstruct()
    assert len(names) == 72 and len(set(names)) == 69
    assert all(slot(index_of(r, q, s)) == (r, q, s)
               for r in range(1, 7) for q in range(1, 5) for s in range(1, 4))
    assert [names[i-1] for i in (1, 23, 37, 49, 72)] == [
        "והו", "מלה", "אני", "והו", "מומ"]
    assert [slot(i) for i in (1, 23, 37, 49, 72)] == [
        (1,1,1), (2,4,2), (4,1,1), (5,1,1), (6,4,3)]
    assert codebook["source_totals"] == {
        "names": 72, "letters": 216, "regular": 9143,
        "ordinal": 2159, "atbash_ordinal": 2809}
    assert len(codebook["packets"]) == 24
    assert all(p["letters"] == 9 and
               p["ordinal"] + p["atbash_ordinal"] == 207
               for p in codebook["packets"])
    assert all(l["letters"] == 54 and
               l["ordinal"] + l["atbash_ordinal"] == 54 * 23
               for l in codebook["lane_totals"])
    assert [(l["regular"], l["ordinal"], l["atbash_ordinal"])
            for l in codebook["lane_totals"]] == [
                (2569,526,716), (2482,574,668),
                (2062,505,737), (2030,554,688)]
    signatures = codebook["question_signatures"]
    assert [(x["letters"], x["regular"], x["ordinal"], x["atbash_ordinal"])
            for x in signatures] == [
                (5,111,48,67),(5,456,51,64),
                (4,57,30,62),(9,211,76,131)]
    assert [sum(q[key] for q in signatures)
            for key in ("letters","regular","ordinal","atbash_ordinal")
            ] == [23,835,205,324]
    assert 23**2 == 205+324 == 529
    assert 18**2 == 324
    assert 53**2 == 2809 and 835+53 == 888
    # Round-trip: packets reproduce every original name in its original order.
    recovered = [w for p in codebook["packets"] for w in p["names"]]
    assert recovered == [display_name(w) for w in names]
    assert Counter("".join(p["canonical_payload"] for p in codebook["packets"])) == Counter("".join(names))
    # Checks don't assume an actual plaintext or historically intended semantic partition.
    return True

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--json", action="store_true", help="Print all data as JSON")
    parser.add_argument("--self-test", action="store_true", help="Verify the codec")
    args = parser.parse_args()
    result = build_codebook()
    self_test(result)
    if args.self_test:
        print("PASS: 72/72 names, 24 packets, four 54-letter lanes, inverse indexing, signatures")
    elif args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print("RovGrid | 72 names -> 6 rounds x 4 questions x 3 names")
        print("Four labels describe the model; they are not a decoded ancient statement.")
        for p in result["packets"]:
            print(
                f'Round {p["round"]} / Q{p["question_number"]} {p["question"]}: '
                f'#{p["indices"][0]}-#{p["indices"][-1]} '
                f'{" ".join(p["names"])} | regular {p["regular"]} '
                f'ordinal {p["ordinal"]} atbash {p["atbash_ordinal"]}'
            )
        print("Lanes:")
        for lane in result["lane_totals"]:
            print(f'{lane["question"]}: 54 letters; '
                  f'R={lane["regular"]}, O={lane["ordinal"]}, A={lane["atbash_ordinal"]}')
        print("Question text: 23 letters, 835 regular, 205 ordinal, 324 Atbash")
        print("Checksum: 9143 regular + 2159 ordinal + 2809 Atbash (separate totals)")

if __name__ == "__main__":
    main()
