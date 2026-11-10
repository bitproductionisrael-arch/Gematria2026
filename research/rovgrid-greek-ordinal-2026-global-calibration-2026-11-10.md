# 2026 Greek Ordinal — Global Calibration Mapping (2026-11-10)

## Status
Research-defined **single global permutation** of 27 Greek alphabetic numeral signs. It is a modern RovGrid experimental cipher, **not** a reconstructed ancient Greek historical alphabet.

Working standalone interactive laboratory: [2026 Greek Ordinal](../greek-ordinal-2026-lab.html).

The canonical ancient 27-sign numeric alphabet used here:
\`αβγδεϝζηθικλμνξοπϙρστυφχψωϡ\`.

- Ancient 27-sign ordinal = each symbol's 1-based position in this sequence.
- Modern 24-letter ordinal = each of the 24 current Greek letters' 1-based position in \`αβγδεζηθικλμνξοπρστυφχψω\`. The obsolete signs have no historical "modern ordinal"; in the interactive lab only, the remaining unused values 25,26,27 are assigned to ϝ,ϙ,ϡ for comparison within the 27-value permutation engine.
- 2026 baseline = ancient 27-sign ordinal with the two transpositions **Υ ↔ Σ (22 ↔ 20)** and **Ω ↔ ϡ (26 ↔ 27)**. Every value from 1 to 27 occurs exactly once.

## Core values

| Expression | Ancient | Modern | 2026 | Greek Isopsephy |
|---|---:|---:|---:|---:|
| ΗΙΟΩ | 60 | 55 | **61** | **888** |
| ΑΕΥ | 28 | 26 | **26** | **406** |
| ΑΕΗΙΟΥΩ | 88 | 81 | **87** | **1294** |
| ΑΩ | 27 | 25 | **28** | 801 |

2026 explicit letter values in the anchor groups:
- Η=8, Ι=10, Ο=16, Ω=27 → 8+10+16+27=61.
- Α=1, Ε=5, Υ=20 → 1+5+20=26.
- All seven vowels: 61+26=87.

Hebrew comparison notes: אני = 61 regular; עמית = 61 ordinal; יהוה = 26 regular; אתה = 406 regular; the four-vowel Greek isopsephy ΗΙΟΩ = 888. These are comparisons across explicitly different cipher systems, not literal translations.

## Minimal transposition count
Starting at ancient, the required differences in the disjoint anchor groups are +1 for ΗΙΟΩ and −2 for ΑΕΥ. A single swap either changes only one group, or exchanges one symbol from each group and therefore changes their totals by equal magnitude with opposite signs. Since +1 ≠ +2, **at least two transpositions** are needed. The 2026 baseline realizes the targets in exactly two.

## Global invariant and calibration rules
1. Store one mapping \`symbol → integer\` over all 27 Greek signs. It must be a permutation of 1…27.
2. Manual edit = swap values with the current occupant; never duplicate a value.
3. Applying a change recalculates every input phrase; no per-word exceptions.
4. Anchor lock preserves ΗΙΟΩ=61 and ΑΕΥ=26 while calibrating. Unlocking allows exploration beyond the anchor baseline.
5. A target corpus may contain multiple desired phrase totals. The search optimizes **all** requested totals using one permutation, and reports mismatches rather than silently changing methods.
6. The interactive automatic search is a finite stochastic heuristic, not a uniqueness or existence proof. JSON export captures a reproducible full mapping and corpus.
7. For claims of predictive value, separate calibration phrases from **held-out words** never used to choose the mapping, freeze the map, and report both successes and failures. Avoid tuning each word to a requested result after seeing it.

## Deployment boundaries
This new lab was created as an independent page. Existing \`calculator.html\`, \`corpus-data.json\`, and the site's default front page were not modified.

Reproducible arithmetic: [Python verification](rovgrid-greek-ordinal-2026-verify.py).
