#!/usr/bin/env python3
"""RovGrid: digit-position and Power-of-Aleph/Bet audit.
Run: pip install mpmath; python research/rovgrid-constant-digits-audit-2026-11-07.py
Positions are 1-based in the fractional part; zeros retained.
No alphabet-value mapping is used.
"""
import json
from pathlib import Path
import mpmath as mp

mp.mp.dps = 10100
N = 10000
CONSTANTS = {
    "pi": mp.pi, "e": mp.e, "phi": mp.phi,
    "sqrt2": mp.sqrt(2), "sqrt3": mp.sqrt(3), "sqrt5": mp.sqrt(5),
    "sqrt37": mp.sqrt(37), "sqrt73": mp.sqrt(73), "sqrt888": mp.sqrt(888),
}
TARGETS = [
    "2701", "888", "82", "240", "42", "592", "106",
    "1256", "528", "582", "555", "1110", "52", "31", "43",
    "24", "32", "50", "44", "48", "22", "36", "17", "40",
    "38", "307", "55", "373", "368", "62", "1480"
]
PREFIX_LENGTHS = [42, 55, 62, 82, 106, 240, 307, 368]

result = {
    "positions": "1-based, first fractional digit, leading zeros retained",
    "n_digits": N, "substring_targets": TARGETS,
    "prefix_lengths": PREFIX_LENGTHS, "constants": {}
}
for name, x in CONSTANTS.items():
    decimals = str(x).split(".", 1)[1][:N]
    assert len(decimals) == N, (name, len(decimals))
    digits = [int(c) for c in decimals]
    p1 = [0]
    p2 = [0]
    for digit in digits:
        p1.append(p1[-1] + digit)
        p2.append(p2[-1] + digit * digit)
    substrings = {}
    for target in TARGETS:
        starts = []
        offset = 0
        while True:
            at = decimals.find(target, offset)
            if at < 0:
                break
            starts.append(at + 1)
            offset = at + 1
        substrings[target] = {
            "first": starts[0] if starts else None,
            "count": len(starts),
            "positions": starts,
        }
    result["constants"][name] = {
        "first20": decimals[:20],
        "prefix": {
            str(n): {"S1": p1[n], "S2": p2[n]}
            for n in PREFIX_LENGTHS
        },
        "substrings": substrings,
    }

assert result["constants"]["pi"]["substrings"]["2701"]["first"] == 165
assert result["constants"]["pi"]["prefix"]["82"]["S2"] == 2701

out = Path("rovgrid-constant-digits-audit-results-2026-11-07.json")
out.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
print("PASS: pi substring 2701 starts at 165")
print("PASS: pi S2(82) = 2701")
print("Saved:", out)
for name, v in result["constants"].items():
    print(name, "S2(82)=", v["prefix"]["82"]["S2"],
          "first_1480=", v["substrings"]["1480"]["first"])
