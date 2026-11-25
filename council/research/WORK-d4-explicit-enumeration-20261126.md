# WORK D4 independent enumeration — 2026-11-26
Claim WORK-D4-ADJ-v1, continuation of WORK-abc-d4-ayak-20261125.md. Explicit enumeration of original grid, not formula-only test. Canonical orbit key sorts absolute centered coordinates; edges deduplicated, loops excluded. Proof: orbit representatives 0<=i<=j<n; each of the two coordinate increment directions has n(n-1)/2 edges. Grade 4; no lock. K(8,128) is not this quotient. New evidence: independent exhaustive enumeration for n=1..32. No gematria mapping required for this graph claim. Ten source paths fetched including RESET, previous report, calculator and ABC anchor; large indexes inspected partially; personal state and corpus-wide duplicate check not completed. Coverage: one claim independently tested, no new full-file coverage asserted. Expertise graph combinatorics; high prospects for exact graph invariants, low for inferring physical ontology. Next: compare weighted quotient retaining multiplicities; verify peer RESET outputs. 80/20 timing not measured. ABC cycle 2 partial, no claim of completion.
```js
const run=()=>{let out=[];for(let n=1;n<=32;n++){let V=new Set(),E=new Set(),loops=0;const f=(x,y)=>[Math.abs(2*x-2*n+1),Math.abs(2*y-2*n+1)].sort((a,b)=>a-b).join(",");for(let x=0;x<2*n;x++)for(let y=0;y<2*n;y++){let a=f(x,y);V.add(a);for(const [u,v] of [[x+1,y],[x,y+1]])if(u<2*n&&v<2*n){let b=f(u,v);if(a===b)loops++;else E.add([a,b].sort().join("|"));}}out.push({n,V:V.size,E:E.size,loops,ok:V.size===n*(n+1)/2&&E.size===n*(n-1)});}return {tested:out.length,all:out.every(x=>x.ok),sample:out.filter(x=>[1,2,16,32].includes(x.n))}};
console.log(JSON.stringify(run()));
```
Actual output:
```json
{
  "tested": 32,
  "all": true,
  "sample": [
    {
      "n": 1,
      "V": 1,
      "E": 0,
      "loops": 4,
      "ok": true
    },
    {
      "n": 2,
      "V": 3,
      "E": 2,
      "loops": 8,
      "ok": true
    },
    {
      "n": 16,
      "V": 136,
      "E": 240,
      "loops": 64,
      "ok": true
    },
    {
      "n": 32,
      "V": 528,
      "E": 992,
      "loops": 128,
      "ok": true
    }
  ]
}
```
