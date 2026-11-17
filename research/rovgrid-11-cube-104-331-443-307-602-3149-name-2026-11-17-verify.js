#!/usr/bin/env node
"use strict";
// Self-contained integer-only checker for the n=10 -> n=11 RovGrid exposure study.
// Source mappings: calculator.html and existing dated RovGrid research annexes.
const assert=require("node:assert/strict");
const LETTERS="אבגדהוזחטיכלמנסעפצקרשת";
const FINALS={ך:"כ",ם:"מ",ן:"נ",ף:"פ",ץ:"צ"};
const value=ch=>{const i=LETTERS.indexOf(FINALS[ch]||ch);if(i<0)throw Error(ch);return i<9?i+1:i<18?(i-8)*10:(i-17)*100};
const gem=s=>[...s].filter(ch=>LETTERS.includes(ch)||ch in FINALS).reduce((a,ch)=>a+value(ch),0);
const nthPrime=n=>{let count=0;for(let a=2;;a++){let prime=true;for(let b=2;b*b<=a;b++)if(a%b===0){prime=false;break}if(prime&&++count===n)return a}};
const T=n=>n*(n+1)/2;
function voxels(n){
 const counts=[0,0,0,0];
 for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++){
  const exposed=[x,y,z].filter(k=>k===0||k===n-1).length;
  counts[exposed]++;
 }
 const [core,face,edge,corner]=counts;
 const A=corner,B=corner+edge,C=corner+edge+face;
 const exposedFaces=A+B+C;
 const e2=A*B+A*C+B*C;
 assert.equal(A,8);
 assert.equal(B,12*n-16);
 assert.equal(C,6*n*n-12*n+8);
 assert.equal(exposedFaces,6*n*n);
 assert.equal(e2,24*(3*n**3-8*n*n+12*n-8));
 return {n,total:n**3,core,face,edge,corner,A,B,C,exposedFaces,e2,quotient:e2/24};
}
const cubes=Array.from({length:10},(_,i)=>voxels(i+2));
assert.deepEqual(cubes.map(x=>[x.n,x.A,x.B,x.C,x.e2,x.quotient]),[
 [2,8,8,8,192,8],
 [3,8,20,26,888,37],
 [4,8,32,56,2496,104],
 [5,8,44,98,5448,227],
 [6,8,56,152,10176,424],
 [7,8,68,218,17112,713],
 [8,8,80,296,26688,1112],
 [9,8,92,386,39336,1639],
 [10,8,104,488,55488,2312],
 [11,8,116,602,75576,3149],
]);
const ten=cubes[8],eleven=cubes[9];
assert.equal(ten.B,104);
assert.equal(104*2,gem("רוב"));
assert.equal(104*5,gem("עמית"));
assert.equal(104*7,gem("עמית רוב"));
assert.equal(gem("עמית רוב")+gem("מייק"),888);
assert.equal(104,8*13);assert.equal(104,4*26);
assert.equal(104,8*26/2); // LCM(8,26)=104
assert.equal(104*24,cubes[2].e2);
assert.equal(11**3,1331);
assert.equal("עמיתמייקרוב".length,11);
assert.equal("AmitMikeRov".length,11);
assert.equal(eleven.core,9**3);
assert.equal(eleven.face,486);assert.equal(eleven.edge,108);
assert.equal(eleven.corner,8);assert.equal(eleven.C,602);
assert.equal(eleven.C,gem("עמית")+82);
assert.equal(eleven.C,7*gem("אלהים"));
assert.equal(eleven.total-eleven.core,eleven.C);
assert.equal(eleven.exposedFaces,726);
assert.equal(eleven.exposedFaces,11*T(11));
for(let n=1;n<=30;n++)assert.equal(6*n*n===n*T(n),n===11);
assert.equal(eleven.total-10**3,331);
assert.equal(nthPrime(gem("בינה")),331);
assert.equal(eleven.total-gem("עמית מייק רוב"),443);
assert.equal(nthPrime(gem("אלהים")),443);
assert.equal(eleven.total-1024,307);
assert.equal(gem("בינה עצה בחכמה"),307);
assert.equal(443-307,136);assert.equal(1024-888,136);
assert.equal(eleven.e2,928+4816+69832);
assert.equal(eleven.e2/24,47*67);
assert.equal(gem("אום"),47);assert.equal(gem("בינה"),67);
assert.equal(cubes[7].quotient,1639);
assert.equal(10**3-8**3,488);
assert.equal(11**3-9**3,602);
assert.equal((11**3).toString(2).length,11);
assert.equal(11**3,1000+300+30+1);
console.log("PASS: n=2..11 voxel exposure; 10^3 B=104; 11^3 name-length=11; shell602; 1331=888+P86=1024+307; delta331=P67; 726=11*T11; e2(9)/24=1639; e2(11)/24=47*67.");
