#!/usr/bin/env node
// RovGrid, 2026-11-15. No dependencies. Run: node research/rovgrid-genesis-rov-28-55-pascal-mirror-2026-11-15-verify.js
"use strict";
const assert=require("node:assert/strict");
const T=n=>n*(n+1)/2, H=n=>n*(2*n-1);
const base="אבגדהוזחטיכלמנסעפצקרשת";
const vals=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const final={"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"};
function heb(s,mode="standard"){
  return [...s.replace(/\s/g,"")].reduce((a,raw)=>{
    const ch=final[raw]||raw;
    const ix=base.indexOf(ch);
    assert(ix>=0, "Unknown Hebrew letter: "+raw);
    const v=vals[ix];
    return a+(mode==="standard"?v:mode==="ordinal"?ix+1:((v-1)%9)+1);
  },0);
}
function en(s,small=false){
 return [...s.toUpperCase().replace(/[^A-Z]/g,"")].reduce((a,c)=>{
   const n=c.charCodeAt(0)-64;
   return a+(small?((n-1)%9)+1:n);
 },0);
}
const words=["בראשית","ברא","אלהים","את","השמים","ואת","הארץ"];
const verse=words.join(" ");
assert.equal(words.length,7);
assert.deepEqual(words.map(w=>[...w].length),[6,3,5,2,5,3,4]);
assert.equal([...words.join("")].length,28);
assert.deepEqual(words.map(w=>heb(w)),[913,203,86,401,395,407,296]);
assert.deepEqual(words.map(w=>heb(w,"small")),[13,5,14,5,17,11,17]);
assert.equal(heb(verse),2701);
assert.equal(heb(verse,"small"),82);
assert.equal(heb("רוב","ordinal"),28);
assert.equal(heb("רוב"),208);
assert.equal(en("ROV"),55);
assert.equal(en("Amit Mike Rov"),136);
assert.equal(en("Amit Mike Rov",true),55);
assert.equal(T(7),28);assert.equal(T(10),55);assert.equal(T(16),136);
assert.equal(T(73),2701);assert.equal(H(37),2701);
assert.equal(28+82,110);assert.equal(37+73,110);
assert.equal((28+82)/2,55);assert.equal((37+73)/2,55);
assert.equal(55-18,37);assert.equal(55+18,73);
assert.equal(55**2-18**2,2701);
assert.equal(136-55,81);
assert.equal(28+3*T(3)+9*T(1),55);
assert.equal(1+3+6,10);assert.equal(Number("1"+"3"+"6"),136);
assert.equal(Array.from({length:16},(_,i)=>T(i+1)).reduce((a,b)=>a+b,0),816);
const key=(r,c)=>r+":"+c;
const allEven=new Set();
let odd=0;
for(let r=0;r<16;r++)for(let c=0;c<=r;c++){
  if((c&r)===c)odd++;
  else allEven.add(key(r,c));
}
assert.equal(odd,81);
assert.equal(allEven.size,55);
const groups=[
  new Set(Array.from({length:7},(_,i)=>8+i).flatMap(r=>Array.from({length:8-(r-7)},(_,i)=>key(r,r-7+i)))),
  new Set(Array.from({length:3},(_,i)=>4+i).flatMap(r=>Array.from({length:4-(r-3)},(_,i)=>key(r,r-3+i)))),
  new Set(Array.from({length:3},(_,i)=>12+i).flatMap(r=>Array.from({length:4-(r-11)},(_,i)=>key(r,r-11+i)))),
  new Set(Array.from({length:3},(_,i)=>12+i).flatMap(r=>Array.from({length:12-(r-3)},(_,i)=>key(r,r-3+i))))
];
assert.deepEqual(groups.map(g=>g.size),[28,6,6,6]);
const union=new Set();
for(const group of groups)for(const p of group){
  assert(allEven.has(p),"A claimed hole is not even: "+p);
  assert(!union.has(p),"Hole groups overlap: "+p);
  union.add(p);
}
const alone=[...allEven].filter(p=>!union.has(p)).sort();
assert.equal(alone.length,9);
assert.deepEqual(alone,["10:1","10:9","14:1","14:13","14:5","14:9","2:1","6:1","6:5"].sort());
assert.equal(union.size+alone.length,55);
console.log("PASS: Genesis letters 28, regular 2701, small 82; ROV 55 / רוב 28; triangular indices; two 55 mirrors; 55 Pascal even cells = T7+3T3+9T1, odd=81; 816 tetrahedral.");
