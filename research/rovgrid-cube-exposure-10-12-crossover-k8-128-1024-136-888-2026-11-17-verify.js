#!/usr/bin/env node
"use strict";
// Derivations for the 12^3 exposure bridge and the 10^3 core/shell crossover.
// Original two 8^3 block-cube partition is verified in its own dated annex.
const assert=require("node:assert/strict");
function profile(n){
 const hist=[0,0,0,0];
 for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++){
  const d=[x,y,z].filter(v=>v===0||v===n-1).length;
  hist[d]++;
 }
 const [core,face,edge,corner]=hist;
 const A=corner,B=corner+edge,C=corner+edge+face;
 const product=A*B,addition=A+B,subtraction=product-addition;
 const pairProducts=A*B+A*C+B*C;
 const Q=pairProducts/24;
 assert.equal(A,8);
 assert.equal(B,12*n-16);
 assert.equal(C,n**3-(n-2)**3);
 assert.equal(C,6*n*n-12*n+8);
 assert.equal(A+B+C,6*n*n);
 assert.equal(core,(n-2)**3);
 assert.equal(n**3,core+C);
 return {n,A,B,C,core,face,edge,product,addition,subtraction,pairProducts,Q};
}
const ar=Array.from({length:199},(_,i)=>profile(i+2));
const at=n=>ar.find(x=>x.n===n);
assert.equal(at(3).pairProducts,888); // uses 3 pair products, not n=12 operator
assert.deepEqual([at(9).core,at(9).C,at(10).core,at(10).C,at(11).core,at(11).C],[343,386,512,488,729,602]);
assert.equal(ar.filter(x=>x.core>x.C)[0].n,10);
for(const t of ar)if(t.n>=10)assert.ok(t.core>t.C);
assert.equal(at(10).B,104);
assert.equal(at(11).B,116);
const t=at(12);
assert.equal(t.n**3,1728);
assert.deepEqual([t.core,t.face,t.edge,t.A,t.B,t.C],[1000,600,120,8,128,728]);
assert.deepEqual([t.addition,t.product,t.subtraction],[136,1024,888]);
assert.equal(t.A+t.B+t.C,864);
assert.equal(t.A*t.B+t.A*t.C+t.B*t.C,100032);
assert.equal(t.Q,4168);assert.equal(t.Q,8*20*26+8);
assert.equal(t.B,2**7);
assert.equal(t.A,2**3);
assert.equal(t.product,2**10);
assert.equal(t.addition,8*17);
assert.equal(t.subtraction,8*111);
assert.equal(t.B,8*16);
assert.equal(t.C,520+208);
assert.equal(t.C,7*104);
assert.equal(t.C+160,888);
assert.equal(128,65+20+26+17);
assert.equal(888,8*(65+20+26));
assert.equal(136,8*17);
assert.equal(1024,8*(65+20+26+17));
// Bipartite graph with two disjoint *typed copies* of the overlapping threshold sets.
// Its edge set is all cross-layer pairs. This is not the cube's physical adjacency graph.
const nodes=t.A+t.B,edges=t.A*t.B,euler=nodes-edges,betti1=edges-nodes+1;
assert.deepEqual([nodes,edges,euler,betti1],[136,1024,-888,889]);
for(const name of ["addition","product","subtraction"]){
 assert.deepEqual(ar.filter(p=>p[name]==={addition:136,product:1024,subtraction:888}[name]).map(p=>p.n),[12]);
}
assert.deepEqual(ar.filter(p=>p.C===728).map(p=>p.n),[12]);
for(let k=0;k<7;k++){
 const n=10+26*k;
 assert.equal(at(n).B,104*(1+3*k));
}
assert.equal(at(36).B,416);
assert.equal(at(62).B,728);
assert.equal(at(88).B,1040);
assert.equal(at(114).B,1352);
console.log("PASS: 10^3 first core>shell, 12^3 8+128=136 / 8*128=1024 / difference 888, shell728, colored111/gray17, typed bipartite graph Euler=-888, and B(n) 104 recurrence.");
