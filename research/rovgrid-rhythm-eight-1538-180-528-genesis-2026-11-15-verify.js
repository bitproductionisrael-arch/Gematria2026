#!/usr/bin/env node
"use strict";
// RovGrid/Gematria2026 15-Nov-2026, independent arithmetic verification.
const assert = require("node:assert/strict");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const agrippa = [1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500];
const values = Object.fromEntries([...letters].map((c,i)=>[c,agrippa[i]]));
const clean = s => s.toUpperCase().replace(/[^A-Z]/g,"");
const simple = s => [...clean(s)].reduce((sum,c)=>sum+letters.indexOf(c)+1,0);
const jewish = s => [...clean(s)].reduce((sum,c)=>sum+values[c],0);
const english = s => 6*simple(s);
const t = n => n*(n+1)/2;
const h = n => n*(2*n-1);
const words = [
  ["ROV",830,55],["ANGEL",73,39],["MIHAEL",73,48],["MALACHAI",73,48],
  ["HOLY",478,60],["FOUR",336,60],["WORD",1034,60],
  ["HOLY FOUR WORD",1848,180],
  ["BOOM",132,45],["BOOM BOOM BOOM BOOM",528,180],
  ["JESUS",985,74],["GEMATRIA",233,74],
  ["CALCULATOR",478,106],["PROPHECY",666,106],
  ["JESUS CALCULATOR",1463,180],["GEMATRIA PROPHECY",899,180],
  ["WHAT",1009,52],["IS",99,28],["WHAT IS",1108,80],
  ["THE MEANING OF EIGHT",430,166],
  ["WHAT IS THE MEANING OF EIGHT",1538,246],
  ["THE MAGICK OF THE STAR FROM HEAVEN",1538,296],
  ["SEVENTY THREE",1538,166],
  ["THIRTY SEVEN",1537,165],
  ["HEAVEN",759,55],["SATAN",232,55],["HELL",53,37],
  ["BLAZE",528,46],["THE KEY",528,74],
  ["ONE FOUR SIX",830,146],["DIRECTIONALITY",830,164],
  ["BELIEVE IN ME",830,101],
  ["AMIT",140,43],["MIKE",54,38],["AMIT MIKE ROV",1024,136]
];
for (const [name,j,s] of words){
 assert.equal(jewish(name),j, name+": Jewish");
 assert.equal(simple(name),s, name+": Simple");
 assert.equal(english(name),6*s, name+": English ×6");
}
assert.equal(t(7),28);
assert.equal(t(9),45);
assert.equal(t(10),55);
assert.equal(t(16),136);
assert.equal(t(36),666);
assert.equal(t(37),703);
assert.equal(t(73),2701);
assert.equal(h(37),2701);
assert.equal(4*jewish("BOOM"),528);
assert.equal(3*simple("HOLY"),180);
assert.equal(4*simple("BOOM"),180);
assert.equal(6*296,1776);
assert.equal(296,8**3-6**3);
assert.equal(3*296,888);
assert.equal(1776,2*888);
assert.equal(296,8*37);
assert.equal(246,3*82);
assert.equal(166+80,246);
assert.equal(166,2*83);
assert.equal(55-18,37);
assert.equal(55+18,73);
assert.equal(55**2-18**2,2701);
assert.equal(3*t(36)+t(37),t(73));
for(let n=1;n<=100;n++)
 assert.equal(3*t(n-1)+t(n),t(2*n-1), "Universal triangular identity n="+n);
assert.equal((3**2+6**2)**2+(6**2-3**2-6/6)**2,2701);
const heb = {"א":1,"ב":2,"ג":3,"ד":4,"ה":5,"ו":6,"ז":7,"ח":8,"ט":9,"י":10,"כ":20,"ל":30,"מ":40,"נ":50,"ס":60,"ע":70,"פ":80,"צ":90,"ק":100,"ר":200,"ש":300,"ת":400,"ם":40,"ץ":90};
const wordsHeb = ["בראשית","ברא","אלהים","את","השמים","ואת","הארץ"];
const total = wordsHeb.map(s=>[...s].reduce((v,c)=>v+heb[c],0));
assert.deepEqual(total,[913,203,86,401,395,407,296]);
assert.equal(wordsHeb.join("").length,28);
assert.equal(total.reduce((a,b)=>a+b,0),2701);
assert.equal(total.slice(0,5).reduce((a,b)=>a+b,0),1998);
assert.equal(total.slice(5).reduce((a,b)=>a+b,0),703);
assert.equal(wordsHeb.join("").split("").reduce((sum,c)=>sum+((heb[c]-1)%9+1),0),82);
assert.equal(simple("AMIT MIKE"),81);
assert.equal(81+55,136);
assert.equal(28+82,110);
assert.equal(37+73,110);
assert.equal(jewish("AMIT MIKE")+jewish("ROV"),1024);
assert.equal((830-55)+(194-81),888);
assert.equal(666,jewish("PROPHECY"));
assert.equal(28,20+8);
assert.equal(208,200+6+2);
console.log("PASS: 3×60=4×45=180; BOOM Jewish×4=528; names 73/288; 1538/166; 296 and 1776; Genesis 28/82/1998/703/2701; n=1..100 triangular identity.");
