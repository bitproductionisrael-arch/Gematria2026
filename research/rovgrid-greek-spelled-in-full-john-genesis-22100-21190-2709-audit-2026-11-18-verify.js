#!/usr/bin/env node
"use strict";
// Greek spelled-in-full (Greek milui) reconstructed from actual letter names.
// Standard letter-name expansion values are 22100 (John) and 21190 (LXX Genesis).
// Greek 24-letter ordinal for these SAME expansions gives 2709 (not the claimed 2704).
// Each letter can be audited independently; normalization counts iota subscript.
const assert=require("node:assert/strict");
const ALPHABET="ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
const NUMERALS="ΑΒΓΔΕϚΖΗΘΙΚΛΜΝΞΟΠϞΡΣΤΥΦΧΨΩϠ";
const NUMVALUES=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900];
const NUM=Object.fromEntries([...NUMERALS].map((c,i)=>[c,NUMVALUES[i]]));
const ORD=Object.fromEntries([...ALPHABET].map((c,i)=>[c,i+1]));
const NAMES={
 Α:"ΑΛΦΑ", Β:"ΒΗΤΑ", Γ:"ΓΑΜΜΑ", Δ:"ΔΕΛΤΑ", Ε:"ΕΨΙΛΟΝ",
 Ζ:"ΖΗΤΑ", Η:"ΗΤΑ", Θ:"ΘΗΤΑ", Ι:"ΙΩΤΑ", Κ:"ΚΑΠΠΑ",
 Λ:"ΛΑΜΒΔΑ", Μ:"ΜΥ", Ν:"ΝΥ", Ξ:"ΞΙ", Ο:"ΟΜΙΚΡΟΝ", Π:"ΠΙ",
 Ρ:"ΡΩ", Σ:"ΣΙΓΜΑ", Τ:"ΤΑΥ", Υ:"ΥΨΙΛΟΝ", Φ:"ΦΙ",
 Χ:"ΧΙ", Ψ:"ΨΙ", Ω:"ΩΜΕΓΑ",
};
function letters(text) {
 const norm=text.normalize("NFD").replace(/\u0345/g,"Ι").toUpperCase().normalize("NFD");
 return [...norm].filter(c=>Object.prototype.hasOwnProperty.call(ORD,c)).join("");
}
const sum=(s,map)=>[...s].reduce((v,c)=>v+(map[c]||0),0);
const expanded=s=>[...letters(s)].map(c=>NAMES[c]).join("");
const profile=s=>({length:letters(s).length,expandedLength:expanded(s).length,standard:sum(letters(s),NUM),fullStandard:sum(expanded(s),NUM),ordinal:sum(letters(s),ORD),fullOrdinal:sum(expanded(s),ORD)});
const john="Ἐν ἀρχῇ ἦν ὁ λόγος καὶ ὁ λόγος ἦν πρὸς τὸν θεόν καὶ θεὸς ἦν ὁ λόγος";
const genesis="Ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν";
assert.deepEqual(profile("Α"),{length:1,expandedLength:4,standard:1,fullStandard:532,ordinal:1,fullOrdinal:34});
assert.deepEqual(profile("Ι"),{length:1,expandedLength:4,standard:10,fullStandard:1111,ordinal:9,fullOrdinal:53});
assert.equal(profile("ἀρχῇ").standard,719);
assert.equal(profile("ἀρχῇ").fullStandard,3462);
assert.deepEqual(profile(john),{length:52,expandedLength:244,standard:3627,fullStandard:22100,ordinal:605,fullOrdinal:2709});
assert.deepEqual(profile(genesis),{length:39,expandedLength:160,standard:3167,fullStandard:21190,ordinal:446,fullOrdinal:1953});
const jw=john.split(/\s+/);
assert.equal(jw.length,17);
const p1=profile(jw.slice(0,5).join(" "));
const p2=profile(jw.slice(5,12).join(" "));
const p3=profile(jw.slice(12).join(" "));
assert.deepEqual([p1.standard,p2.standard,p3.standard],[1275,1536,816]);
assert.deepEqual([p1.fullStandard,p2.fullStandard,p3.fullStandard],[7033,9189,5878]);
assert.equal(p2.fullStandard+p3.fullStandard,15067);
assert.equal(7033,13*541);
assert.equal(15067,13*19*61);
assert.equal(22100,13*1700);
assert.equal(21190,13*1630);
assert.equal(22100-21190,910);
assert.equal(2709-2704,5);
const fullOrd24=Object.values(NAMES).every(s=>[...s].every(c=>ORD[c]!==undefined));
assert.equal(fullOrd24,true);
console.log(JSON.stringify({john:profile(john),genesis:profile(genesis),johnParts:[p1,p2,p3],claimFullOrdinal:2704,independentFullOrdinal:2709,delta:5},null,2));
console.log("PASS | Greek milui using explicit 24 Greek letter names: John 22100, LXX Genesis 21190, opening 7033, remainder 15067, and ordinal mismatch 2709 vs claimed 2704.");
