#!/usr/bin/env python3
"""2026-11-17: same-start-position coincidences and letter-address extractions.
python -m pip install mpmath
python research/rovgrid-shaddai-314-shared-positions-2026-11-17.py
"""
import mpmath as mp
from collections import Counter, defaultdict

N = 100_000
mp.mp.dps = N + 100
constants = {
    "pi": mp.pi,
    "e": mp.e,
    "phi": (1 + mp.sqrt(5)) / 2,
    "sqrt2": mp.sqrt(2),
    "sqrt3": mp.sqrt(3),
    "sqrt5": mp.sqrt(5),
    "sqrt37": mp.sqrt(37),
    "sqrt73": mp.sqrt(73),
    "sqrt888": mp.sqrt(888),
}
digits = {k: str(x).split(".")[1][:N] for k, x in constants.items()}
assert all(len(s) == N for s in digits.values())

def locations(s, pattern):
    found = []
    i = 0
    while (i := s.find(pattern, i)) != -1:
        found.append(i + 1)  # one-based starting decimal position
        i += 1               # overlapping occurrences count
    return found

def same_index(pattern):
    positions = defaultdict(list)
    for k, s in digits.items():
        for pos in locations(s, pattern):
            positions[pos].append(k)
    return sorted((pos, tuple(names)) for pos, names in positions.items() if len(names) >= 2)

expected = {
    "314": (888, [(12635, ("sqrt2", "sqrt5")), (31656, ("sqrt2", "sqrt3"))]),
    "520": (883, None),
    "913": (932, None),
    "888": (954, None),
    "136": (922, None),
}
for pattern, (expected_total, expected_shared) in expected.items():
    total = sum(len(locations(s, pattern)) for s in digits.values())
    shared = same_index(pattern)
    assert total == expected_total, (pattern, total, expected_total)
    if expected_shared is not None:
        assert shared == expected_shared, shared
    print(pattern, "total", total, "same_index", shared)

def sample(s, addresses):
    return "".join(s[i - 1] for i in addresses)

for k, s in digits.items():
    mixed = sample(s, (300, 1, 400))  # Shin=300, Yod reduced=1, Tav=400
    shorter = sample(s, (300, 1, 4))
    shaddai_regular = sample(s, (300, 4, 10))
    shaddai_ordinal = sample(s, (21, 4, 10))
    squares = sum(int(x)**2 for x in mixed)
    ordinal_squares = sum(int(x)**2 for x in shaddai_ordinal)
    print(k, "300,1,400:", mixed, "squares:", squares,
          "300,1,4:", shorter,
          "Shaddai regular 300,4,10:", shaddai_regular,
          "Shaddai ordinal 21,4,10:", shaddai_ordinal,
          "ordinal squares:", ordinal_squares)

assert sample(digits["pi"], (300, 1, 400)) == "314"
assert sum(int(x)**2 for x in sample(digits["pi"], (300, 1, 400))) == 26
assert sample(digits["pi"], (300, 1, 4)) == "315"
assert sample(digits["pi"], (300, 4, 10)) == "355"
assert sample(digits["pi"], (21, 4, 10)) == "255"
assert sum(int(x)**2 for x in sample(digits["pi"], (21, 4, 10))) == 54

max_group = 0
max_examples = []
triple_matches = []
for i in range(N - 2):
    at_position = defaultdict(list)
    for key, s in digits.items():
        at_position[s[i:i+3]].append(key)
    m = max(map(len, at_position.values()))
    if m > max_group:
        max_group = m
        max_examples = []
    if m == max_group:
        max_examples.append(i + 1)
    if m >= 3:
        triple_matches.extend(
            (i + 1, p, keys)
            for p, keys in at_position.items() if len(keys) >= 3
        )
print("Max constants sharing ANY 3-digit literal at one index:", max_group)
print("All positions with >= 3 constants:", triple_matches)
assert max_group == 3
assert [(loc, p) for loc, p, _ in triple_matches] == [
    (5665, "610"), (58006, "948"), (65494, "414"),
    (69865, "999"), (90783, "833"), (97653, "518")
]
print("PASS: nine constants x 100,000 decimal digits")
