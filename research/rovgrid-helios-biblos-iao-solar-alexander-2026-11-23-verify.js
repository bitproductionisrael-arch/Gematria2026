// RovGrid 2026-11-23: Hebrew/English/Greek reproducible checks.
// Run: node research/rovgrid-helios-biblos-iao-solar-alexander-2026-11-23-verify.js
"use strict";
const alphabet = "אבגדהוזחטיכלמנסעפצקרשת";
const hval = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const finals = {ך:"כ",ם:"מ",ן:"נ",ף:"פ",ץ:"צ"};
function hLetters(s) {
  return [...s.normalize("NFD").replace(/[\u0591-\u05C7]/g,"")]
    .map(c=>finals[c]||c).filter(c=>alphabet.includes(c));
}
function h(s) {return hLetters(s).reduce((v,c)=>v+hval[alphabet.indexOf(c)],0);}
function hOrdinal(s) {return hLetters(s).reduce((v,c)=>v+alphabet.indexOf(c)+1,0);}
function hAtbash(s) {return hLetters(s).reduce((v,c)=>v+hval[21-alphabet.indexOf(c)],0);}
function hKidmi(s) {return hLetters(s).reduce((v,c)=>v+hval.slice(0,alphabet.indexOf(c)+1).reduce((a,b)=>a+b,0),0);}
function e(s) {return [...s.toUpperCase()].filter(c=>/^[A-Z]$/.test(c)).reduce((v,c)=>v+c.charCodeAt(0)-64,0);}
function eAtbash(s) {return [...s.toUpperCase()].filter(c=>/^[A-Z]$/.test(c)).reduce((v,c)=>v+91-c.charCodeAt(0),0);}
const gVal={Α:1,Β:2,Γ:3,Δ:4,Ε:5,Ϛ:6,Ζ:7,Η:8,Θ:9,Ι:10,Κ:20,Λ:30,Μ:40,Ν:50,Ξ:60,Ο:70,Π:80,Ϟ:90,Ρ:100,Σ:200,Τ:300,Υ:400,Φ:500,Χ:600,Ψ:700,Ω:800,Ϡ:900};
function g(s){return [...s.toUpperCase().normalize("NFD").replace(/\p{M}/gu,"")].reduce((v,c)=>v+(gVal[c]||0),0);}
let tests=0;
function check(label,actual,expected) {
  tests++;
  if(actual!==expected) throw new Error(label+": expected "+expected+", got "+actual);
}
const H=[
 ["הליוס",111],["היליוס",121],["ביבלוס",110],["ביבליוס",120],
 ["הליוס ביבלוס",221],["הליוס ביבליוס",231],["הגבורה",221],["פלא",111],
 ["חסדים גלויים",221],["חסדים גלוים",211],
 ["יחס הזהב",97],["האלוהים",97],["האלהים",91],["פי שמש",730],
 ["מערכת",730],["הסיפור של השמש",1336],["עמית מייק רוב",888],
 ["עמית מייק רוב הסיפור של השמש",2224]
];
for(const [word,expected] of H)check("Hebrew "+word,h(word),expected);
check("Kidmi חסדים גלויים",hKidmi("חסדים גלויים"),888);
check("Kidmi חסדים גלוים",hKidmi("חסדים גלוים"),833);
check("Atbash האלוהים",hAtbash("האלוהים"),730);
check("Atbash הסיפור של השמש",hAtbash("הסיפור של השמש"),353);
check("Atbash עמית מייק רוב",hAtbash("עמית מייק רוב"),535);
check("Atbash joined",hAtbash("עמית מייק רוב הסיפור של השמש"),888);
check("Ordinal joined",hOrdinal("עמית מייק רוב הסיפור של השמש"),307);
check("English HELIOS",e("HELIOS"),68);
check("English BIBLIOS",e("BIBLIOS"),68);
check("English HE",e("HE"),13);
check("English BIB",e("BIB"),13);
check("English LIOS",e("LIOS"),55);
check("English IAO",e("IAO"),25);
check("English IAO Atbash",eAtbash("IAO"),56);
check("English GOD Atbash",eAtbash("GOD"),55);
check("Greek ΗΛΙΟΣ",g("ΗΛΙΟΣ"),318);
check("Greek ΒΙΒΛΟΣ",g("ΒΙΒΛΟΣ"),314);
check("Greek ΒΙΒΛΙΟΣ",g("ΒΙΒΛΙΟΣ"),324);
check("Greek ΙΑΟ",g("ΙΑΟ"),81);
check("Greek ΙΑΩ",g("ΙΑΩ"),811);
check("centered square 221",11**2+10**2,221);
check("triangular 231",21*22/2,231);
check("triangular 136",16*17/2,136);
check("Markov 1 5 13",1**2+5**2+13**2,3*1*5*13);
check("Vieta partner",3*1*13-5,34);
check("cuboid face products",8*20+8*26+20*26,888);
check("reverse 841",Number(String(29**2).split("").reverse().join("")),148);

function hAtbashWord(s) {
  return hLetters(s).map(c=>alphabet[21-alphabet.indexOf(c)]).join("");
}
[
  ["Atbash הנני", hAtbash("הנני"), 148],
  ["Atbash שלח", hAtbash("שלח"), 82],
  ["Atbash מלאכי", hAtbash("מלאכי"), 500],
  ["Atbash מלאכי 3:1 opening", hAtbash("הנני שלח מלאכי"), 730],
  ["Hebrew יראי 3:20", h("יראי"), 221],
  ["Atbash יראי שמי 3:20", hAtbash("יראי שמי"), 535],
  ["Ordinal ושבתם 3:18", hOrdinal("ושבתם"), 64],
  ["Ordinal וראיתם 3:18", hOrdinal("וראיתם"), 72],
  ["Ordinal ושבתם וראיתם", hOrdinal("ושבתם וראיתם"), 136],
  ["Ordinal שמש", hOrdinal("שמש"), 55],
  ["Atbash ספר", hAtbash("ספר"), 17],
  ["Atbash שמש", hAtbash("שמש"), 14],
  ["Atbash צדקה", hAtbash("צדקה"), 199],
  ["Hebrew צדקה", h("צדקה"), 199],
  ["Hebrew לב אבות", h("לב אבות"), 441],
  ["Hebrew אמת", h("אמת"), 441],
  ["Atbash ספר gives חוג", hAtbashWord("ספר"), "חוג"],
  ["Atbash שמש gives ביב", hAtbashWord("שמש"), "ביב"],
  ["Atbash צדקה reverses it", hAtbashWord("צדקה"), [..."צדקה"].reverse().join("")],
  ["Reversal שמש", [..."שמש"].reverse().join(""), "שמש"],
].forEach(([label,actual,expected])=>check(label,actual,expected));

console.log("OK: "+tests+" deterministic checks passed");