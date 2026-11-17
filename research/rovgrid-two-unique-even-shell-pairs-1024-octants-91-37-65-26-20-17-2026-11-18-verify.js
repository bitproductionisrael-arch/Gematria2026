#!/usr/bin/env node
"use strict";
// Exhaustively verifies the two unique unordered pairs of one-unit even cube
// shells that sum to 1024; realizes both as distinct colored nested subsets
// of a 3D lattice, with full 8-octant partition and no overlapping cells.
const assert=require("node:assert/strict");
const shell=n=>n**3-(n-2)**3;
const centeredHex=m=>3*m*(m-1)+1;
for(let m=1;m<=30;m++)assert.equal(shell(2*m),8*centeredHex(m));
const solutions=[];
for(let a=1;a<=7;a++)for(let b=a;b<=7;b++){
 if(shell(2*a)+shell(2*b)===1024)solutions.push([2*a,2*b]);
}
assert.deepEqual(solutions,[[2,14],[8,12]]);
assert.deepEqual(solutions.map(pair=>pair.map(shell)),[[8,1016],[296,728]]);
assert.deepEqual([[1,7],[4,6]].map(pair=>pair.map(centeredHex)),[[1,127],[37,91]]);
for(const [a,b] of [[1,7],[4,6]])assert.equal(a*(a-1)+b*(b-1),42);
for(let a=1;a<8;a++)for(let b=a;b<8;b++){
 const test=3*(a*(a-1)+b*(b-1))+2;
 assert.equal(test===128,([a,b].join(",")==="1,7"||[a,b].join(",")==="4,6"));
}
const grid=n=>{const result=[];for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++)result.push([x,y,z]);return result};
const octant=(p,n)=>p.map(v=>v>=n/2?1:0).join("");
const boundaryDistance=(p,n)=>Math.min(...p.map(v=>Math.min(v,n-1-v)));
function realize(n,positions,distribution){
 const buckets={};const layerCounts={};const selected=new Map();
 for(const p of grid(n)){
  const d=boundaryDistance(p,n);
  const kind=positions[d]||"unused";
  layerCounts[kind]=(layerCounts[kind]||0)+1;
  if(kind==="unused")continue;
  const o=octant(p,n),key=kind+":"+o;
  buckets[key]??=[];buckets[key].push(p.join(","));
 }
 for(const [key,coords] of Object.entries(buckets)){
  const [kind]=key.split(":");const assignments=distribution[kind];
  assert.equal(assignments.reduce((s,x)=>s+x[1],0),coords.length,key);
  let idx=0;
  for(const [color,num] of assignments)for(let j=0;j<num;j++){
   const id=coords[idx++];
   assert.equal(selected.has(id),false,"voxel overlap");
   selected.set(id,color);
  }
 }
 const colors={};for(const color of selected.values())colors[color]=(colors[color]||0)+1;
 assert.deepEqual(colors,{AMIT:520,ROV:208,MIKE:160,GRAY:136});
 assert.equal(selected.size,1024);
 assert.equal(Object.values(layerCounts).reduce((a,b)=>a+b,0),n**3);
 return {n,selected:selected.size,layerCounts,colors,bucketSizes:Object.fromEntries(Object.entries(buckets).map(([k,v])=>[k,v.length]))};
}
const optionB=realize(12,{0:"outer12",1:"middle10",2:"inner8"},{
 outer12:[["AMIT",65],["ROV",26]],
 inner8:[["MIKE",20],["GRAY",17]],
});
assert.deepEqual(optionB.layerCounts,{outer12:728,middle10:488,inner8:296,unused:216});
for(const bit of ["000","001","010","011","100","101","110","111"]){
 assert.equal(optionB.bucketSizes["outer12:"+bit],91);
 assert.equal(optionB.bucketSizes["inner8:"+bit],37);
}
assert.equal(728+296,1024);
assert.equal(488+216,704);
assert.equal(1024+704,12**3);
assert.equal(91+37,128);
assert.equal(91,65+26);
assert.equal(37,20+17);
assert.equal(8*(91+37),1024);
const optionA=realize(14,{0:"outer14",6:"core2"},{
 outer14:[["AMIT",65],["ROV",26],["MIKE",20],["GRAY",16]],
 core2:[["GRAY",1]],
});
assert.equal(optionA.layerCounts.outer14,1016);
assert.equal(optionA.layerCounts.core2,8);
assert.equal(optionA.selected,1024);
for(const bit of ["000","001","010","011","100","101","110","111"]){
 assert.equal(optionA.bucketSizes["outer14:"+bit],127);
 assert.equal(optionA.bucketSizes["core2:"+bit],1);
}
assert.equal(14**3,1024+(12**3-8));
assert.equal(2**3+shell(14),1024);
assert.equal(8**3-6**3,296);
assert.equal(12**3-10**3,728);
assert.equal(14**3-12**3,1016);
console.log("PASS | exactly two pairs of even shell sizes sum to 1024: (2,14),(8,12); two coordinate-level nested colored realizations, 8 octants, exact 520/208/160/136, no overlaps, with unused volumes explicitly counted.");
