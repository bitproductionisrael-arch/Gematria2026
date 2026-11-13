// RovGrid independent reconstruction — 14 Nov 2026
// Run: node research/rovgrid-q10-two-cubes-gray-xor-136-888-jewish-theology-2026-11-14-verify.js
"use strict";
const assert = require("node:assert/strict");
const gray = n => n ^ (n >>> 1);
const popcount = n => { let c=0; while(n) { n &= n-1; c++; } return c; };
const check = (name, actual, expected) => { assert.equal(actual, expected, name); console.log("PASS",name,actual); };
const bitEdges = (selected, d=10) => {
  let inside=0, boundary=0;
  for (const v of selected) for (let k=0; k<d; k++) {
    const w=v ^ (1<<k);
    if (selected.has(w)) inside++; else boundary++;
  }
  return { inside: inside/2, boundary };
};
// Shell and seam (physical voxels)
check("single cube shell",8**3-6**3,296);
check("two separated shells",2*(8**3-6**3),592);
check("seam center",2*6*6,72);
check("rim per face",8**2-6**2,28);
check("joined core",6*6*14,504);
check("joined shell",8*8*16-6*6*14,520);
check("seam subtraction",592-72,520);
check("mod 24 unchanged",592%24,520%24);
check("mod 37 before",592%37,0);
check("mod 37 after",520%37,2);
// Counts of contiguous intervals
const intervals=[];
for(let i=0;i<16;i++) for(let j=i;j<16;j++) intervals.push([i,j]);
check("contiguous intervals",intervals.length,136);
check("within first cube",intervals.filter(([i,j])=>j<8).length,36);
check("within second cube",intervals.filter(([i,j])=>i>=8).length,36);
check("cross seam",intervals.filter(([i,j])=>i<8&&j>=8).length,64);
// Encode intervals as vertices of Q10 by 4+4+2 bits
const addr=(i,j)=>(gray(i)<<6)|(gray(j)<<2);
const selected=new Set(intervals.map(([i,j])=>addr(i,j)));
check("unique Q10 addresses",selected.size,136);
check("remaining Q10 vertices",1024-selected.size,888);
const seqEdge=bitEdges(selected);
check("internal Q10 edges of interval selection",seqEdge.inside,424);
check("Q10 boundary edges of interval selection",seqEdge.boundary,512);
check("Q10 edge count",10*2**9,5120);
check("Q11 vertex count",2**11,2048);
check("Q11 edge count",11*2**10,11264);
const cross=new Set(intervals.filter(([i,j])=>i<8&&j>=8).map(([i,j])=>addr(i,j)));
check("cross seam induced Q6 has 192 edges",bitEdges(cross).inside,6*2**5);
let bankCounts=Array(4).fill(0),bankTotals=Array(4).fill(0);
for(let i=0;i<16;i++) {
  const b=gray(i)&3;
  for(let j=i;j<16;j++) bankCounts[b]++;
  bankTotals[b]+=16*4; // 16 possible ends x 4 possible trailing bits for each starting index
}
check("each bank 256 raw vertices",bankTotals.every(x=>x===256),true);
check("each bank 34 selected",bankCounts.every(x=>x===34),true);
check("four banks total complement",bankTotals.reduce((a,b)=>a+b,0)-bankCounts.reduce((a,b)=>a+b,0),888);
// Three different 136-vertex selections in Gray-labeled physical box.
const phys=(x,y,z)=>(gray(x)<<7)|(gray(y)<<4)|gray(z);
const face=new Set(), cornerLines=new Set(), boxAll = new Set();
for(let x=0;x<8;x++)for(let y=0;y<8;y++)for(let z=0;z<16;z++) {
  const v=phys(x,y,z); boxAll.add(v);
  const seam = (z===7||z===8) && x>0 && x<7 && y>0 && y<7;
  if (seam || z===0) face.add(v);
  if (seam || ((x===0||x===7)&&(y===0||y===7))) cornerLines.add(v);
}
check("box is Q10 vertex bijection",boxAll.size,1024);
check("physical seam+end face vertices",face.size,136);
check("physical seam+corner lines vertices",cornerLines.size,136);
const f=bitEdges(face), c=bitEdges(cornerLines);
check("seam+face internal edges",f.inside,432);
check("seam+face boundary edges",f.boundary,496);
check("seam+corner internal edges",c.inside,396);
check("seam+corner boundary edges",c.boundary,568);
check("physical 3D face-adjacencies",2*(7*8*16)+15*8*8,2752);
// Other algebraic and binary discoveries
check("3 shells",3*296,888);
check("difference",1024-888,136);
check("8-cube 88 version",2*8**3-88,936);
check("24 subtracted",1024-8-8-8,1000);
check("34*120/5",34*120/5,816);
check("34*120/6",34*120/6,680);
check("680+208",680+208,888);
check("816+208",816+208,1024);
check("136 AND 888",136&888,8);
check("136 XOR 888",136^888,1008);
check("680 AND 816",680&816,544);
check("680 XOR 816",680^816,408);
check("680 OR 816",680|816,952);
check("Gray 0/15 low-bit symmetry", (gray(0)&3), (gray(15)&3));
console.log("ALL CHECKS PASSED — mathematical model only; no theological hypothesis is tested.");
