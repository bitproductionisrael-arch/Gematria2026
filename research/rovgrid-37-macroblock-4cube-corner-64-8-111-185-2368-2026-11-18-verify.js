#!/usr/bin/env node
"use strict";
/* Coordinate-level geometric proof of user's uploaded picture:
 * 37 trihedral-corner macroblocks in a 4x4x4 scaffold; each macroblock
 * expands to 4x4x4=64 unit voxels. The result is 16^3 - 12^3 = 2368.
 * Each macroblock comprises 8 original 2^3 subblocks. Assign 3 of 8
 * to IESOUS(888) and 5 of 8 to CHRISTOS(1480), 37 times.
 * Refinement into 65/20/26 subblocks yields 520/160/208.
 * Direct 3 wing sum = 9+12+16 at the original 3^3 to 4^3 growth.
 */
const assert=require("node:assert/strict");
const key=(x,y,z)=>[x,y,z].join(",");
const red=new Set(),wings={9:[],12:[],16:[]},micro=new Set(),subBlocks=new Map();
for(let x=0;x<4;x++)for(let y=0;y<4;y++)for(let z=0;z<4;z++){
 if(!(x===3||y===3||z===3))continue;
 const k=key(x,y,z);
 red.add(k);
 if(z===3)wings[16].push(k);
 else if(y===3)wings[12].push(k);
 else wings[9].push(k);
 const group=[];
 for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c=0;c<2;c++){
  const u=key(2*x+a,2*y+b,2*z+c);
  group.push(u);
  for(let dx=0;dx<2;dx++)for(let dy=0;dy<2;dy++)for(let dz=0;dz<2;dz++){
   const q=key(4*x+2*a+dx,4*y+2*b+dy,4*z+2*c+dz);
   assert.equal(micro.has(q),false);
   micro.add(q);
  }
 }
 subBlocks.set(k,group);
}
assert.equal(red.size,37);
assert.deepEqual(Object.fromEntries(Object.entries(wings).map(([v,ls])=>[v,ls.length])),{9:9,12:12,16:16});
assert.equal(9+12+16,37);
assert.equal(4**3-3**3,37);
assert.equal(micro.size,37*4**3);
assert.equal(micro.size,2368);
assert.equal(16**3-12**3,2368);
for(let x=0;x<16;x++)for(let y=0;y<16;y++)for(let z=0;z<16;z++){
 assert.equal(micro.has(key(x,y,z)),x>=12||y>=12||z>=12);
}
assert.equal((9+12+16)*64,2368);
assert.deepEqual([9*64,12*64,16*64],[576,768,1024]);
assert.equal(576+768+1024,2368);
assert.equal(1024,16*64);
assert.equal(16,4**2);
assert.equal(64,4**3);
assert.equal(8,2**3);
assert.equal(37*8,296);
assert.equal(296*8,2368);
assert.equal(8**3-6**3,296);
assert.equal(12*26-16,296);
assert.equal(111,3*37);
assert.equal(185,5*37);
assert.equal(296,111+185);
assert.equal(888,111*8);
assert.equal(1480,185*8);
assert.equal(2368,888+1480);
assert.equal(111,65+20+26);
assert.equal(888,520+160+208);
const selected=[],other=[];
for(const group of subBlocks.values()){
 assert.equal(group.length,8);
 selected.push(...group.slice(0,3));
 other.push(...group.slice(3));
}
assert.equal(selected.length,111);
assert.equal(other.length,185);
assert.equal(new Set([...selected,...other]).size,296);
const colors=new Map();
selected.forEach((k,i)=>{
 const color=i<65?"AMIT":i<85?"MIKE":"ROV";
 colors.set(k,color);
});
other.forEach(k=>colors.set(k,"CHRISTOS"));
const counts=Object.fromEntries(["AMIT","MIKE","ROV","CHRISTOS"].map(c=>[c,[...colors.values()].filter(x=>x===c).length]));
assert.deepEqual(counts,{AMIT:65,MIKE:20,ROV:26,CHRISTOS:185});
assert.equal(counts.AMIT*8,520);
assert.equal(counts.MIKE*8,160);
assert.equal(counts.ROV*8,208);
assert.equal(counts.CHRISTOS*8,1480);
assert.equal([...colors.values()].length*8,2368);
// Cubic scale identity generalization, for macro-grid side m and cell side r.
for(let m=2;m<=15;m++)for(let r=1;r<=8;r++){
 const cornerCount=m**3-(m-1)**3;
 assert.equal(cornerCount*r**3,(m*r)**3-((m-1)*r)**3);
 assert.equal(cornerCount,3*m*m-3*m+1);
}
console.log("PASS: 37 disjoint macrovoxels (9+12+16 wings), scaled to 2368 distinct voxels (16^3−12^3), partitioned into 296 subcubes 2^3 with exact 111/185 and 65/20/26 signatures.");
