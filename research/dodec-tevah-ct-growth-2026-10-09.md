# Dodec × Tevah × Genesis — accumulation theorem (2026-10-09)

## Mathematical foundation, verified

Let T_m=m(m+1)/2, CT_m=1+3m(m−1)/2, Tet_m=m(m+1)(m+2)/6, and D_n=n(3n−1)(3n−2)/2 (OEIS A006566).

1. D_n = n*T_(3n−2) = Tet_(3n−2) = binomial(3n,3), for n>=1.
2. CT_m = T_m + T_(m−1) + T_(m−2) for m>=2 (and using T_-1=0 to extend to m=1).
3. D_n−D_(n−1)=T_(3n−2)+T_(3n−3)+T_(3n−4)=CT_(3n−2), for all n>=2. For n=1, D_1−D_0=1=CT_1 directly.
4. Hence D_n = sum_{k=1}^n CT_(3k−2). This is a general theorem, not a selected numeric match.

**n=6:** D_6=1+19+64+136+235+361=816. D_4−D_3=136=CT_10=T_16. D_6−D_5=361=CT_16=19². Also CT_16=3*T_16−3*16+1 is the count of unique nodes on the three exposed triangular faces of a Tet_16 lattice resting on its fourth face. *Numerical equality of counts, not a literal isometry or interchange of lattice points.*

## Anchor correspondence through the same nonadjustable index map

| D index | Tet index 3n−2 | T index and value | D_n | Context |
|---:|---:|---:|---:|---|
| 4 | 10 | T_10=55 | 220 | T_10=Pyr_5 |
| 6 | 16 | T_16=136 | 816 | 136=CT_10 |
| 13 | 37 | T_37=703 | 9139 | ואת הארץ regular=703 |
| 19 | 55 | T_55=1540 | 29260 | T_55=Tet_20 |
| 25 | 73 | T_73=2701 | 67525 | Genesis 1:1 regular=2701 |
| 46 | 136 | T_136=9316 | 428536 | Another index mapping |

Notes:
- 816+72=888; 816+208=1024; 208=72+136. This is arithmetic/semantic matching with named anchors, not a generative theorem about Dodec.
- Amit Mike Rov English Simple=136; English Gematria is defined as 6×simple, hence English Gematria=816; not an independent coincidence.
- 888, 1024, 2701 are **not** ordinary dodecahedral sequence values. 2701 is the TRIANGULAR value at index73; Dodec25=25×2701.
- The ordinary dodecahedral sequence and the centered dodecahedral sequence are *different*. Centered CDo_k=(2k+1)(5k²+5k+1), starting k=0: 1,33,155,427,...; CDo_1=33 is a numeric match to Hebrew-small עמית מייק רוב=33 (OEIS A005904).

## Genuine geometry of Q3 and dodecahedron

A regular dodecahedron has 20 vertices, 30 edges, and 12 pentagonal faces. In Euclid's construction it includes 8 vertices from an inscribed cube (±1,±1,±1), and 12 added vertices in three orthogonal golden rectangles (4 each). This is the independent geometric count 20=8+12, matching the second cumulative coordinate of B2=C(8,12,6)=(8,20,26). The cube's 12 edges and the dodecahedron's 12 extra vertices are *different geometric objects*; do not infer an automatic bijection.

## Source and classification

- OEIS https://oeis.org/A006566: standard dodecahedral numbers and relation to tetrahedral.
- OEIS https://oeis.org/A005904: centered dodecahedral.
- Euclid Book XIII Proposition 17: https://www.euclids-elements.org/elements/books/bookXIII/propositions/propXIII17/
- **Mathematical proved:** all displayed formulas, general CT growth identity, golden-ratio Cartesian construction.
- **Corpus bridges:** selected gematria values, Tevah axes, names, 72 names index, and Genesis, no claim of historical author intent or statistical significance.
- **Archival scans:** research/JUNK-dodec-accumulation-scan-2026-10-09.md.
