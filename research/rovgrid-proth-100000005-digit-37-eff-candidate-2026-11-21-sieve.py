#!/usr/bin/env python3
# RovGrid / Gematria2026 — 100,000,005-digit Proth candidate, NOT PROVEN PRIME.
# pip install sympy
# Run: python research/rovgrid-proth-100000005-digit-37-eff-candidate-2026-11-21-sieve.py
from decimal import Decimal, localcontext, ROUND_FLOOR
from sympy import primerange
EXP = 332_192_822
K = 9
BOUND = 1_000_000
assert EXP % 20 == 2
assert K % 2 == 1
assert 0 < K < 2 ** 8 < 2 ** EXP  # Proth form k * 2^n + 1
assert (K * pow(2,EXP,100) + 1) % 100 == 37
with localcontext() as ctx:
    ctx.prec = 90
    magnitude = Decimal(EXP) * Decimal(2).log10() + Decimal(K).log10()
    # 0 < 1 / (K*2^EXP) << 1e-70, hence +1 cannot cross a decimal digit boundary.
    assert Decimal('100000004.72') < magnitude < Decimal('100000004.73')
    digit_count = int(magnitude.to_integral_value(rounding=ROUND_FLOOR)) + 1
assert digit_count == 100_000_005
tested = 0
for p in primerange(2, BOUND):
    tested += 1
    residue = (K * pow(2,EXP,int(p)) + 1) % int(p)
    assert residue != 0, f"COMPOSITE: small factor {p}"
assert tested == 78_498
print(f"UNPROVEN CANDIDATE = {K} * 2^{EXP} + 1")
print("Decimal digits:", digit_count)
print("Last 2 decimal digits: 37")
print("Checked prime divisors below",BOUND,":",tested)
print("NOT PROVEN PRIME. NO PRIZE CLAIM.")
print("A Proth primality certificate would require a verified base a such that:")
print("pow(a, (N-1)//2, N) == N-1, plus independent replication.")
