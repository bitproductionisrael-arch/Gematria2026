# RovGrid: positive verified matches of 258 and 528 in nine mathematical constants

**17 November 2026.** The researcher requested focus on reproducible positive matches, not the archive of failed pattern searches. This report documents the original **100,000 decimal places after the point** for each of **π, e, φ, √2, √3, √5, √37, √73, √888**. All positions are **1-based starting decimal positions**, and overlapping matches are allowed.

**Number anchors:** AMIT (English Simple A1–Z26) = 43, ×6 = **258**. `מפתח` (Hebrew regular) = 40+80+400+8 = **528**. The triplets are permutations of the same digits 2,5,8: each has digit sum **15**, sum of squared digits **93**, and digit product **80**. Their numerical difference is **270**.

## 1. Exact literal frequency in the shared 900,000-digit sample

| Constant | 258 | 528 |
|---|---:|---:|
| π | 97 | 97 |
| e | 111 | 84 |
| φ | 106 | 93 |
| √2 | 89 | 111 |
| √3 | 108 | 89 |
| √5 | 76 | 116 |
| √37 | 100 | 101 |
| √73 | 97 | 104 |
| √888 | 108 | 112 |
| **Total** | **892** | **907** |

The **combined total is 1,799**, one lower than the approximate null expectation **1,800** (two prespecified triplets over 900,000 approximately uniformly-distributed digits). Exact frequencies depend on the fixed cutoff, which should not be tuned post hoc if conducting a significance test.

## 2. Exactly adjoining occurrences of the two full strings

A literal six-digit `258528` occurs **five times** in these nine prefixes:

| Constant | First decimal position |
|---|---:|
| φ | 90,504 |
| φ | 97,624 |
| √3 | 30,240 |
| √5 | 8,791 |
| √73 | 86,493 |

The reverse ordering **`528258`** also occurs, in **π** at position **76,909**.

Therefore these two six-digit combinations have **six exact adjoining appearances** in the nine-constant 900,000-digit sample. Under a toy model of independent uniform digits, the expected number of occurrences of two specified six-digit patterns across the nine prefixes would be approximately **1.8**. The patterns and links were chosen during exploratory research; this comparison is descriptive, **not** a post-selection corrected significance claim. φ and √5 are algebraically related.

## 3. Same literal at exactly the same position in different constants

| Shared start position | Literal | Constants |
|---:|---|---|
| **80,153** | 258 | √2 and √888 |
| **10,789** | 528 | π and e |
| **43,007** | 528 | √5 and √37 |
| **83,376** | 528 | √73 and √888 |
| **89,317** | 528 | π and √5 |

These are exact co-locations of the **same three-digit string** in different decimal expansions.

## 4. The two strings at the same decimal position in different constants

| Shared start position | 258 occurs in | 528 occurs in |
|---:|---|---|
| **11,418** | √3 | √73 |
| **29,175** | √888 | √2 |
| **95,298** | √37 | √5 |
| **99,365** | e | √2 |

This is a second, distinct kind of co-location: **different strings**, same index, one in each constant.

## 5. Confirmed previous positive observation from √2 at `פאי` addresses

Uniform regular Hebrew letter addresses `פאי`: פ=80, א=1, י=10. In √2 decimal digits at those positions, the extraction is exactly **343**, a palindrome and **7³**. The squared-digit sum is **3² + 4² + 3² = 34**. AMIT in English Simple is **43**, whose decimal digit reversal is **34**. These identities are correct; the identity `34 ↔ 43` is based on reversal of the decimal representation, not equality of 34 and 43. In π the same addresses produce **915**.

## Reproduce

Execute [rovgrid-258-528-nine-constants-2026-11-17-verify.py](rovgrid-258-528-nine-constants-2026-11-17-verify.py). The Python script independently reconstructs every digit prefix using **mpmath**, asserts the totals, exact same-position pairs, four cross-pattern matches, six adjacent-string locations, and the √2 address extraction.

**Scope:** all observations above are exact finite-prefix properties, but exploratory pattern matching across many candidates does not by itself establish a physical, theological, or statistically anomalous causal mechanism.
