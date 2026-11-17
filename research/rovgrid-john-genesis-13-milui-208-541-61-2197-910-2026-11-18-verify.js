#!/usr/bin/env node
"use strict";
// Reproducible numerical study of user-supplied 13-factor claims.
// Critical distinction: direct Greek standard isopsephy and Hebrew standard
// are independently recomputed; Greek "spelled-in-full" 22100/21190/2704
// are ARITHMETIC CHECKS ONLY pending an exact expansion map and LXX edition.
const assert=require("node:assert/strict");
const greekChars="ΑΒΓΔΕϚΖΗΘΙΚΛΜΝΞΟΠϞΡΣΤΥΦΧΨΩϠ";
const greekValues=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900];
const greekMap=Object.fromEntries([...greekChars].map((c,i)=>[c,greekValues[i]]));
function greek(str){
 // U+0345 GREEK YPOGEGRAMMENI is numerically an iota 10 in ἀρχῇ.
 const normalized=str.toUpperCase().normalize("NFD").replace(/\u0345/g,"Ι");
 return [...normalized].reduce((s,c)=>s+(greekMap[c]||0),0);
}
const john="Ἐν ἀρχῇ ἦν ὁ λόγος καὶ ὁ λόγος ἦν πρὸς τὸν θεόν καὶ θεὸς ἦν ὁ λόγος";
const johnWordValues=[55,719,58,70,373,31,70,373,58,450,420,134,31,284,58,70,373];
assert.deepEqual(john.split(/\s+/).map(greek),johnWordValues);
assert.equal(greek(john),3627);
const johnWords=john.split(/\s+/);
const first=johnWords.slice(0,5),middle=johnWords.slice(5,12),last=johnWords.slice(12,17);
assert.deepEqual([first.length,middle.length,last.length],[5,7,5]);
assert.deepEqual([first,middle,last].map(part=>part.reduce((s,w)=>s+greek(w),0)),[1275,1536,816]);
assert.equal(1536,3*8**3);
assert.equal(816,6*136);
assert.equal(816,3*272);
assert.equal(1275,3*425);
assert.equal(1275+1536+816,3627);
assert.equal(425+512+272,1209);
assert.equal(913+296,1209);
assert.equal(3*(913+296),3627);
assert.equal(greek("Ο ΛΟΓΟΣ"),443);
assert.equal(443,70+373);
assert.equal(888+443,11**3);
assert.equal(1331,888+443);
assert.equal(443,Number(443));

assert.equal(greek("ΙΗΣΟΥΣ"),888);
assert.equal(greek("ΛΟΓΟΣ"),373);
assert.equal(greek("ΙΗΣΟΥΣ Ο ΝΑΖΩΡΑΙΟΣ"),2197);
assert.equal(2197,13**3);
assert.equal(3627,13*279);
assert.equal(3627,39*93);
const hebLetters="אבגדהוזחטיכלמנסעפצקרשת";
const hebValues=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const heMap=Object.fromEntries([...hebLetters].map((c,i)=>[c,hebValues[i]]));
Object.assign(heMap,{ך:20,ם:40,ן:50,ף:80,ץ:90});
const ordinal=Object.fromEntries([...hebLetters].map((c,i)=>[c,i+1]));
Object.assign(ordinal,{ך:11,ם:13,ן:14,ף:17,ץ:18});
function value(str,map){return [...str].reduce((s,c)=>s+(map[c]||0),0)}
assert.equal(value("עמית מייק רוב",heMap),888);
assert.equal(value("רוב",heMap),208);
assert.equal(value("מייק",ordinal),52);
assert.equal(value("ישראל",heMap),541);
assert.equal(value("אני",heMap),61);
assert.equal(value("אני הוא",{...heMap,א:1,נ:5,י:1,ה:5,ו:6}),19); // this object's values express the conventional digit-reduced letter sum of the six-letter phrase
assert.equal(value("אחד",heMap),13);
assert.equal(value("אהבה",heMap),13);
assert.equal(value("דברתי",heMap),616);
assert.equal(value("מלכי",heMap),100);
assert.equal(value("צדק",heMap),194);
assert.equal(value("דברתי מלכי צדק",heMap),910);
assert.equal(value("על דברתי מלכי צדק",heMap),1010);
// Provided Milui totals: arithmetic consistent; NOT independently attested as
// results of a fully specified Greek letter-name / Greek-ordinal mapping.
const johnStandard=13*279;
const johnFull=13*1700;
const johnFullOrdinal=13*208;
const johnStartFull=13*541;
const johnRemainderFull=13*19*61;
const genesisLXXFull=13*1630;
assert.deepEqual([johnStandard,johnFull,johnFullOrdinal,johnStartFull,johnRemainderFull,genesisLXXFull],
[3627,22100,2704,7033,15067,21190]);
assert.equal(johnStartFull+johnRemainderFull,johnFull);
assert.equal(541+19*61,1700);
assert.equal(johnFull-genesisLXXFull,910);
assert.equal(910,13*70);
assert.equal(910,10*91);
// The new single-base, equal-area cube/box mapping:
assert.equal(johnFullOrdinal,52**2);
assert.equal(johnFullOrdinal,4*26**2);
assert.equal(johnFullOrdinal,16*13**2);
assert.equal(johnFullOrdinal,13*208);
assert.equal(208,16*13);
assert.equal(208,4*52);
assert.equal(52,2*26);
assert.equal(johnFullOrdinal-2197,3*13**2);
assert.equal(johnFullOrdinal-2197,507);
assert.equal(johnFullOrdinal,13**2*16);
assert.equal(johnFullOrdinal-2701,3);
assert.equal(2701,37*73);
const cube = new Set;
for(let a=0;a<13;a++)for(let b=0;b<13;b++)for(let c=0;c<13;c++)cube.add([a,b,c].join(","));
const threeAddedLayers = new Set;
for(let c=13;c<16;c++)for(let a=0;a<13;a++)for(let b=0;b<13;b++){
 const k=[a,b,c].join(",");
 assert.equal(cube.has(k),false);
 threeAddedLayers.add(k);
}
assert.equal(cube.size,2197);
assert.equal(threeAddedLayers.size,507);
assert.equal(cube.size+threeAddedLayers.size,2704);
// John 1:1 Greek standard 3627 value depends on correct iota subscript, else 3617.
assert.equal(greek("ἀρχῇ"),719);
assert.equal(greek("ἀρχη"),709);
console.log("PASS | Greek John 1:1 standard=3627 independently verified with iota subscript, Jesus of Nazareth=2197 and Logos=373; Hebrew Rov208/Mike ordinal52/Israel541/Ani61/Melchizedek phrase910 verified; all provided Greek milui numeric decompositions checked as arithmetic only; 13x13x13 -> 13x13x16 exact 507-voxel extension, 2704=52².");
