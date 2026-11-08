#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""RovGrid name/Pascal/2520 reproducer, 2026-11-08. Python 3.8+."""
from math import comb, factorial, gcd, isqrt

FACE_MIKE, FACE_AMIT, FACE_ROV = 160, 520, 208

def s(x: int, y: int, z: int) -> int:
    return FACE_MIKE * x + FACE_AMIT * y + FACE_ROV * z

def nonnegative_solutions(target: int):
    return [(x, y, z)
            for x in range(target // FACE_MIKE + 1)
            for y in range(target // FACE_AMIT + 1)
            for z in range(target // FACE_ROV + 1)
            if s(x, y, z) == target]

def triangle(n: int) -> int:
    return n * (n + 1) // 2

assert gcd(gcd(160, 520), 208) == 8
assert 160 + 520 + 208 == 888
assert s(-4, 0, 8) == 1024
assert s(4, 0, 2) == 1056  # correction of the earlier arithmetic error
assert not nonnegative_solutions(1024)
assert not nonnegative_solutions(1296)
assert nonnegative_solutions(1600) == [(10, 0, 0)]
assert s(-13, 2, 9) == 832  # correction of the earlier arithmetic error
assert nonnegative_solutions(784) == [(1, 0, 3)]

square_min_int = next(n*n for n in range(isqrt(888)+1, 100)
                      if (n*n) % 8 == 0)
square_min_nonnegative = next(n*n for n in range(isqrt(888)+1, 100)
                              if nonnegative_solutions(n*n))
assert (square_min_int, square_min_nonnegative) == (1024, 1600)

n_tri = next(n for n in range(1, 100)
             if nonnegative_solutions(triangle(n)))
assert n_tri == 32
assert nonnegative_solutions(triangle(32)) == [(2, 0, 1)]
assert triangle(32) == 528
assert sum([40, 80, 400, 8]) == 528  # מפתח

assert nonnegative_solutions(2520) == [(6, 1, 5), (6, 3, 0)]
assert 5 * 208 == 2 * 520
assert factorial(7) // factorial(2) == 2520  # permutations of מייקרוב

name = "עמיתמייקרוב"
hebrew = {"ע":70, "מ":40, "י":10, "ת":400, "ק":100,
          "ר":200, "ו":6, "ב":2}
assert len(name) == 11 and name[5] == "י"
weights = [comb(10, i) for i in range(11)]
full_pascal_fold = sum(hebrew[c] * weights[i] for i, c in enumerate(name))
central_pascal = hebrew[name[5]] * weights[5]
assert sum(weights) == 1024
assert central_pascal == 2520
assert full_pascal_fold == 83002

assert triangle(16) == 136
assert triangle(31) == 496
assert sum(k*k for k in range(1, 17)) == 1496 == 11 * 136
assert 2520 - 1024 == 1496
assert (10 * comb(10, 5) - 2**10) // 11 == 136
assert 160 - 136 == 520 - 496 == 1024 - 1000 == 24
assert 520 + 136 == 160 + 496 == 656
assert 2520 == 2000 + 520
assert 1496 == 1000 + 496
assert 3 * 160 + 4 * 136 == 1024
assert 2520 == 888 + 12 * 136
assert 2520 == 24 * 3 * 5 * 7

print("GCD of face values: 8")
print("Least perfect square >888, signed coefficients:", square_min_int)
print("Least perfect square >888, nonnegative coefficients:", square_min_nonnegative)
print("First positive triangular number, nonnegative coefficients:",
      f"T{n_tri}={triangle(n_tri)}")
print("All nonnegative representations of 2520:", nonnegative_solutions(2520))
print("Center Pascal contribution:", central_pascal)
print("Full Pascal fold:", full_pascal_fold)
print("Sum of first 16 squares:", sum(k*k for k in range(1, 17)))
print("Difference 520 - מלכות:", 520 - 496)
print("All checks passed.")
