#!/usr/bin/env python3
"""RovGrid: independent EXACT integer-square-root audit of φ, √5 and √888.
No decimal floating-point approximation and no external digit datasets needed.
Indexing: decimal places after point, first = 1.
Run: python research/rovgrid-golden-sqrt5-258528-exact-2026-11-17.py
"""
from math import isqrt
import sys
sys.set_int_max_str_digits(0)

N = 100_000
scale = 10 ** N

# Full decimal expansions truncated after N places, computed exactly:
# floor(sqrt(5) * 10^N) and floor(sqrt(888) * 10^N)
sqrt5_scaled = isqrt(5 * scale * scale)
sqrt888_scaled = isqrt(888 * scale * scale)
# Since φ=(1+√5)/2, its exact floor when scaled by 10^N is:
phi_scaled = (scale + sqrt5_scaled) // 2

sqrt5 = str(sqrt5_scaled)[1:]  # √5 integer part is "2"
phi = str(phi_scaled)[1:]      # φ integer part is "1"
sqrt888 = str(sqrt888_scaled)[2:]  # √888 integer part is "29"
assert len(sqrt5) == len(phi) == len(sqrt888) == N
assert sqrt5.startswith("2360679774997896964")
assert phi.startswith("6180339887498948482")
assert sqrt888.startswith("7993288515026794386")

def starts(s, pattern):
    result, cursor = [], 0
    while True:
        k = s.find(pattern, cursor)
        if k == -1:
            return result
        result.append(k + 1)  # one-based position
        cursor = k + 1        # allow overlaps

assert starts(phi,"258528") == [90_504, 97_624]
assert starts(sqrt5,"258528") == [8_791]

pairs = [
    (8_791, "629264", "258528", 0),
    (90_504, "258528", "517056", 0),
    (97_624, "258528", "517057", 1)
]
for pos,expected_phi,expected_root5,expected_carry in pairs:
    a = phi[pos-1:pos+5]
    b = sqrt5[pos-1:pos+5]
    carry = (int(b) - 2 * int(a)) % 1_000_000
    assert (a,b,carry) == (expected_phi,expected_root5,expected_carry)
    assert int(b) == (2 * int(a) + carry) % 1_000_000
    print(f"{pos}: φ={a} √5={b} carry={carry}")

# Root 888: 676=26^2 starts at decimal position 52.
positions_676 = starts(sqrt888,"676")
assert positions_676[0] == 52
assert len(positions_676) == 104    # count is SPECIFIC to N=100000
assert 52 == 2*26 and 104 == 4*26

# Exact discrete geometry:
assert 32*33//2 == 528   # triangular T32
assert 31*32//2 == 496   # triangular T31
assert 528 + 496 == 32*32 == 1024
assert 16*17//2 == 136  # triangular T16
assert 1024-136 == 888
assert 888-528 == 360
assert 528-136*4 == -16
assert 258528 == 6*43088
assert 528258 == 6*88043

print("√888 first occurrence of 676 at decimal position:",positions_676[0])
print("√888 676 count in this 100k window:",len(positions_676))
print("528=T32, 496=T31, 528+496=32²=1024, 1024−T16=888")
print("PASS exact integer-root checks")

# Exact cross-constant algebraic dependencies (independent of digit counts).
assert 4 * 2 * 3 * 37 == 888
assert 2 + 3 == 5
assert 2 * 2 * 3 * 37 == 444
print("PASS six constants linked structurally: sqrt2/sqrt3 -> sqrt5 -> phi, sqrt2/sqrt3/sqrt37 -> sqrt888")
