#!/usr/bin/env node
"use strict";
// Fundamental analysis of Ronald's three exposed faces/corner, two/edge,
// one/face, 48=16+32, odd wing increments, and RovGrid binary closure.
// Every assertion is finite or an exact polynomial identity.
const assert=require("node:assert/strict");
const fac=n=>n<2?1:n*fac(n-1);
const multinomial=(n,counts)=>fac(n)/counts.reduce((p,c)=>p*fac(c),1);
const pure=(n,k)=>[n**3,6*n*n,24*n,48][k];
function profile(n){
 const histogram=[0,0,0,0],p=n-2;
 for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++)
  histogram[[x,y,z].filter(v=>v===0||v===n-1).length]++;
 assert.deepEqual(histogram,[p**3,6*p*p,12*p,8]);
 const factorialMoment=k=>histogram.reduce((sum,count,d)=>{
  if(d<k)return sum;
  let ways=1;for(let j=0;j<k;j++)ways*=d-j;
  return sum+count*ways;
 },0);
 for(let k=0;k<=3;k++)assert.equal(factorialMoment(k),pure(n,k));
 const [core,face,edge,corner]=histogram;
 const A=corner,B=corner+edge,C=corner+edge+face;
 assert.equal(A+B+C,6*n*n);
 return {n,histogram,core,face,edge,corner,A,B,C,V:A+B,E:A*B,edgesMinusNodes:A*B-A-B,moments:[0,1,2,3].map(factorialMoment)};
}
const profiles=Array.from({length:100},(_,i)=>profile(i+2));
const get=n=>profiles[n-2];
assert.deepEqual(get(3).histogram,[1,6,12,8]);
assert.deepEqual(get(3).moments,[27,54,72,48]);
assert.equal(get(3).moments[1]+get(3).moments[2],126);
assert.equal(get(3).moments[2]-get(3).moments[1],18);
assert.equal(126,3**2+6**2+9**2);
assert.equal(18,3+6+9);
assert.equal(get(3).moments[2]/2+1,37);
assert.equal(get(3).moments[2]/3,24);
assert.equal(37*24,888);
assert.equal(get(3).A*get(3).B+get(3).A*get(3).C+get(3).B*get(3).C,888);
assert.deepEqual(get(4).histogram,[8,24,24,8]);
assert.deepEqual(get(4).moments,[64,96,96,48]);
assert.equal(profiles.filter(x=>x.core===x.corner&&x.face===x.edge).map(x=>x.n).join(","),"4");
assert.equal(profiles.filter(x=>x.moments[1]===x.moments[2]).map(x=>x.n).join(","),"4");
// Each of 8 corner cells offers all six permutations of three face directions.
// With one distinguished first direction X, 2 of 6 start with X, 4 with Y/Z.
const permutations=a=>a.length===0?[[]]:a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(b=>[v,...b]));
const orders=permutations(["X","Y","Z"]);
assert.equal(orders.length,6);
assert.equal(orders.filter(a=>a[0]==="X").length,2);
assert.equal(orders.filter(a=>a[0]!=="X").length,4);
assert.equal(get(2).corner*orders.length,48);
assert.equal(get(12).corner*orders.length,48);
assert.deepEqual([8*2,8*4],[16,32]);
assert.equal(16+32,48);
// Three state alphabet on each axis: low boundary, interior, high boundary.
// At n=3 the interior multiplicity is one, giving exactly 3^3 ternary cells.
// At n>3, each "interior" label is represented by (n-2) physical positions.
assert.equal(2**3,8);
assert.equal(3**3,27);
assert.deepEqual([8,12,6,1],[8,3*2*2,3*2,1]);
assert.equal(8+12+6+1,27);
assert.equal(8+12*2+6*2**2+2**3,4**3);
// n4 is exactly two binary choices per coordinate (boundary/interior,
// position within each category), so 6 coordinate bits, 1 cube bit,
// and 3 intra-block bits: 10 bits = 1024 microcells.
assert.equal(4**3,2**6);
assert.equal(2*4**3,2**7);
assert.equal(2*4**3*2**3,2**10);
assert.equal(2**10,1024);
const micros=new Set;
for(let block=0;block<128;block++)for(let dx=0;dx<2;dx++)for(let dy=0;dy<2;dy++)for(let dz=0;dz<2;dz++){
 const cube=Math.floor(block/64),p=block%64;
 const x=Math.floor(p/16),y=Math.floor(p%16/4),z=p%4;
 micros.add([cube,2*x+dx,2*y+dy,2*z+dz].join(","));
}
assert.equal(micros.size,1024);
// 12^3 boundary (3 or 2 exposed faces) supplies exactly 128 block labels,
// and the eight corner labels serve as eight independent microstate labels.
// Lexicographic indexing yields a bijection to the 2*8^3 arrangement,
// not an adjacency-preserving physical deformation of the 12^3 cube.
const boundary12=[];
for(let x=0;x<12;x++)for(let y=0;y<12;y++)for(let z=0;z<12;z++){
 if([x,y,z].filter(v=>v===0||v===11).length>=2)boundary12.push([x,y,z]);
}
assert.equal(boundary12.length,128);
assert.equal(get(12).A,8);assert.equal(get(12).B,128);
assert.equal(get(12).V,136);assert.equal(get(12).E,1024);
assert.equal(get(12).edgesMinusNodes,888);
assert.equal(get(12).E-get(12).V+1,889); // K_8,128 first Betti/cycle rank.
assert.equal(get(12).moments[2],288);
assert.equal(get(12).moments[1],864);
assert.equal(get(12).moments[3],48);
assert.equal(get(12).moments[0],2*get(12).moments[1]);
assert.equal(888-get(12).moments[1],24);
// All five input numbers are the SAME V(n)=A+B=12n-8 observable.
for(const [n,v] of [[12,136],[14,160],[18,208],[44,520],[86,1024]]){
 assert.equal(get(n).V,v);
 assert.equal((v+8)/12,n);
 assert.equal(v%24,16);
}
assert.equal(get(44).B,512);
assert.equal(get(44).E,4096);
assert.equal(get(86).E,8128);
assert.equal(get(86).E-get(86).V,8*888);
const properDivSum=n=>{let s=0;for(let k=1;k<n;k++)if(n%k===0)s+=k;return s};
assert.equal(properDivSum(8128),8128);
assert.equal(profiles.filter(x=>x.edgesMinusNodes===888).map(x=>x.n).join(","),"12");
for(const n of [2,4,12,44,172])assert.equal(get(n).B,2**({2:3,4:5,12:7,44:9,172:11}[n]));
// Core fixed vs shell observed: two 4^3 shells share 56 fixed positions;
// upper core 1B+2M+4R+1G and lower core 0B+2M+6R+0G.
assert.equal(multinomial(8,[1,2,4,1]),840);
assert.equal(multinomial(8,[0,2,6,0]),28);
assert.equal(840*28,23520);
assert.equal(4**16,2**32);
assert.equal(65+20+26+17,128);
assert.deepEqual([65,20,26,17].map(c=>8*c),[520,160,208,136]);
// One-sided wing on an n^2 face: n^2-(n-1)^2=2n-1.
// 3D expansion by union of three perpendicular slabs:
// n^3-(n-1)^3 = 3n^2-3n+1.
assert.deepEqual([2,3,4,5].map(n=>n*n-(n-1)**2),[3,5,7,9]);
assert.equal(3+5+7+9,24);
for(let n=2;n<=101;n++){
 assert.equal(n*n-(n-1)**2,2*n-1);
 assert.equal(n**3-(n-1)**3,3*n*n-3*n+1);
 assert.equal(6*n*n-6*(n-1)**2,6*(2*n-1));
}
console.log("PASS | universal exposure polynomial; first 3 moments 54/72/48; invariant 48=16+32; 4^3 palindrome and 10-bit bijection; n=12 full 136/1024/888; same V(n) gives 136/160/208/520/1024; 23520 hidden core arrangements; wing 3/5/7/9.");
