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
## Exact equal-prefix window for 888 occurrences of 520

Extend the same nine constants by the same number of decimal places per constant. At **N=100,000**, the aggregate count of the literal `520` is **883**. The next five new matches, ordered by the decimal position where the third digit is first included, are:

| Constant | Start of `520` (1-based) | End / prefix length |
|---|---:|---:|
| √2 | 100,125 | 100,127 |
| √2 | 100,185 | 100,187 |
| √2 | 100,233 | 100,235 |
| e | 100,316 | 100,318 |
| √888 | 100,362 | **100,364** |

Thus the **smallest common equal-length prefix** beyond the original 100,000-digit window that yields exactly **888** occurrences is **100,364 digits after the decimal point per constant**, or **903,276 digits total** across all nine constants. The count stays at **888** for any integer prefix length **100,364 through 100,420 inclusive**; at **100,421**, the next `520` occurrence finishes (in e, starting at 100,419) and the aggregate becomes **889**.

The threshold requires complete 3-digit matches, not just the starting positions. The window was selected by scanning to the desired count; this is not an a-priori anomaly test. To independently reproduce, set `N=102000` in the Python code above, collect `pos+2` for every matching start position `pos` after the original window, and sort those endpoints across constants.

## Companion totals in the selected 100,364-digit window

All nine constants were recomputed at **exactly 100,364 decimal places each** (903,276 total decimal digits), retaining overlapping matches and excluding digits before the decimal point.

| Constant | 314 | 341 | 520 |
|---|---:|---:|---:|
| π | 94 | 106 | 97 |
| e | 110 | 105 | 103 |
| φ | 87 | 101 | 98 |
| √2 | 119 | 110 | 100 |
| √3 | 81 | 100 | 98 |
| √5 | 96 | 122 | 100 |
| √37 | 109 | 94 | 94 |
| √73 | 108 | 88 | 108 |
| √888 | 86 | 92 | 90 |
| **Total** | **890** | **918** | **888** |

Compared with the original 100,000-digit-per-constant sample, the added counts are **314:+2** (both in e), **341:+5** (π:+2, φ:+1, √5:+1, √37:+1) and **520:+5** (e:+1, √2:+3, √888:+1).

**314 count vs 520 count in this window: 890−888=2.** The window was expressly selected because the 520 count reached 888; other pattern counts are outcomes under that post-selected window, not independent predetermined predictions.

## Precise minimal common prefix where each target occurs exactly 888 times

A new exact cumulative count was run across **all nine constants**, always using the **same** first N decimal digits after the point from **each** constant. For each literal 3-digit substring, a match starting at 1-based position s becomes counted only after digit **s+2** is included. Across all nine lists, sort the match **ending positions** in ascending order. The 888th endpoint is the shortest uniform-prefix length that includes 888 occurrences; the 889th endpoint sets the exclusive upper bound. This is a strict minimum under the **equal-prefix-from-decimal-point** rule, not among arbitrary windows or differently sized prefixes.

| Literal pattern | Minimum N per constant | Total sample digits at N | 888th match / ending position | 889th match / ending position | Inclusive plateau of N with exactly 888 matches |
|---|---:|---:|---|---|---|
| **314** | **99,916** | **899,244** | π: start 99,914; end 99,916 | e: start 100,173; end 100,175 | **99,916–100,174** |
| **341** | **98,200** | **883,800** | √3: start 98,198; end 98,200 | √5: start 98,295; end 98,297 | **98,200–98,296** |
| **520** | **100,364** | **903,276** | √888: start 100,362; end 100,364 | e: start 100,419; end 100,421 | **100,364–100,420** |

For reference, at a common N=100,000, totals are `314=888`, `341=913`, `520=883`. The 314 count of 888 already holds at N=99,916, 84 digits before the original 100,000-digit cutoff. The minimum prefixes of these three patterns differ; **there is no single common N yielding exactly 888 occurrences for all three**, because the plateau ranges do not intersect.

### Minimal-window counts by constant

| Constant | 314 at N=99,916 | 341 at N=98,200 | 520 at N=100,364 |
|---|---:|---:|---:|
| π | 94 | 101 | 97 |
| e | 108 | 102 | 103 |
| φ | 87 | 97 | 98 |
| √2 | 119 | 109 | 100 |
| √3 | 81 | 98 | 98 |
| √5 | 96 | 118 | 100 |
| √37 | 109 | 88 | 94 |
| √73 | 108 | 84 | 108 |
| √888 | 86 | 91 | 90 |
| **Total** | **888** | **888** | **888** |

### Reproduction of the minimum and plateau

Run the scan above with `N = 101500`, collecting all full three-digit matches. For a `find` index `pos` (zero-based), the 1-based **start** is `pos+1` and the 1-based **end** is `pos+3`. Sort all endpoints across the nine constants for each pattern. Set `minimum_N = endpoints[887]`; the last N that preserves 888 is `endpoints[888]-1`. Both are exact integers given the source digits and the search convention.

**Methodological note:** Choosing a cutoff to *achieve* a target count is an endogenous stopping rule, and the exact equality alone does not establish an anomalous mathematical relationship. Expected sample lengths for 888 hits of a specified 3-digit pattern in nine iid uniform-digit streams are near 98,700–99,000 digits per stream; the observed thresholds are consistent with ordinary count variation.
