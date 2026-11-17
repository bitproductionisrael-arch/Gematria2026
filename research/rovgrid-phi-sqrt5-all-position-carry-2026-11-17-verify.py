#!/usr/bin/env python3
"""Verify the universal positional carry law for √5 = 2φ − 1, 100,000 digits.

Uses exact integer square roots only; no floating-point or external datasets.
Decimal positions start at 1 after decimal point.
"""
from math import isqrt
from collections import Counter
import sys
sys.set_int_max_str_digits(0)
N = 100_000
Q = 10 ** N
s5 = str(isqrt(5 * Q * Q))[1:]
phi = str((Q + isqrt(5 * Q * Q)) // 2)[1:]
assert len(s5) == len(phi) == N
assert phi.startswith("618033988749894848")
assert s5.startswith("236067977499789696")
L = 3
pairs = Counter()
for i in range(N - L + 1):
    a = int(phi[i:i+L])
    b = int(s5[i:i+L])
    carry = (b-2*a) % (10**L)
    assert carry in (0, 1), (i+1, a, b, carry)
    if a in (48,548):
        pairs[(a,b)] += 1
assert pairs == {
    (48,96):44, (48,97):53,
    (548,96):44, (548,97):56
}, pairs
def positions(seq, pattern):
    return [i+1 for i in range(len(seq)-len(pattern)+1)
            if seq[i:i+len(pattern)] == pattern]
p097 = positions(s5,"097")
assert len(p097) == 109
assert Counter(phi[i-1:i+2] for i in p097) == {"048":53,"548":56}
assert p097[:6] == [241, 1580, 1844, 4853, 7678, 8635]
assert phi[11515:11518] == "048" and s5[11515:11518] == "097"
assert phi[1810:1813] == "548" and s5[1810:1813] == "096"
print("All",N-L+1,"position-matched 3-digit windows obey the law.")
print("The 109 sqrt5=097 windows: 56 phi=548 and 53 phi=048.")
print("The 197 phi=048/548 windows:",dict(sorted(pairs.items())))
print("Counterexamples to an unconditional 548 ↔ 097 equivalence:")
print("position 11516: phi=048, sqrt5=097")
print("position 1811:  phi=548, sqrt5=096")
print("PASS")
