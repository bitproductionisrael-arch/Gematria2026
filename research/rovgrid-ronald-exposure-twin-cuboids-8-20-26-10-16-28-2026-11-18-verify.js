#!/usr/bin/env node
"use strict";
// Original research 18 Nov 2026: exhaustive cuboid exposure and uniqueness tests.
const assert=require("node:assert/strict");
const families=[[8,20,26],[10,16,28]];
function analyze(dims){
 const [a,b,c]=dims;
 assert.ok(dims.every(x=>x>=2));
 const hist=[0,0,0,0];
 for(let x=0;x<a;x++)for(let y=0;y<b;y++)for(let z=0;z<c;z++){
  const exp=Number(x===0||x===a-1)+Number(y===0||y===b-1)+Number(z===0||z===c-1);
  hist[exp]++;
 }
 const [core,faces,edges,corners]=hist;
 const V=a*b*c,S=a+b+c,Q=a*b+a*c+b*c;
 const th=[corners,corners+edges,corners+edges+faces];
 assert.deepEqual(hist,[(a-2)*(b-2)*(c-2),2*((a-2)*(b-2)+(a-2)*(c-2)+(b-2)*(c-2)),4*((a-2)+(b-2)+(c-2)),8]);
 assert.equal(hist.reduce((s,v)=>s+v,0),V);
 assert.equal(corners*3+edges*2+faces,2*Q);
 assert.equal(th.reduce((s,v)=>s+v,0),2*Q);
 return {dims,V,S,Q,hist,th,facesAreas:[a*b,a*c,b*c],surface:2*Q};
}
const [o,t]=families.map(analyze);
assert.deepEqual(o,{dims:[8,20,26],V:4160,S:54,Q:888,hist:[2592,1368,192,8],th:[8,200,1568],facesAreas:[160,208,520],surface:1776});
assert.deepEqual(t,{dims:[10,16,28],V:4480,S:54,Q:888,hist:[2912,1368,192,8],th:[8,200,1568],facesAreas:[160,280,448],surface:1776});
assert.equal(t.V-o.V,320);
assert.equal(t.hist[0]-o.hist[0],320);
for(let e=1;e<=3;e++)assert.equal(o.hist[e],t.hist[e]);
assert.equal(t.facesAreas[0],o.facesAreas[0]);
assert.deepEqual([t.facesAreas[1]-o.facesAreas[1],t.facesAreas[2]-o.facesAreas[2]],[72,-72]);
// All positive integer side lengths, sorted nondecreasing, and fixed S/Q:
const solutions=[];
for(let a=1;a<=54;a++)for(let b=a;b<=54;b++){
 const c=54-a-b;if(c<b||c<1)continue;
 if(a*b+a*c+b*c===888)solutions.push([a,b,c]);
}
assert.deepEqual(solutions,families);
// Original 2x2x2 elementary blocks: halve all dimensions exactly.
const [smallO,smallT]=families.map(a=>analyze(a.map(n=>n/2)));
assert.deepEqual(smallO,{dims:[4,10,13],V:520,S:27,Q:222,hist:[176,252,84,8],th:[8,92,344],facesAreas:[40,52,130],surface:444});
assert.deepEqual(smallT,{dims:[5,8,14],V:560,S:27,Q:222,hist:[216,252,84,8],th:[8,92,344],facesAreas:[40,70,112],surface:444});
assert.equal(smallT.V-smallO.V,40);
assert.equal(smallO.th[2],8*43); // AMIT English Simple=43
assert.equal(smallO.th.reduce((a,b)=>a+b),4*111);
assert.equal(smallO.V,8*10*13/2); // 520
for(const [a,b,c] of families){
 const points=[a,b,c].map(n=>[n-2,n-1,n]);
 assert.deepEqual(points.map(x=>x.length),[3,3,3]);
}
// Cube-to-cuboid intermediate path and Ronald 48=16+32:
assert.equal(3**3+3**2,4*3*3);
assert.equal(4*3*3+4*3,4*4*3);
assert.equal(4*4*3+4**2,4**3);
assert.equal(4*4*3,16+32);
assert.equal(4**3,16+32+16);
// Two parity-lineage shell decompositions:
const shell=(n)=>n**3-Math.max(n-2,0)**3;
assert.deepEqual([3,5,7,9,11].map(shell),[26,98,218,386,602]);
assert.deepEqual([2,4,6,8,10,12].map(shell),[8,56,152,296,488,728]);
assert.equal(1+[3,5,7,9,11].map(shell).reduce((s,v)=>s+v,0),11**3);
assert.equal([2,4,6,8,10,12].map(shell).reduce((s,v)=>s+v,0),12**3);
assert.deepEqual([1,7,19,37,61,91].map(v=>8*v),[8,56,152,296,488,728]);
assert.equal(1+7+19+37+61+91,216);
assert.equal(8*216,12**3);
console.log("PASS: exactly two integer cuboids 8x20x26 and 10x16x28 share S54/Q888 and all exposed-face counts; only cores differ by 320; 2x2x2-scale 344-shell twins; 48=16+32 physical box; odd/even concentric shell genealogies.");
