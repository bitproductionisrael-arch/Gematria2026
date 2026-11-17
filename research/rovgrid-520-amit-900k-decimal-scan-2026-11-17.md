# RovGrid — Amit 520 literal scan in the same 900,000-decimal-digit window

**Date:** 2026-11-17  
**Scope:** Exactly the same nine constants and 100,000 digits after the decimal point per constant as in [the Shaddai 314 / 341 audit](rovgrid-shaddai-314-homepower-scan-900k-2026-11-17.md). First digit after the decimal point is position 1. Counts include overlapping occurrences.

## Recomputed counts

| Constant | 314 | 341 | 520 |
|---|---:|---:|---:|
| π | 94 | 104 | 97 |
| e | 108 | 105 | 102 |
| φ | 87 | 100 | 98 |
| √2 | 119 | 110 | 97 |
| √3 | 81 | 100 | 98 |
| √5 | 96 | 121 | 100 |
| √37 | 109 | 93 | 94 |
| √73 | 108 | 88 | 108 |
| √888 | 86 | 92 | 89 |
| **Total** | **888** | **913** | **883** |

The existing published totals **314→888** and **341→913** were independently reproduced in the same computation, checking that the original window was correctly reconstructed.

**520→883**, i.e. 17 fewer than the approximate uniform-digit expectation of 900. The first five decimal positions of 520 within π: **325, 1049, 1845, 2912, 3006**; within √73: **385, 2444, 3380, 3774, 3914**. Positions are 1-based, measured after the decimal point.

## Statistics / scope

A specified 3-digit pattern in 100,000 decimal digits has expected count (100,000−2)/1000 ≈ 100 under an iid uniform-digit null. Across nine prefixes, expectation ≈ 900; standard deviation roughly 30. Thus 520→883 is not unusually far from the baseline. The difference 888−883=5 is an exact difference between these two observed counts, not independently a statistical signal. Digit normality for these mathematical constants is not established by this sample.

## Reproduction (Python 3, mpmath)

```python
import mpmath as mp

N = 100_000
mp.mp.dps = N + 100
constants = {
    "pi": mp.pi, "e": mp.e, "phi": (1 + mp.sqrt(5))/2,
    "sqrt2": mp.sqrt(2), "sqrt3": mp.sqrt(3), "sqrt5": mp.sqrt(5),
    "sqrt37": mp.sqrt(37), "sqrt73": mp.sqrt(73), "sqrt888": mp.sqrt(888),
}

def count_overlaps(text, pattern):
    count, start = 0, 0
    while True:
        ix = text.find(pattern, start)
        if ix == -1:
            return count
        count += 1
        start = ix + 1

total = {p: 0 for p in ("314", "341", "520")}
for k, v in constants.items():
    digits = str(v).split(".")[1][:N]
    assert len(digits) == N
    row = {p: count_overlaps(digits, p) for p in total}
    print(k, row)
    for p in total:
        total[p] += row[p]
print(total)
assert total == {"314": 888, "341": 913, "520": 883}
```

This is a follow-up count, not proof of a nonrandom property.