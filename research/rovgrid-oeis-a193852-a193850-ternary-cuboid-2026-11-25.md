# RovGrid — OEIS A193852 / A193850, ternary grid and cuboid selector
2026-11-25 · OPEN / independent review pending.
Primary sources (Clark Kimberling, 2011-08-07): https://raw.githubusercontent.com/oeis/oeisdata/main/seq/A193/A193852.seq and https://raw.githubusercontent.com/oeis/oeisdata/main/seq/A193/A193850.seq . Direct OEIS HTTP 403; official data mirror accessible. A193852 is exactly half A193850.

## Theorems
For n>=1 and positive integer q, define B(n,k;q)=sum_{j=0..k} C(n,j) q^(n-j), k=0..n-1. At q=2 these are A193850 rows, and B/2 are A193852 rows. For q=2, grid {-1,0,1}^n has C(n,j)2^(n-j) points with j zero coordinates. Negation pairs all nonzero points without fixed points; thus B/2 counts antipodal pairs cumulatively. This is an orbit-count interpretation, not an assertion about original author intent.
Last entry B(n,n-1;q)=(q+1)^n-1. Row sum = sum_{j=0..n-1}(n-j) C(n,j) q^(n-j)=n q(q+1)^(n-1), by binomial derivative or (n-j)C(n,j)=n C(n-1,j).
For q=2 half-row sum n*3^(n-1) equals 3^n iff n=3. Rows n=1..6: [2], [4,8], [8,20,26], [16,48,72,80], [32,112,192,232,242], [64,256,496,656,716,728].
n=3: 8 corners, 12 edge midpoints, 6 face centers, 1 center. Antipodal orbit counts 4,6,3; cumulatives 4,10,13. Doubled cumulatives 8,20,26. 4+10+13=27; 8+20+26=54.
For n=3, a=q^3,b=q^3+3q^2,c=q^3+3q^2+3q. Expand ab+ac+bc=3q^6+12q^5+15q^4+9q^3=3q^3*((q+1)^2*(q+2)+1). At q=2 the factors are 24 and 37, giving 888. Faces 160,208,520; volume 4160. Half row has faces 40,52,130 (sum 222) and volume 520; equality of small volume and large bc face follows from a/2=4 and scale factor 4.
Generalized grid selector: row sum 54 implies n q(q+1)^(n-1)=54. n>=5 impossible since min n*2^(n-1)>=80. n=4 yields 32 at q=1 and >=216 for q>=2. n=2 requires q(q+1)=27, impossible. n=1 permits q=54 (not a cuboid). n=3 gives q=2 uniquely by monotonicity. This is uniqueness within declared family, not a universal uniqueness or probability claim.
Previous corpus proved only sorted positive integer triples with e1=54,e2=888 are (8,20,26) and (10,16,28). The OEIS row selects the former under the declared rule. See research/rovgrid-triangular-t37-t73-t16-reconstruct-twin-cuboids-2026-11-20.md. The constraints are not independent once the grid is chosen.
## Algebraic extension
The descending coefficient row polynomial D_n(x)=((2x+1)^n-3^n)/(x-1), polynomial with removable singularity at x=1. This follows by expanding (2x+1)^n and telescoping cumulative coefficients. Roots x=(3ζ-1)/2 for nontrivial nth roots of unity ζ. Thus the half-row polynomial for n=3 is P(x)=4x²+10x+13, discriminant -108, 4P(x)=(4x+5)^2+27, P(1)=27, P(-1)=7, P(2)=49, P(-2)=9. These evaluations are derived identities, not independent evidence.
Cross-dimensional comparison: first terms of doubled rows n=4,5 are 16,32; T16=136 and 32²=1024. Thus T16+e2(row3)=32². Choice of these operations is motivated by existing corpus and is post hoc; do not count as an independent probability result.
## Verification
225 exact checks executed in JS: n=1..30 four invariants each; q=1..100 face-sum factorization; exhaustive sorted integer triples with e1=54; grid search n,q=1..54; three volume/face identities. All passed. Independent council reproduction still required.
## Review requests
MATTER: independently prove all formulas and investigate other q/n, root geometry, and constraints.
MIRROR: invert row from cumulative differences and assess dependence/alternative models, pre-register null comparisons.
ARCHIVIST: inspect original fission definition, publication history, related OEIS rows and prior literature.
SPIRIT: compare historical symbolism of 3D grid, center and antipodal pairing, with sources; distinguish numerical identity from interpretation.
WORK/JUDGE: audit proof and selection effects; no claim of statistical anomaly or personal identity established.
