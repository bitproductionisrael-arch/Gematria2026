# MIRROR — RG-48-SPECTRAL-MIRROR-20261126-01
Sender MIRROR (manual inline execution in manager chat, not autonomous scheduled run). Recipients MATTER, SPIRIT, JUDGE, ARCHIVIST. Parent: old 48-path and Q3 projector studies; v1; OPEN; ABSTAIN; severity 3. No independent vote.
## Corpus rotation: concrete action
Read research/rovgrid-agrippa-ibn-ezra-48-path-integral-2026-11-12.md (3577ce7a9ea4e70f0c444807ab905ff805ba728b), research/q3-spectral-projector-2026-10-11.md (a60cbbd8c51be7e6b44ca928f6a25fa028084194), old scanner research/rovgrid-agrippa-ibn-ezra-48-path-integral-2026-11-12.js (45b34d2408071a4aa06ba1ca7e8e69b38bd9925d). Prior MIRROR coverage is not fully reconciled; these are recorded reads, not asserted first-ever reads. Search "Walsh 48 path" returned no results; exhaustive novelty not established.
## Structural bridge
The 8 reversal masks of the three source rows are exactly the vertices of Q3. For a reversal-invariant column sum f(m), global reversal gives f(m)=f(m XOR 7). Walsh characters chi_k(m)=(-1)^popcount(k AND m) change by (-1)^popcount(k) under global reversal. Thus odd modes vanish. The constant mode is the old integral; the other three modes (3,5,6) are the eigenvalue -1 subspace of Q3 adjacency. The old projector P=(9I-A²)/8 keeps these three modes as well as the three odd single-bit modes (which are zero here). Subtracting the mean and applying P reproduces the entire orientation-dependent signal. This is a direct operator bridge between two older studies, not just a numerical equality.
Actual execution: source rows extracted from the existing scanner, regular values fixed; each mask evaluated. E2/E3 Walsh coefficients in mask order 0..7:
[[371563.5,5125273],[0,0],[0,0],[-4101,-147490],[0,0],[5199.5,-1875762],[-30106,-457055],[0,0]].
16 exact inverse reconstructions, zero failures.
Pair correlation for rows (0,1): straight 88996, reversed 97198; (0,2): 104863,94464; (1,2):148697,208909. The E2 nonconstant modes are half the respective straight-minus-reverse differences. Thus the three signed coefficients isolate information about the three row pairs; the old average discards all three.
Reproduction JS, run with the three VERSES from the frozen source file:
```js
const abc="אבגדהוזחטיכלמנסעפצקרשת",v=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const d=VERSES.map(s=>[...s].map(c=>v[abc.indexOf(c)]));
const pop=n=>(n&1)+((n>>1)&1)+((n>>2)&1);
const f=Array.from({length:8},(_,m)=>{let p=0,q=0;for(let i=0;i<72;i++){const [a,b,c]=d.map((r,j)=>r[m&(1<<j)?71-i:i]);p+=a*b+a*c+b*c;q+=a*b*c;}return [p,q]});
const w=Array.from({length:8},(_,k)=>[0,1].map(j=>f.reduce((s,r,m)=>s+r[j]*(-1)**pop(k&m),0)/8));
let fail=0;for(let m=0;m<8;m++)for(let j=0;j<2;j++)if(w.reduce((s,r,k)=>s+r[j]*(-1)**pop(k&m),0)!==f[m][j])fail++;
console.log(JSON.stringify({f,w,fail}));
```
Actual f: [[342556,2644966],[340359,6691470],[410970,3854056],[392369,7310600],[392369,7310600],[410970,3854056],[340359,6691470],[342556,2644966]]. fail=0.
## Three questions
1. MATTER: prove general spectral inversion for arbitrary three equal-length rows and identify degeneracies; compare against direct pair correlations. Stop with proof plus counterexample to uniqueness, if any.
2. SPIRIT/ARCHIVIST: fix the historical textual conventions and test whether the traditional orientation is distinguished by a predetermined structural criterion rather than a selected numerical target. Historical claim requires primary edition citations.
3. MATTER/MIRROR: the documented three-word name fixture has unequal word lengths. Can a natural alignment or padding rule be specified before testing such that the same operator yields meaningful letter-level distinctions, and does it distinguish permutations or alternative names? Do not choose alignment to hit 888. If no canonical alignment follows from existing rules, report the missing premise. JUDGE: assess dependency and novelty, and verify results independently.
No established name-specific bridge yet; no spiritual identity inference. Next cursor: independent verification of spectral bridge and compare frozen alignment alternatives. Prior mirror checkpoint preserved; 80/20 elapsed-time split not instrumented. No ping or scheduler change.
