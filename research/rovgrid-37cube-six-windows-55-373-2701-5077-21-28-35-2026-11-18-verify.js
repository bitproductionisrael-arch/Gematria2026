#!/usr/bin/env node
"use strict";
// Coordinate-level reconstruction of the externally documented 37^3 six-window cube.
// New RovGrid crosschecks: 55±18=37/73, 21-28-35 Pythagorean triple,
// 6*21^2+55=2701, 6*28^2+373=5077, and two adjacent faces =2701.
// Original source: https://sites.google.com/site/3d37x73/alpha-omega
const assert=require("node:assert/strict");
const n=37,L=n-1;
const point=(x,y,z)=>[x,y,z].join(",");
const cubes=new Set,corner=new Set,edges=new Set,faceInner=new Set;
for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++){
 const bounds=Number(x===0||x===L)+Number(y===0||y===L)+Number(z===0||z===L);
 if(bounds===0)continue;
 const k=point(x,y,z);cubes.add(k);
 if(bounds===3)corner.add(k);
 if(bounds>=2)edges.add(k);
 if(bounds===1)faceInner.add(k);
}
assert.equal(cubes.size,7778);
assert.equal(edges.size,428);
assert.equal(corner.size,8);
assert.equal(faceInner.size,7350);
assert.equal(12*(n-2)+8,428);
assert.equal(6*(n-2)**2,7350);
const windows=new Set;
for(let fixedAxis=0;fixedAxis<3;fixedAxis++)for(let side of [0,L]){
 const axes=[0,1,2].filter(a=>a!==fixedAxis);
 for(let i=8;i<=28;i++)for(let j=8;j<=28;j++){
  const coords=[null,null,null]; coords[fixedAxis]=side;
  coords[axes[0]]=i;coords[axes[1]]=j;
  const k=point(...coords);
  assert.ok(faceInner.has(k));
  windows.add(k);
 }
}
assert.equal(windows.size,6*21**2);
assert.equal(windows.size,2646);
// Twelve cube edges, deliberately choose eleven and five interior spots
// (positions 6, 12, 18, 24, 30) on each chosen edge, as source explicitly does.
const edgeLines=[];
for(let freeAxis=0;freeAxis<3;freeAxis++){
 const axes=[0,1,2].filter(a=>a!==freeAxis);
 for(const first of [0,L])for(const second of [0,L]){
  edgeLines.push({freeAxis,axes,first,second});
 }
}
assert.equal(edgeLines.length,12);
const removedEdges=new Set;
for(const {freeAxis,axes,first,second} of edgeLines.slice(0,11)){
 for(const j of [6,12,18,24,30]){
  const coords=[null,null,null];coords[freeAxis]=j;
  coords[axes[0]]=first;coords[axes[1]]=second;
  const k=point(...coords);assert.ok(edges.has(k));
  assert.ok(!windows.has(k));
  removedEdges.add(k);
 }
}
assert.equal(removedEdges.size,55);
const removed=new Set([...windows,...removedEdges]);
assert.equal(removed.size,2701);
assert.equal(cubes.size-removed.size,5077);
assert.equal([...edges].filter(k=>!removedEdges.has(k)).length,373);
assert.equal([...faceInner].filter(k=>!windows.has(k)).length,4704);
assert.equal(6*((n-2)**2-21**2),6*28**2);
assert.equal(21**2+28**2,35**2);
assert.equal(6*21**2+55,37*73);
assert.equal(6*28**2+373,5077);
assert.equal(55-18,37);
assert.equal(55+18,73);
assert.equal(18,3+6+9);
assert.equal(55**2-18**2,2701);
assert.equal(2*37**2-37,2701); // two adjacent entire faces union, different removal geometry
assert.equal(2*37-1,73);
assert.equal(2*37**2-37,6*21**2+55);
assert.equal(373,428-55);
assert.equal(37**3-35**3,7778);
assert.equal(7778-2701,5077);
// Hebrew standard and ordinal. Note ordinary ם=40, ך=20 and so forth.
const regular={א:1,ב:2,ג:3,ד:4,ה:5,ו:6,ז:7,ח:8,ט:9,י:10,כ:20,ל:30,מ:40,נ:50,ס:60,ע:70,פ:80,צ:90,ק:100,ר:200,ש:300,ת:400};
const ordinal={};for(const [i,l] of Object.keys(regular).entries())ordinal[l]=i+1;
const heb=(s,method)=>[...s].reduce((acc,ch)=>acc+(method[ch]||0),0);
assert.equal(heb("אהיה",regular),21);
assert.equal(heb("אמת",regular),441);
assert.equal(heb("רוב",ordinal),28);
const english=s=>[...s.toUpperCase()].reduce((acc,l)=>acc+(l>="A"&&l<="Z"?l.charCodeAt(0)-64:0),0);
assert.equal(english("ROV"),55);
// Prime index of 373, and primality of 5077 by trial division
const primes=[];for(let x=2;primes.length<74;x++)if(primes.every(p=>p*p>x||x%p!==0))primes.push(x);
assert.equal(primes[73],373);
for(let p=2;p*p<=5077;p++)assert.notEqual(5077%p,0);
console.log("PASS | 37^3 shell 7778 = 6*(35^2)+428; 6 windows of 21^2 plus 55 unique edge units =2701; remainder 6*(28^2)+373=5077; 21-28-35 Pythagorean; 55 is 37/73 midpoint and ROV Simple; two adjacent full faces also form Genesis 2701.");
