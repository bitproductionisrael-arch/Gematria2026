#!/usr/bin/env python3
"""RovGrid three-face minimal fourth-axis theorem, deterministic exact checks.
2026-11-07. Uses only Python standard library.
"""
from math import gcd, lcm, prod
from itertools import combinations

axes = (8, 20, 26)
labels = ("Amit / עמית", "Rov / רוב", "Mike / מייק")
opposite_indices = (0, 1, 2)
expect = [
    {"F": 520, "g": 8, "k": 1, "d": 65, "new": 3510,
     "e": (119, 4398, 61880, 270400)},
    {"F": 208, "g": 4, "k": 5, "d": 52, "new": 14040,
     "e": (322, 36240, 1674400, 27040000)},
    {"F": 160, "g": 2, "k": 13, "d": 80, "new": 56160,
     "e": (782, 206232, 21145280, 731161600)},
]
facts = []
for label, i, expected in zip(labels, opposite_indices, expect):
    s = axes[i]
    F = prod(x for j, x in enumerate(axes) if i != j)
    g = gcd(s, F)
    k, d = s // g, F // g
    D = tuple(k*x for x in axes) + (d,)
    e = tuple(sum(prod(p) for p in combinations(D, degree)) for degree in (1, 2, 3, 4))
    face_scaled = F*k*k
    assert F == expected["F"] and g == expected["g"]
    assert (k, d) == (expected["k"], expected["d"])
    assert all((m*F) % s != 0 for m in range(1, k)), "not minimal"
    assert d*s == k*F
    assert e[-1] == face_scaled**2
    assert e == expected["e"]
    assert d * sum(D[:3]) == expected["new"]
    facts.append((g,k,d))
    print(f"{label}: g={g}; k={k}; d={d}; dims={D}; e1..e4={e}")

assert prod(x[0] for x in facts) == 64
assert prod(x[1] for x in facts) == 65
assert prod(x[2] for x in facts) == 520**2
assert prod(axes)**2 // prod(x[0] for x in facts) == 520**2
assert lcm(*(x[1] for x in facts)) == 65
K = 65
uniform = [K * exp["F"] // axes[i] for i, exp in enumerate(expect)]
assert uniform == [65**2, 26**2, 20**2]
print("PROVED & VERIFIED: 65*52*80=520**2=270400; K_uniform=65; uniform fourth axes:", uniform)
