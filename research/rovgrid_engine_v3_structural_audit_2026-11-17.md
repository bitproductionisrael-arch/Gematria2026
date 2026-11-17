# ROVGRID v3 — structural audit: Fibonacci/Cassini π bridge, d=67 and Euler

Date: 2026-11-17. Research reference implementation in Python 3 standard library. This is **not** a security- or hardware-certified implementation. All mathematical statements below were checked with exact integers/rationals or high-precision Decimal computations.

## Major finding: Cassini's identity implies a telescoping π formula

Using F(0)=0, F(1)=1, F(n+2)=F(n+1)+F(n):

**F(2m+1)^2 − F(2m) F(2m+2) = 1**.

Also F(2m+2)−F(2m) = F(2m+1). By the arctangent subtraction rule,

**atan(1/F(2m)) − atan(1/F(2m+2)) = atan(1/F(2m+1)).**

The right-hand terms telescope, so for *every positive integer M*:

**π = 4 × [Σ(m=1..M) atan(1/F(2m+1)) + atan(1/F(2M+2))]**.

The residual after omitting the correction is **exactly** 4atan(1/F(2M+2)), which is strictly less than **4/F(2M+2)**. With M=1 the finite identity reads **π=4[atan(1/2)+atan(1/3)]**. These are classical identities following from Cassini, **not a new discovery about π**. The point of their inclusion is that they provide a **proved circular branch tied to the Fibonacci integer recurrence**.

Without the correction, M=23 has an error ≈ 8.320286×10⁻¹⁰, while M=38 has an error ≈ 4.472075×10⁻¹⁶. The latter requires F(78)=8,944,394,323,791,464, exceeding 32-bit storage. Thus the earlier *F(47) 32-bit MCU / 15-digit circular accuracy* pairing is unsupported: grade 47 is an excellent φ, √5 rational approximation, **but does not give 15-digit π from the uncorrected arctan series**.

## Target 528 / d=67 vs Chudnovsky d=163

- 528 = 33×(√2)^8 = 33×16, so the **integer 528** can be generated without an operational √2 register. This is an algebraic rewrite, not proof of functional independence of all linked subroutines.
- The standard Chudnovsky series with coefficients **13,591,409 / 545,140,134**, base **640,320**, and radicand **10,005** is the **d=163** construction, not the d=67 series. Source: [FLINT mathematical constants documentation](https://flintlib.org/doc/constants.html).
- The proposed **12 × Σ ((−1)^k (6k)! (154865+6314415k)) / (...) / (5280³)^(k+1/2)** is **not a valid identity for 1/π**. The proposed series evaluates near **4.84377124**, whereas **1/π≈0.318309886**.
- The actual published d=67 Ramanujan–Sato series is **1760√330 / π = Σ(n≥0) (10177 + 261702n) t(n)** with **t(0)=1** and **t(n+1) = t(n) × [−24(6n+1)(2n+1)(6n+5)]/[5280³(n+1)³]**. It uses a directly computed √330 but **no input from the Δ2 register**. The algebraic number √330 is nonetheless √2×√165; implementation independence ≠ algebraic independence. Published source: [Hemmecke, Paule & Radu, Ramanujan Journal, 2026, equation 95](https://link.springer.com/article/10.1007/s11139-026-01352-2).
- Terms for high precision (verified against independently computed π): **50 terms ≈397 decimal digits; 63 terms ≈500; 65 terms ≈516**. Chudnovsky d=163 reaches >500 digits with **36 terms**. Therefore the claimed improvement “50 vs. 63 terms” for d=67 at 500-digit precision is false. Loop iteration count is also not synonymous with wall-clock speed.
- The chudnovsky d=163 anchor is even stronger for cross-check when operational isolation is desired: its √10005 and factorial recurrence can be kept independent of the Borwein sqrt2 register, though its source proof is modular, not hardware-independent.

## Euler branch e — exact rational binary splitting is sound; truncation is not

The pasted `_binary_split_e` recurrence **is correct** when read as a *factorial-chain splitting*: `(P1,Q1)` and `(P2,Q2)` are not independent ordinary rational sums over those subranges. The merger **P=P1×Q2+P2, Q=Q1×Q2** correctly builds Σ(±1)^k/k! from k=0 onward. The first four non-alternating terms produce **P/Q=16/6=8/3**; alternating **P/Q=2/6=1/3**.

The convergents of e follow **[2; 1,2,1,1,4,1,1,6,...]** and k=1..7 return 3/1, 8/3, 11/4, 19/7, 87/32, 106/39, 193/71, as specified.

Truncation at k=219 (**220 terms**) gives **e−e_M≈4.39845×10⁻⁴²²**, and **|e_M×inv_e_M−1| ≈1.34666×10⁻⁴²¹**. It therefore **fails a tolerance of 10⁻⁵⁰⁰ even with correct hardware**. A run with **260 terms** yields residual order **10⁻⁵¹⁷** and passes. More robust code chooses M adaptively from the factorial bound. Two branches using the *same* factorial-splitting routine are not hardware-independent merely because their signs differ. The Euler–π exponential near-integer of d=58 is **not an exact cross-lock**: exp(π√58)−(396⁴−104)≈−1.7778675853×10⁻⁷, even when π is correct.

## Micro-seed Fibonacci: limits of hardware claims

- **φ_k=F(k)/F(k−1)** and **(√5)_k = 2φ_k−1** are correct rational approximations. Cassini's **signed** determinant is F(k)F(k−2)−F(k−1)²=(−1)^(k−1).
- The proposed weaker **absolute-value** lock is *not a 100% single-bit fault detector*: at k=3, registers (F3,F2,F1)=(2,1,1) give |2×1−1²|=1. After a **one-bit flip F1:1→0**, the corrupted state (2,1,0) gives |2×0−1²|=1 as well. Thus an actual single-bit fault escapes the claimed lock. The signed invariant would catch this example, but itself does not prove universal physical fault coverage.
- At grade 47, **F47=2,971,215,073** fits unsigned 32 bits, but **2×F47=5,942,430,146 does not**. The numerator of the √5 rational projection is **4,106,118,243** (fits 32 bits *if* the intermediate is 64-bit). The Cassini products require 64-bit intermediates. To support 15-digit *π* via uncorrected arctans requires substantially larger Fibonacci indices than grade 47.
- “0 bytes ROM” is not possible for executable software: at most, no **lookup-table ROM** is required. “<32 bytes RAM”, exact CPU-cycle estimates, absence of multiplication, and “100% detection” are not established by Python arithmetic; an actual target ISA, code size, register conventions, overflow semantics, compiler, and fault-injection tests are required.
- The Fibonacci arctan sum offers a clean **third numerical cross-check path** independent of modular function constants. Its speed and memory behavior have to be measured separately.

## Code and tests

- [Reference implementation](rovgrid_engine_v3_structural.py): Fibonacci signed lock, rational φ and √5, finite π arctan formula, Euler carrier and exact rational splitting, d=67 √330 series, d=163 √10005 series.
- [Automated tests](test_rovgrid_engine_v3_structural.py): seven test groups passed, including one-bit flip false-negative, 220 vs. 260 Euler terms, 50 vs. 65 d=67 terms, exact arctan telescoping and three-way 120-digit π cross-check.

On the local machine, the three independently evaluated π paths matched within 120-digit Decimal output; a 520-digit cross-check also produced identical 520-digit rounded values. **Agreement is numerical evidence of correct implementation, not a formal certification of hardware reliability.**