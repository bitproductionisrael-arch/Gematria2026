#!/usr/bin/env node
"use strict";
// Cuboid frame: voxel cells incident to at least TWO boundary-coordinate planes.
// All counts reproduced from coordinates; never confuse a 26-side cuboid
// with the independent 26th equal-sided Cube Frame (=296).
const assert=require("node:assert/strict");
function profile(a,b,c){
 const h=[0,0,0,0];
 for(let x=0;x<a;x++)for(let y=0;y<b;y++)for(let z=0;z<c;z++){
  const exposed=[x===0||x===a-1,y===0||y===b-1,z===0||z===c-1].filter(Boolean).length;
  h[exposed]++;
 }
 const [core,faceOnly,edgeOnly,corner]=h;
 const frame=edgeOnly+corner;
 const shell=faceOnly+frame;
 const surface=faceOnly+2*edgeOnly+3*corner;
 const halfSurface=a*b+a*c+b*c;
 const frameFormula=4*(a+b+c)-16;
 assert.equal(frame,frameFormula);
 assert.equal(shell,a*b*c-(a-2)*(b-2)*(c-2));
 assert.equal(surface,2*halfSurface);
 assert.equal(h.reduce((s,v)=>s+v,0),a*b*c);
 return {dims:[a,b,c],core,faceOnly,edgeOnly,corner,frame,shell,surface,halfSurface};
}
const o=profile(8,20,26),t=profile(10,16,28);
assert.deepEqual(o,{dims:[8,20,26],core:2592,faceOnly:1368,edgeOnly:192,corner:8,frame:200,shell:1568,surface:1776,halfSurface:888});
assert.deepEqual(t,{dims:[10,16,28],core:2912,faceOnly:1368,edgeOnly:192,corner:8,frame:200,shell:1568,surface:1776,halfSurface:888});
assert.equal(t.core-o.core,320);
assert.equal(o.frame+o.corner,208); // nested sum, NOT distinct physical voxels
assert.equal(profile(18,18,18).frame,200);
assert.equal(profile(26,26,26).frame,296);
assert.notEqual(o.frame,profile(26,26,26).frame);
const primitive=profile(4,10,13),primitiveTwin=profile(5,8,14);
assert.deepEqual([primitive.frame,primitiveTwin.frame],[92,92]);
assert.deepEqual([primitive.shell,primitiveTwin.shell],[344,344]);
assert.deepEqual([primitive.core,primitiveTwin.core],[176,216]);
assert.deepEqual([primitive.faceOnly,primitive.edgeOnly,primitive.corner],[252,84,8]);
assert.equal(primitive.frame+primitiveTwin.frame,184);
const each8=profile(8,8,8);
assert.equal(each8.frame,80);
assert.equal(2*each8.frame,160); // count cubes separately, not as shared-face external frame
assert.equal(2*each8.shell,592);
assert.equal(2*each8.core,432);
assert.equal(2*8**3,1024);
assert.equal(2*each8.frame+2*each8.faceOnly+2*each8.core,1024);
const each4=profile(4,4,4);
assert.equal(each4.frame,32);
assert.equal(2*each4.frame,64);
assert.equal(2*each4.frame*8,512); // microvoxels in the selected fundamental blocks
assert.equal(profile(2,2,2).frame,8);
assert.equal(2*each4.frame*8,512);
// Same frame given equal edge sum, but not identical shape.
assert.equal(o.dims.reduce((a,b)=>a+b),54);
assert.equal(t.dims.reduce((a,b)=>a+b),54);
assert.equal(54,3*(3+6+9));
assert.equal(o.frame,4*54-16);
console.log("PASS: cuboid 8×20×26 and twin 10×16×28 both frame200/shell1568/surface1776, core difference320; cube18 frame200, cube26 frame296, each cube8 frame80 and double160, primitive frames92.");
