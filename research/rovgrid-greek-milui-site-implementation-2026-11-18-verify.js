#!/usr/bin/env node
"use strict";
const assert=require("node:assert/strict");
const g=require("../greek-letter-milui.js");
const count=(text,mode,depth=1)=>g.calculate(text,mode,depth).total;
const J=g.PRESETS.john,G=g.PRESETS.genesisLxx;
assert.equal(g.nameTable.length,24);
assert.equal(new Set(g.nameTable.map(x=>x.letter)).size,24);
for(const row of g.nameTable){
 assert.equal(g.score(row.letter,"standard"),row.standard);
 assert.equal(g.score(row.letter,"ordinal"),row.ordinal);
 assert.equal(g.score(row.letter,"fullStandard"),row.fullStandard);
 assert.equal(g.score(row.letter,"fullOrdinal"),row.fullOrdinal);
}
assert.deepEqual(g.nameTable[0],{letter:"Α",name:"ΑΛΦΑ",standard:1,ordinal:1,fullStandard:532,fullOrdinal:34});
assert.deepEqual(g.nameTable[8],{letter:"Ι",name:"ΙΩΤΑ",standard:10,ordinal:9,fullStandard:1111,fullOrdinal:53});
assert.equal(count("ἀρχῇ","standard"),719);
assert.equal(count("ἀρχῇ","fullStandard"),3462);
assert.equal(g.letters("ἀρχῇ").join(""),"ΑΡΧΗΙ");
assert.equal(count("λόγος","standard"),373);
assert.equal(count("λόγος","ordinal"),62);
assert.equal(count("Ἐν","standard"),55);
assert.equal(g.score("ΛΟΓΟΣ","standard"),373);
assert.equal(count(J,"standard"),3627);
assert.equal(count(J,"ordinal"),605);
assert.equal(count(J,"fullStandard"),22100);
assert.equal(count(J,"fullOrdinal"),2709);
assert.equal(count(G,"standard"),3167);
assert.equal(count(G,"ordinal"),446);
assert.equal(count(G,"fullStandard"),21190);
assert.equal(count(G,"fullOrdinal"),1953);
const p=g.calculate(J,"fullStandard");
assert.equal(p.words.length,17);
assert.equal(p.originalLength,52);
assert.equal(p.expandedLength,244);
const pparts=[p.words.slice(0,5),p.words.slice(5,12),p.words.slice(12)].map(arr=>arr.reduce((a,w)=>a+w.subtotal,0));
assert.deepEqual(pparts,[7033,9189,5878]);
assert.equal(pparts[0],13*541);
assert.equal(pparts[1]+pparts[2],13*19*61);
assert.equal(22100-21190,910);
assert.equal(22100,13*1700);
assert.equal(21190,13*1630);
assert.equal(2709-2704,5);
assert.notEqual(count(J,"fullOrdinal"),2704);
const councils=[
"Πρωτη Συνοδος της Νικαιας",
"Πρωτη Συνοδος της Κωνσταντινουπολις",
"Συνοδος της Εφεσου",
"Συνοδος της Χαλκηδονας",
"Δευτερη Συνοδος της Κωνσταντινουπολις",
"Τριτη Συνοδος της Κωνσταντινουπολις",
"Δευτερη Συνοδος της Νικαιας"
].join(" ");
assert.equal(councils.split(/\s+/).length,26);
assert.equal(g.letters(councils).length,180);
assert.equal(count(councils,"standard"),26123); // 37x73 full *text* standard, not letter-name milui
assert.equal(count(councils,"ordinal"),2457); // 37x73 full *text* ordinal
assert.equal(count(councils,"fullStandard"),95378);
assert.equal(count(councils,"fullOrdinal"),9005);
assert.equal(count("Α","fullStandard",2),g.score(g.expandLetters("Α",2).join(""),"standard"));
assert.equal(count("Α","fullOrdinal",3),g.score(g.expandLetters("Α",3).join(""),"ordinal"));
assert.equal(g.calculate(J,"fullStandard",2).total,
 g.calculate(J,"fullStandard",2).words.reduce((s,r)=>s+r.subtotal,0));
assert.throws(()=>g.expandLetters("Α",4));
assert.throws(()=>g.calculate("Α","fake"));
const he="אבגדהוזחטיכלמנסעפצקרשת";
const values=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const H=Object.fromEntries([...he].map((letter,i)=>[letter,values[i]]));
const O=Object.fromEntries([...he].map((letter,i)=>[letter,i+1]));
const names=Object.fromEntries("א:אלף ב:בית ג:גימל ד:דלת ה:הא ו:ויו ז:זין ח:חית ט:טית י:יוד כ:כף ל:למד מ:מם נ:נון ס:סמך ע:עין פ:פא צ:צדי ק:קוף ר:ריש ש:שין ת:תו".split(" ").map(s=>s.split(":")));
const finals={ך:"כ",ם:"מ",ן:"נ",ף:"פ",ץ:"צ"};
const verse="בראשית ברא אלהים את השמים ואת הארץ";
const filled=[...verse].map(c=>names[finals[c]||c]||"").join("");
const scored=(text,map)=>[...text].reduce((s,ch)=>s+(map[finals[ch]||ch]||0),0);
assert.equal(scored(verse,H),2701);
assert.equal(scored(filled,H),5476);
assert.equal(scored(filled,O),814);
assert.equal(filled.length,75);
console.log("PASS: 24 explicit Greek letter names; five-source comparison John 3627/22100/7033+15067, LXX Genesis 21190, seven Councils 26123/2457 (raw text), Hebrew Genesis 5476/814; John full ordinal independently 2709, source 2704 differs by five; recursive Greek milui 2/3 stable.");
