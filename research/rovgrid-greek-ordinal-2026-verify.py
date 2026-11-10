#!/usr/bin/env python3
"""Reproducible arithmetic for RovGrid's 2026 Greek Ordinal baseline."""
from itertools import combinations

ANCIENT = "αβγδεϝζηθικλμνξοπϙρστυφχψωϡ"
MODERN = "αβγδεζηθικλμνξοπρστυφχψω"
assert len(ANCIENT) == len(set(ANCIENT)) == 27
assert len(MODERN) == len(set(MODERN)) == 24
old = dict(zip(ANCIENT, range(1, 28)))
modern = dict(zip(MODERN, range(1, 25)))
mapped = old.copy()
for a, b in (("υ", "σ"), ("ω", "ϡ")):
    mapped[a], mapped[b] = mapped[b], mapped[a]
assert set(mapped.values()) == set(range(1, 28))

def total(text, mapping):
    return sum(mapping[letter] for letter in text.lower())

# Greek numeral order uses units 1-9, tens 10-90, hundreds 100-900.
iso = {letter: (i+1 if i<9 else (i-8)*10 if i<18 else (i-17)*100)
       for i, letter in enumerate(ANCIENT)}

checks = {
    "ηιοω": (60, 55, 61, 888),
    "αευ": (28, 26, 26, 406),
    "αεηιουω": (88, 81, 87, 1294),
    "αω": (27, 25, 28, 801)
}
for phrase, expected in checks.items():
    actual = (total(phrase,old), total(phrase,modern), total(phrase,mapped),total(phrase,iso))
    assert actual == expected,(phrase,actual,expected)
    print(phrase.upper(), actual)

# No single swap starting from ancient can produce both required anchor totals.
target_a, target_b = 61, 26
for a,b in combinations(ANCIENT,2):
    candidate=old.copy()
    candidate[a],candidate[b]=candidate[b],candidate[a]
    assert not (total("ηιοω",candidate)==target_a and total("αευ",candidate)==target_b)
print("PASS: 27 unique values, all arithmetic, no one-swap solution; two swaps suffice.")
