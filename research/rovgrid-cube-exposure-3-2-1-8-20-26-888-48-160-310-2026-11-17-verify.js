#!/usr/bin/env node
"use strict";
/* Exact reproducible geometry from 17.11.2026 discussion. No probability or physics claim. */
const assert=require("node:assert/strict");
const range=n=>Array.from({length:n},(_,i)=>i);
const coords=n=>range(n).flatMap(x=>range(n).flatMap(y=>range(n).map(z=>[x,y,z])));
const exposure=(xyz,n)=>xyz.filter(v=>v===0||v===n-1).length;
const histogram=n=>{
  const counts=[0,0,0,0];
  for(const p of coords(n))counts[exposure(p,n)]++;
  return counts;
};
assert.deepEqual(histogram(3),[1,6,12,8]);
assert.deepEqual(histogram(4),[8,24,24,8]);
const [core3,face3,edge3,corner3]=histogram(3);
const A=corner3, B=corner3+edge3, C=corner3+edge3+face3;
assert.deepEqual([A,B,C],[8,20,26]);
assert.equal(3*corner3+2*edge3+face3,54);
assert.equal(A+B+C,54);
assert.equal(A*B+A*C+B*C,888);
assert.equal(A*B,160);assert.equal(A*C,208);assert.equal(B*C,520);
// Distinct unordered pairs of boundary cells, with at least one exposing >=2 faces.
const shell3=coords(3).filter(p=>exposure(p,3)>0);
let pairCount=0;
for(let i=0;i<shell3.length;i++)for(let j=i+1;j<shell3.length;j++)
  if(exposure(shell3[i],3)>=2||exposure(shell3[j],3)>=2)pairCount++;
assert.equal(pairCount,310);
assert.equal(pairCount,26*25/2-6*5/2);
// Face-incidences contributed by edge-interior cubelets in a 4x4x4 cube.
const edgeMiddle4=coords(4).filter(p=>exposure(p,4)===2);
assert.equal(edgeMiddle4.length,24);
assert.equal(edgeMiddle4.length*2,48);
const edgeFaceByParallelAxis=[0,0,0];
for(const xyz of edgeMiddle4) {
  const axis=xyz.findIndex(v=>v!==0&&v!==3);
  edgeFaceByParallelAxis[axis]+=2;
}
assert.deepEqual(edgeFaceByParallelAxis,[16,16,16]);
assert.equal(edgeFaceByParallelAxis[0]+edgeFaceByParallelAxis[1]+edgeFaceByParallelAxis[2],48);
assert.equal([3,5,7,9].reduce((a,b)=>a+b,0),24);
assert.equal([1,3,5,7].reduce((a,b)=>a+b,0),16);
// Exactly reproduce the high-anchor verifier's fixed 4x4x4 surface coloring.
function shellColor([x,y,z]){
 if([x,y,z].every(v=>v===0||v===3)) return "M"; // green: corners
 if([1,2].includes(x)&&[0,3].includes(y)&&[0,3].includes(z))return "G"; // gray
 if([1,2].includes(y)&&[0,3].includes(x)&&[0,3].includes(z))return "R"; // gold
 if([x,y,z].some(v=>v===0||v===3))return "B"; // blue
 return null;
}
const colors=["B","M","R","G"];
const shell4=coords(4).filter(p=>exposure(p,4)>0);
const countBy=(items,fn)=>{
 const out=Object.fromEntries(colors.map(c=>[c,0]));
 for(const item of items)out[fn(item)]++;
 return out;
};
assert.equal(shell4.length,56);
assert.deepEqual(countBy(shell4,shellColor),{B:32,M:8,R:8,G:8});
const cores=coords(4).filter(p=>exposure(p,4)===0);
assert.equal(cores.length,8);
const coreUpper=[..."BMMRRRRG"],coreLower=[..."MMRRRRRR"];
const cubeCounts=letters=>{
 const counts=countBy(shell4,shellColor);
 for(const c of letters)counts[c]++;
 return counts;
};
assert.deepEqual(cubeCounts(coreUpper),{B:33,M:10,R:12,G:9});
assert.deepEqual(cubeCounts(coreLower),{B:32,M:10,R:14,G:8});
const sum=(a,b)=>Object.fromEntries(colors.map(k=>[k,a[k]+b[k]]));
assert.deepEqual(sum(cubeCounts(coreUpper),cubeCounts(coreLower)),{B:65,M:20,R:26,G:17});
const exposedByColor=countBy(shell4.flatMap(p=>range(exposure(p,4)).map(()=>p)),shellColor);
assert.deepEqual(exposedByColor,{B:40,M:24,R:16,G:16});
assert.equal(colors.reduce((n,k)=>n+exposedByColor[k],0),96);
const seamDist=axis=>countBy(shell4.filter(p=>p[axis]===0),shellColor);
assert.deepEqual(seamDist(0),{B:8,M:4,R:4,G:0});
assert.deepEqual(seamDist(1),{B:8,M:4,R:0,G:4});
assert.deepEqual(seamDist(2),{B:4,M:4,R:4,G:4});
const joinedSurface=Object.fromEntries(colors.map(k=>[k,2*exposedByColor[k]-2*seamDist(2)[k]]));
assert.deepEqual(joinedSurface,{B:72,M:40,R:24,G:24});
assert.equal(colors.reduce((n,k)=>n+joinedSurface[k],0),160);
assert.equal(2*96-2*16,160);
assert.equal(2*(4*4+4*8+4*8),160);
console.log("PASS: exposure 3/2/1 -> 8/20/26 -> 888; selected boundary pairs 310; 48=16+32; joined surface 160; balanced z-seam.");
