# Minimal equal-prefix windows: 314, 520, literal 913 → 888 total occurrences

**Date:** 2026-11-17  
**Correction:** The earlier search for `341` was introduced by the assistant, not requested by the researcher. It is **not** substituted for `913`. This report counts the literal `913` string (בראשית=913), as well as `314` (שדי=314) and `520` (עמית=520).

## Counting method

Nine constants: π, e, φ, √2, √3, √5, √37, √73, √888. For each fixed integer N, take the **first N digits after the decimal point** of each constant, not including integer digits. Count exact, full three-digit substrings `314`, `520`, `913` with overlap allowed. Add the counts across all nine. The **minimum N** is the first uniform prefix length where the aggregate reaches exactly 888. In the table, total scanned digits = 9N.

## Minimal thresholds, independently recalculated with mpmath at >102,000 digits of precision

| Literal pattern | Minimum N per constant | All constants: 9N digits | Total at N−1 | Total at N | 889th occurrence completes at N | N range with count exactly 888 |
|---|---:|---:|---:|---:|---:|---|
| `913` | **95,267** | **857,403** | 887 | **888** | 95,382 | 95,267–95,381 |
| `314` | **99,916** | **899,244** | 887 | **888** | 100,175 | 99,916–100,174 |
| `520` | **100,364** | **903,276** | 887 | **888** | 100,421 | 100,364–100,420 |

The 888th matches are:
- `913` in **√5**, starting at position 95,265 and ending at **95,267**.
- `314` in **π**, starting at 99,914 and ending at **99,916**.
- `520` in **√888**, starting at 100,362 and ending at **100,364**.

All positions are one-based decimal places after the decimal point.

## Counts compared in common windows

| N (digits per constant) | `314` | `520` | `913` |
|---|---:|---:|---:|
| 95,267 | 846 | 834 | **888** |
| 99,916 | **888** | 883 | 930 |
| 100,000 | **888** | 883 | 932 |
| 100,364 | 890 | **888** | 937 |

The minimal prefixes for `314` and `520` differ by **448 decimal digits per constant**, or **4,032 aggregate digits** across nine. No **single common N** has an aggregate count of exactly 888 for both `314` and `520`, or all three, because the exact-888 prefix intervals do not overlap.

## Per-constant breakdown at each pattern's own minimal N

| Constant | `913` at N=95,267 | `314` at N=99,916 | `520` at N=100,364 |
|---|---:|---:|---:|
| π | 104 | 94 | 97 |
| e | 113 | 108 | 103 |
| φ | 107 | 87 | 98 |
| √2 | 89 | 119 | 100 |
| √3 | 91 | 81 | 98 |
| √5 | 93 | 96 | 100 |
| √37 | 101 | 109 | 94 |
| √73 | 96 | 108 | 108 |
| √888 | 94 | 86 | 90 |
| **Total** | **888** | **888** | **888** |

## Exact reproducibility (Python, mpmath)

```python
import mpmath as mp

N = 102_000
mp.mp.dps = N + 30
constants = {
    "pi": mp.pi, "e": mp.e, "phi": (1 + mp.sqrt(5)) / 2,
    "sqrt2": mp.sqrt(2), "sqrt3": mp.sqrt(3), "sqrt5": mp.sqrt(5),
    "sqrt37": mp.sqrt(37), "sqrt73": mp.sqrt(73), "sqrt888": mp.sqrt(888)
}
patterns = ("314", "520", "913")
endpoints = {p: [] for p in patterns}
for name, value in constants.items():
    digits = str(value).split(".")[1][:N]
    assert len(digits) == N
    for p in patterns:
        start = 0
        while True:
            idx = digits.find(p, start)
            if idx < 0: break
            endpoints[p].append((idx + 3, name, idx + 1)) # 1-based end, name, 1-based start
            start = idx + 1

for p in patterns:
    hits = sorted(endpoints[p])
    minimum = hits[887][0]
    plateau_last = hits[888][0] - 1
    print(p, "minimum", minimum, "end of plateau", plateau_last, "888th", hits[887])
    assert sum(end <= minimum-1 for end,_,_ in hits) == 887
    assert sum(end <= minimum for end,_,_ in hits) == 888
assert sorted(endpoints["913"])[887][0] == 95_267
assert sorted(endpoints["314"])[887][0] == 99_916
assert sorted(endpoints["520"])[887][0] == 100_364
```

## Interpretation

A stopping point **chosen to produce exactly 888 matches** must not be presented as an independent prediction. The resulting close-to-100,000 prefix lengths are statistically plausible for three-digit strings whose expected frequency is ~1/1000. This report establishes reproducible counting results, not an anomalous mechanism linking the constants and gematria. Source of the initial 100,000-digit scan: [Shaddai 314 report](rovgrid-shaddai-314-homepower-scan-900k-2026-11-17.md).
