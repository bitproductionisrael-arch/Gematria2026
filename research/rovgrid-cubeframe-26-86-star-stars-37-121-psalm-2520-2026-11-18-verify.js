#!/usr/bin/env node
"use strict";
/* 2026-11-18 · Source grounded 37x73 geometry of Cube Frame, octahedron,
 * Genesis 'the earth'=296, Greek 888/1480/2368, Psalm 37 and Greek Shema.
 * Includes independent coordinate enumerator and a general V/E skeleton theorem.
 */
const assert=require("node:assert/strict");
const greek=require("../greek-letter-milui.js");
const frame=n=>12*n-16;
const octaFrame=n=>12*n-18;
const shell=n=>n**3-(n-2)**3;
const star=n=>6*n*(n-1)+1;
const triangular=n=>n*(n+1)/2;
const polyFrame=(V,E,n)=>V+E*(n-2);
const polys=[
 ["cube",8,12,296],
 ["octahedron",6,12,294],
 ["tetrahedron",4,6,148],
 ["cuboctahedron",12,24,588],
 ["rhombic dodecahedron",14,24,590],
 ["icosahedron",12,30,732],
 ["dodecahedron",20,30,740]
];
for(const [name,V,E,at26] of polys)assert.equal(polyFrame(V,E,26),at26,name);
for(let n=2;n<=28;n++){
 const counts=[0,0,0,0], octantCounts={};
 for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++){
  const exposed=Number(x===0||x===n-1)+Number(y===0||y===n-1)+Number(z===0||z===n-1);
  counts[exposed]++;
  if(n%2===0&&exposed>=2){
   const o=[x>=n/2,y>=n/2,z>=n/2].map(Number).join("");
   octantCounts[o]=(octantCounts[o]||0)+1;
  }
 }
 assert.equal(counts[2]+counts[3],frame(n));
 assert.equal(counts[1]+counts[2]+counts[3],shell(n));
 assert.equal(counts[3],8);
 if(n%2===0){
  assert.equal(Object.keys(octantCounts).length,8);
  for(const p of Object.values(octantCounts))assert.equal(p,3*(n/2)-2);
 }
}
assert.equal(frame(26),296);
assert.equal(octaFrame(26),294);
assert.equal(frame(26)-octaFrame(26),2);
assert.equal(shell(8),296);
assert.equal(frame(26),8*37);
assert.equal(frame(26)/8,1+3*12);
assert.equal(shell(8)/8,star(3));
assert.equal(star(3),37);
assert.equal(star(5),121);
assert.equal(37*121,4477);
assert.equal(24*105,2520);
assert.equal(triangular(14),105);
assert.equal(2520-888,12*136);
assert.equal(24*(105-37),12*136);
assert.equal(888,3*frame(26));
assert.equal(1480,5*frame(26));
assert.equal(2368,8*frame(26));
assert.equal(888+1480,2368);
assert.equal(16**3-12**3,2368);
assert.equal(shell(16)+shell(14),2368);
const series=[12,16,20,24,28,32,36,40];
assert.deepEqual(series.map(frame),[128,176,224,272,320,368,416,464]);
assert.equal(series.reduce((a,b)=>a+b,0),208); // Rov Hebrew 208
assert.equal(series.reduce((a,n)=>a+frame(n),0),2368);
assert.equal(series.reduce((a,n)=>a+frame(n),0),8*frame(26));
for(let k=1;k<=15;k++){
 const shellSide=2*k;
 const frameSide=2*k*(k-1)+2;
 assert.equal(frame(frameSide),shell(shellSide));
 assert.equal(frame(frameSide)/8,star(k));
}
assert.deepEqual([1,2,3,4,5,6,7].map(k=>2*k*(k-1)+2),[2,6,14,26,42,62,86]);
assert.equal(frame(62),728);
assert.equal(frame(86),1016);
assert.equal(shell(14),1016);
assert.equal(frame(86)+8,1024);
assert.equal(frame(86)-frame(26),720);
assert.equal(frame(86)-frame(26),12*(86-26));
assert.equal(frame(26)+720+8,1024);
assert.equal(1024-888,136);
assert.equal(2368-888,1480);
// The Greek line is the exact wording shown in user-uploaded Septuagint Shema illustration.
const shema="Ἄκουε, Ἰσραήλ· κύριος ὁ θεὸς ἡμῶν κύριος εἷς ἐστιν.";
assert.equal(greek.score(shema,"standard"),4477);
assert.deepEqual(greek.calculate(shema,"standard").words.map(w=>w.subtotal),[496,349,800,70,284,898,800,215,565]);
const heb="אבגדהוזחטיכלמנסעפצקרשת";
const vals=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const H=Object.fromEntries([...heb].map((c,i)=>[c,vals[i]]));
for(const [f,b] of Object.entries({ך:"כ",ם:"מ",ן:"נ",ף:"פ",ץ:"צ"}))H[f]=H[b];
const hebScore=s=>[...s].reduce((a,c)=>a+(H[c]||0),0);
assert.equal(hebScore("לדוד אל תתחר במרעים אל תקנא בעשי עולה"),2520);
assert.equal(hebScore("הארץ"),296);
assert.equal(hebScore("יהוה"),26);
assert.equal(hebScore("אלהים"),86);
assert.equal(hebScore("רוב"),208);
console.log("PASS: cube26 Frame296 = shell8, three/five/eight frames=888/1480/2368; cube86 Frame1016+8=1024; universal polyhedral V+E(n-2) and cube/octa26=296/294; 7 frame-shell matches incl 728; Greek Shema4477=37*121, Psalm37:1=2520=24*T14, 2520-888=12*136.");
