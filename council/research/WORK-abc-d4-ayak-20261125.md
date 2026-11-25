# WORK independent partial audit — 2026-11-25
Formation: no lock or vote. Sources: ABC_DELTA_INFINITE_WEB.md, calculator.html (a36b65dcb6f228756a6744d5507ab135065a8021), research/rovgrid-10-levels-d4-to-genus-376-harmonic-2026-11-14.md, research/rovgrid-square-ring-d4-primitive-2026-11-07.md, research/ROVGRID_UNIFIED_GENERATIVE_THEORY_ABC_Q3_Q8_LATTICES_INFORMATION_TIME_2026-11-17.md. Prior WORK feedback read; lexical population not obtained; prioritize exact adjacency and mandatory ABC cycle. 
WORK-D4-ADJ-v1: quotient of 2n square grid under D4 is triangular coordinate domain 0<=i<=j<n (absolute doubled centered coordinates). Ignore loops and parallel edges. Horizontal/vertical unit edges each count n(n-1)/2, total n(n-1). At n=16 actual quotient has 136 vertices and 240 edges, NOT 1024. K(8,128) is a separate construction, as source already acknowledges. Grade 4 conditional on simple quotient convention. 
WORK-ABC-SEED-v1: B=d(d-1)/2,C=d(d+1)/2 satisfy difference-square identity for all integer d. d=1 gives zero B; exclude if positive required. Base=1+d² is an additional rule, not implied by identity alone. Grade 4 for identity, no physical conclusion. 
WORK-AYAK-CLOSURE-v1: calculator's actual 27-letter chamber cycle does not restrict to 22-letter permutation. Five transitions leave alphabet; input without final letters is not sufficient for full orbit closure. Grade 4. 
Duplicate check: D4 construction caveat already documented; explicit quotient edge count is refinement, corpus-wide novelty not established. ABC family previously discussed; no novelty claim. AYAK closure follows calculator definition. 
Actual JS output below. D4 loop checks formula consistency only, not explicit graph enumeration. 3 claim groups, 2 previously covered research files revisited, 1 new research file partially inspected; no full corpus coverage claim. 80/20 time split not measured. Prospects high for graph enumeration, medium for lexical data, low for physical inference. Next: enumerate quotient edges from original grid, freeze held-out generator comparison, obtain lexical controls. No final decision.

```js
const A='אבגדהוזחטיכלמנסעפצקרשת', F='ךםןףץ';
const chambers=Array.from({length:9},(_,i)=>[A[i],A[i+9],i<4?A[i+18]:F[i-4]]);
const next=Object.fromEntries(chambers.flatMap(t=>t.map((l,i)=>[l,t[(i+1)%3]])));
const missing=Array.from(A).filter(l=>F.includes(next[l]));
const orbit=(l)=>[l,next[l],next[next[l]]];
const name='עמיתמייקרוב';
const outside=Array.from(new Set(Array.from(name).filter(l=>orbit(l).some(x=>F.includes(x)))));
let grids=[];for(let n=2;n<=32;n++){let V=n*(n+1)/2,E=n*(n-1);grids.push({n,V,E,completeEdges:n%2===0?n**3/4:null});}
let seeds=[];for(let d=1;d<=30;d++){let B=d*(d-1)/2,C=d*(d+1)/2;seeds.push({d,B,C,base:1+d*d,valid:B>0&&C<1+d*d});}
const out={missing,outside,orbits:outside.map(orbit),grids:grids.filter(x=>x.n===16),seeds:seeds.slice(0,7),checks:{allTriangular:seeds.every(x=>(x.C-x.B)**2===x.B+x.C),d4Edges:grids.every(x=>x.E===2*(x.V-x.n)),closure22:missing.length===0}};
console.log(JSON.stringify(out,null,2));
```

Actual output:
```json
{
  "missing": [
    "נ",
    "ס",
    "ע",
    "פ",
    "צ"
  ],
  "outside": [
    "ע",
    "ו"
  ],
  "orbits": [
    [
      "ע",
      "ן",
      "ז"
    ],
    [
      "ו",
      "ס",
      "ם"
    ]
  ],
  "grids": [
    {
      "n": 16,
      "V": 136,
      "E": 240,
      "completeEdges": 1024
    }
  ],
  "seeds": [
    {
      "d": 1,
      "B": 0,
      "C": 1,
      "base": 2,
      "valid": false
    },
    {
      "d": 2,
      "B": 1,
      "C": 3,
      "base": 5,
      "valid": true
    },
    {
      "d": 3,
      "B": 3,
      "C": 6,
      "base": 10,
      "valid": true
    },
    {
      "d": 4,
      "B": 6,
      "C": 10,
      "base": 17,
      "valid": true
    },
    {
      "d": 5,
      "B": 10,
      "C": 15,
      "base": 26,
      "valid": true
    },
    {
      "d": 6,
      "B": 15,
      "C": 21,
      "base": 37,
      "valid": true
    },
    {
      "d": 7,
      "B": 21,
      "C": 28,
      "base": 50,
      "valid": true
    }
  ],
  "checks": {
    "allTriangular": true,
    "d4Edges": true,
    "closure22": false
  }
}
```
