#!/usr/bin/env node
"use strict";
// Torah endpoints --> lev32 --> 32x32 board --> D4: 136 orbits, 888 redundant representatives.
// Run: node research/rovgrid-torah-ends-lev32-1024-d4-genesis28-2026-11-15-verify.js
const a=require("node:assert/strict");
const L="אבגדהוזחטיכלמנסעפצקרשת";
const V=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const h=(s,mode="regular")=>[...s.replace(/\s/g,"")].reduce((z,c)=>{const i=L.indexOf(c);a.ok(i>=0,"Hebrew alphabet");return z+(mode==="regular"?V[i]:i+1);},0);
const T=n=>n*(n+1)/2;
a.equal(h("לב"),32);
a.equal(h("לב","ordinal"),14);
a.equal(h("בל"),32);
a.equal(32*32,1024);
a.equal(14+14,28);
a.equal(h("יד"),14);
a.equal(h("דוד"),14);
a.equal(h("רוב","ordinal"),28);
a.equal(T(7),28);
a.equal(T(16),136);
a.equal(T(73),2701);
a.equal(32-14,18);
a.equal((55-18)*(55+18),2701);
const words=["בראשית","ברא","אלהים","את","השמים","ואת","הארץ"];
a.equal(words.slice(0,3).join("").length,14);
a.equal(words.slice(3).join("").length,14);
a.equal(words.join("").length,28);
a.equal(words.slice(0,3).map(w=>h(w)).reduce((s,n)=>s+n,0),1202);
a.equal(words.slice(3).map(w=>h(w)).reduce((s,n)=>s+n,0),1499);
a.equal(words.map(w=>h(w)).reduce((s,n)=>s+n,0),2701);
const n=32, k=(r,c)=>r*n+c, rev= x=>n-1-x;
function orbit(r,c){
 const coords=[[r,c],[r,rev(c)],[rev(r),c],[rev(r),rev(c)],[c,r],[rev(c),rev(r)],[c,rev(r)],[rev(c),r]];
 return [...new Set(coords.map(([a,b])=>k(a,b)))].sort((a,b)=>a-b);
}
const seen=new Set(),sizeDist={};
for(let r=0;r<n;r++) for(let c=0;c<n;c++){
 const item=k(r,c);
 if(seen.has(item))continue;
 const o=orbit(r,c);for(const v of o){a.ok(!seen.has(v));seen.add(v);}
 sizeDist[o.length]=(sizeDist[o.length]||0)+1;
}
a.equal(seen.size,1024);
a.deepEqual(sizeDist,{"4":16,"8":120});
const orbits=Object.values(sizeDist).reduce((s,v)=>s+v,0);
a.equal(orbits,136);
a.equal(1024-orbits,888);
a.equal((1024+32+32)/8,136);
a.equal(120*8+16*4,1024);
a.equal(120+16,136);
console.log("PASS: Hebrew lev=32 regular/14 ordinal; Genesis 14+14=28; 32x32 D4 has 120 eight-cell + 16 four-cell orbits =136; 1024-136=888.");
