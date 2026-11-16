"use strict";
const assert=require("node:assert/strict");
const ABC=[..."אבגדהוזחטיכלמנסעפצקרשת"];
const V=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const H=Object.fromEntries(ABC.map((c,i)=>[c,V[i]]));
const F={"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"};
const chars=s=>[...s.replace(/\\s/g,"")].map(c=>F[c]||c).filter(c=>ABC.includes(c));
const calc={
  regular:s=>chars(s).reduce((sum,c)=>sum+H[c],0),
  ordinal:s=>chars(s).reduce((sum,c)=>sum+ABC.indexOf(c)+1,0),
  atbash:s=>chars(s).reduce((sum,c)=>sum+H[ABC[21-ABC.indexOf(c)]],0),
  small:s=>chars(s).reduce((sum,c)=>sum+1+(H[c]-1)%9,0),
  length:s=>chars(s).length
};
const milui="שין למד מם הא";
for(const [s,kind,expected] of [
  ["קו","regular",106],
  ["עמית","regular",520],
  ["שלמה","regular",375],
  ["שלמה","small",15],
  ["קהלת","regular",535],
  ["קהלת","ordinal",58],
  ["קהלת","small",13],
  ["מייק","regular",160],
  ["רוב","regular",208],
  ["עמית מייק רוב","regular",888],
  ["עמית מייק רוב","atbash",535],
  ["עמית מייק רוב","small",33],
  ["עמית","atbash",58],
  ["מייק","atbash",94],
  ["רוב","atbash",383],
  ["מייק רוב","atbash",477],
  ["משל","regular",370],
  ["משל","small",10],
  ["יחידה","regular",37],
  ["יחידה","ordinal",37],
  ["נקודה","regular",165],
  [milui,"regular",520],
  [milui,"ordinal",106],
  [milui,"length",10],
  ["שין","regular",360],
  ["שין","ordinal",45],
  ["למד","regular",74],
  ["למד","ordinal",29],
  ["מם","regular",80],
  ["מם","ordinal",26],
  ["הא","regular",6],
  ["הא","ordinal",6],
]) assert.equal(calc[kind](s),expected,s+" "+kind);
assert.equal(360+74+80+6,520);
assert.equal(45+29+26+6,106);
assert.equal(520+15,535);
assert.equal(375+160,535);
assert.equal(370+165,535);
assert.equal(535-106,13*33);
assert.equal(370,37*10);
assert.equal(106,2*53); // 53 is a separate calculator.html π alphabet output, not computed in this script.
assert.equal(58+94+383,535);
assert.equal(535-58,477);
console.log(JSON.stringify({status:"PASS",checks:"Standard regular, ordinal, Atbash and small Hebrew maps + selected identities",miluiRegular:520,miluiOrdinal:106,koheletRegular:535,koheletOrdinal:58,koheletSmall:13},null,2));
