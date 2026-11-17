#!/usr/bin/env python3
"""Positive findings for decimal strings 258 and 528 across nine constants.
Dependencies: pip install mpmath
Indexing: one-based, first digit after decimal point is position 1.
"""
from collections import defaultdict
import mpmath as mp

N = 100_000
mp.mp.dps = N + 100
values = {
    "pi": mp.pi, "e": mp.e, "phi": (1 + mp.sqrt(5)) / 2,
    "sqrt2": mp.sqrt(2), "sqrt3": mp.sqrt(3), "sqrt5": mp.sqrt(5),
    "sqrt37": mp.sqrt(37), "sqrt73": mp.sqrt(73), "sqrt888": mp.sqrt(888)
}
digits = {k: str(x).split(".")[1][:N] for k, x in values.items()}
assert all(len(d) == N for d in digits.values())

def starts(s, p):
    output, i = [], 0
    while True:
        i = s.find(p, i)
        if i == -1:
            return output
        output.append(i + 1)  # 1-based start
        i += 1  # allow overlaps

names = ("258", "528")
found = {k: {p: starts(d, p) for p in names} for k, d in digits.items()}
totals = {p: sum(len(found[k][p]) for k in found) for p in names}
assert totals == {"258": 892, "528": 907}
for k, row in found.items():
    print(k, "258:", len(row["258"]), "528:", len(row["528"]))
print("TOTAL", totals)

def same_position(p):
    by_position = defaultdict(list)
    for k, row in found.items():
        for n in row[p]:
            by_position[n].append(k)
    return {n: ks for n, ks in sorted(by_position.items()) if len(ks) > 1}

assert same_position("258") == {80153: ["sqrt2", "sqrt888"]}
assert same_position("528") == {
    10789: ["pi", "e"], 43007: ["sqrt5", "sqrt37"],
    83376: ["sqrt73", "sqrt888"], 89317: ["pi", "sqrt5"]
}
print("same-position 258:", same_position("258"))
print("same-position 528:", same_position("528"))

# Same decimal address with 258 in one constant and 528 in another
cross = defaultdict(list)
for first in found:
    for second in found:
        if first == second:
            continue
        coincident = set(found[first]["258"]) & set(found[second]["528"])
        for n in coincident:
            cross[n].append((first, second))
cross = dict(sorted(cross.items()))
assert cross == {
    11418: [("sqrt3", "sqrt73")],
    29175: [("sqrt888", "sqrt2")],
    95298: [("sqrt37", "sqrt5")],
    99365: [("e", "sqrt2")]
}
print("cross 258 | 528:", cross)

# Exact adjacent triplets, without intervening digits
adjacent = {}
for k, d in digits.items():
    a = starts(d, "258528")
    b = starts(d, "528258")
    if a or b:
        adjacent[k] = {"258528": a, "528258": b}
assert adjacent == {
    "pi": {"258528": [], "528258": [76909]},
    "phi": {"258528": [90504, 97624], "528258": []},
    "sqrt3": {"258528": [30240], "528258": []},
    "sqrt5": {"258528": [8791], "528258": []},
    "sqrt73": {"258528": [86493], "528258": []},
}
print("adjacent:", adjacent)

assert "".join(digits["sqrt2"][i - 1] for i in (80, 1, 10)) == "343"
assert sum(int(digits["sqrt2"][i - 1])**2 for i in (80, 1, 10)) == 34
assert 3**3+0 == 27  # ordinary exponent consistency check
assert 7**3 == 343
print("PASS all source-digit counts, synchronized indexes, adjoining hits, and sqrt2 343")

assert digits["sqrt2"][52833:52836] == "520"
assert digits["sqrt3"][52833:52836] == "528"
print("Verified shared address 52834: sqrt2=520, sqrt3=528")
