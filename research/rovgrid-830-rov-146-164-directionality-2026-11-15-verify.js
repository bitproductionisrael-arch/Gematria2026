#!/usr/bin/env node
"use strict";
// RovGrid — canonical Agrippa-Latin and English ordinal maps, 2026-11-15.
const assert=require("node:assert/strict");
const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const jvals=[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500];
const jew=Object.fromEntries([...letters].map((c,i)=>[c,jvals[i]]));
const simple=s=>[...s.toUpperCase().replace(/[^A-Z]/g,"")].reduce((v,c)=>v+letters.indexOf(c)+1,0);
const jewish=s=>[...s.toUpperCase().replace(/[^A-Z]/g,"")].reduce((v,c)=>v+jew[c],0);
const rows=[["ROV",830,55],["ONE FOUR SIX",830,146],["DIRECTIONALITY",830,164],["BELIEVE IN ME",830,101],["MTV",830,55],["AMIT",140,43],["MIKE",54,38],["AMIT MIKE ROV",1024,136],["SATAN",232,55],["HEAVEN",759,55],["HELL",53,37]];
for(const [name,j,s] of rows){assert.equal(jewish(name),j,name+" Jewish");assert.equal(simple(name),s,name+" Simple");}
assert.equal(830-146,18*38);
assert.equal(830-164,18*37);
assert.equal(830-101,9**3);
assert.equal(164-146,18);
assert.equal(4160,416*10);
assert.equal(416,2*208);
assert.equal(4160,2*2080);
assert.equal(4160,8*520);
assert.equal(146,2*73);
assert.equal(146%18,2);assert.equal(164%18,2);assert.equal(416%18,2);assert.equal(4160%18,2);
assert.equal(simple("AMIT MIKE"),81);assert.equal(81+55,136);
assert.equal(jewish("AMIT MIKE"),194);assert.equal(194+830,1024);
assert.equal((830-55)+(194-81),888);
assert.equal(55+55,110);assert.equal(28+82,110);assert.equal(37+73,110);
assert.equal((55-18)*(55+18),2701);
console.log("PASS: Jewish/English canonical words; ROV 830; ONE FOUR SIX 146; DIRECTIONALITY 164; BELIEVE IN ME 101; mirror and 4160; SATAN/HEAVEN 55, HELL 37.");
