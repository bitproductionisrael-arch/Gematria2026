# Shaddai (שדי=314): synchronized decimal positions in nine constants

**Date:** 2026-11-17. **Scope:** nine mathematical constants, each using its first **100,000 decimal digits after the decimal point**, one-based indexing; integer digits excluded. Overlapping substrings are counted. This is a fresh *position-synchrony* question, distinct from the earlier *total-occurrence* count.

## 1. Exact 314 literal at the same decimal position

The literal three-digit substring `314` appears **888 times in total** across the nine constants. It starts at **exactly two positions** shared by two constants, with **no same-position intersection among 3 or more constants**:

| Start position after decimal | Constants sharing literal 314 |
|---:|---|
| **12,635** | √2 and √5 |
| **31,656** | √2 and √3 |

Thus **√2 participates in both** same-position coincidences. No position within the 100,000-digit window contains `314` simultaneously in all nine constants.

Related patterns under this **same-position** rule:

| Literal pattern | Aggregate total | Positions shared by ≥2 constants |
|---|---:|---:|
| `314` | 888 | **2** |
| `520` | 883 | **5** |
| `913` | 932 | **6** |
| `888` | 954 | **8** |
| `136` | 922 | **2** |

No pattern listed has a triple same-position collision in the first 100,000 decimal places.

## 2. Distinguish letter-address sampling from literal substring search

For an address tuple (a,b,c), extract **d_a d_b d_c**, the digits at three exact decimal positions, preserving the specified order. These positions are not required to be adjacent.

- **(300,1,400)** is the **mixed-letter-address** convention for `שית`: ש regular 300, י reduced 1, ת regular 400.
- **(300,1,4)** is a **different** three-address query.
- **(300,4,10)** represents **שדי** using all three **regular gematria values** (ש300, ד4, י10).
- **(21,4,10)** represents **שדי** using all three **ordinal gematria values** (ש21, ד4, י10).

| Constant | d300,d1,d400 | Squares total | d300,d1,d4 | Shaddai regular d300,d4,d10 | Shaddai ordinal d21,d4,d10 | Squares of ordinal digits |
|---|---:|---:|---:|---:|---:|---:|
| π | **314** | **26** | 315 | 355 | 255 | **54** |
| e | 976 | 166 | 972 | 924 | 024 | 20 |
| φ | 468 | 116 | 460 | 407 | 407 | 65 |
| √2 | 941 | 98 | 942 | 923 | 123 | 14 |
| √3 | 076 | 85 | 070 | 005 | 705 | 74 |
| √5 | 926 | 121 | 920 | 904 | 904 | 97 |
| √37 | 604 | 52 | 607 | 672 | 972 | 134 |
| √73 | 250 | 29 | 250 | 203 | 103 | 10 |
| √888 | 778 | 162 | 773 | 735 | 335 | 43 |

**Only π yields `314` from addresses (300,1,400)** among these nine constants; none of them returns `314` at addresses (300,1,4). In π, **d300,d1,d4 = 315**, whereas **d300,d1,d400 = 314**. The π squared-digit totals **26** and **54** were reproduced for the mixed `שית` addresses and the ordinal `שדי` addresses, respectively.

## 3. Search *all* 1,000 possible literal three-digit strings for same-position concordance

Scanning every starting position in the first 100,000 digits of each of the nine constants:
- No position has the **same three-digit literal in all nine** constants.
- The largest group sharing any three-digit literal at an identical starting position is **three constants**.
- There are **six** such triple coincidences:

| Start position | Literal | Same-position constants |
|---:|---|---|
| 5,665 | 610 | φ, √37, √73 |
| 58,006 | 948 | √5, √37, √73 |
| 65,494 | 414 | π, e, φ |
| 69,865 | 999 | φ, √2, √5 |
| 90,783 | 833 | e, √3, √888 |
| 97,653 | 518 | √3, √5, √73 |

### Statistical scope

For independent uniform random digits, a *preselected* three-digit literal in any fixed pair of 100,000-digit prefixes has an expected number of same-position matches of ~0.1; across 36 pairs, expected total ~3.6. The observed **2** for literal `314` are ordinary sampling variation. Real constants are deterministic, and φ and √5 have an algebraic relationship, so independence is an illustrative null model only. This scan does not show a nonrandom cross-constant mechanism.

**Reproducible program:** [rovgrid-shaddai-314-shared-positions-2026-11-17.py](rovgrid-shaddai-314-shared-positions-2026-11-17.py).
