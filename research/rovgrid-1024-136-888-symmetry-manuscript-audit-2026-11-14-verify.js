// RovGrid 2026-11-14 — mathematical manuscript audit, pure JavaScript
'use strict';
const assert = (ok,msg)=>{if(!ok)throw Error(msg)};
const N=32, visited=new Set(), orbitCounts={};
const key=(x,y)=>x+','+y;
for(let y=0;y<N;y++) for(let x=0;x<N;x++){
 if(visited.has(key(x,y)))continue;
 const o=new Set([[x,y],[N-1-x,y],[x,N-1-y],[N-1-x,N-1-y],[y,x],[N-1-y,x],[y,N-1-x],[N-1-y,N-1-x]].map(p=>key(...p)));
 for(const q of o)visited.add(q);
 orbitCounts[o.size]=(orbitCounts[o.size]||0)+1;
}
const orbits=Object.entries(orbitCounts).reduce((s,[n,m])=>s+m,0);
const redundant=Object.entries(orbitCounts).reduce((s,[n,m])=>s+(Number(n)-1)*m,0);
assert(orbitCounts[8]===120&&orbitCounts[4]===16,'D4 orbit sizes');
assert(orbits===136&&redundant===888,'quotient and redundancy');
assert((N*N+2*N)/8===136,'Burnside');
assert(8**3-(8-2)**3===296,'cube shell');
assert(2*296-2*6**2===520,'joined shell');
assert(8*8*16-6*6*14===520,'joined core');
assert((32**2-30**2)===124,'flat frame');
assert(10*2**9===5120,'Q10 edges');
const gcd=(a,b)=>b?gcd(b,a%b):a;
const phi=n=>{let s=0;for(let i=1;i<=n;i++)if(gcd(i,n)===1)s++;return s};
assert(phi(136)===64&&phi(160)===64&&phi(208)===96&&phi(520)===192&&phi(728)===288&&phi(888)===288,'totients');
assert(8+128===136&&8*128===1024,'bipartite graph');
assert((8-2)*(128-2)/4===189,'genus');
assert(1024-136+2-2*189===512,'faces');
assert(8**127*128**7===2**430,'spanning tree count');
assert(160*208===520*64,'number identity');
let rs=0;for(let i=0;i<16;i++)for(let j=i;j<16;j++)rs++;
assert(rs===136,'ordered nonempty intervals');
console.log(JSON.stringify({orbitCounts,orbits,redundant,Q10_edges:5120,shellCube:296,shellCuboid:520,graph:{V:136,E:1024,F:512,genus:189},status:'PASS'},null,2));
