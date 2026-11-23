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


function reducedDigit(n) {return n>0 ? 1+(n-1)%9 : 0;}
function peratiOrdinal(s) {return hLetters(s).reduce((acc,c)=>acc+(alphabet.indexOf(c)+1)**2,0);}
function ordinalSmall(s) {return hLetters(s).reduce((acc,c)=>acc+Number(String(hval[alphabet.indexOf(c)])[0]),0);}
const miluiV0={א:"Alf",ל:"Lmd",י:"Yod",ה:"Hey",ו:"Vav",ת:"Tav",ש:"Sin",ב:"Bet"};
const miluiSimple=s=>hLetters(s).reduce((acc,c)=>acc+e(miluiV0[c]),0);
[
 ["Elijah ordinal",hOrdinal("אליהו"),34],
 ["Tishbite ordinal",hOrdinal("התשבי"),60],
 ["Elijah atbash ordinal",5*23-hOrdinal("אליהו"),81],
 ["Tishbite atbash ordinal",5*23-hOrdinal("התשבי"),55],
 ["Elijah Tishbite atbash ordinal",10*23-hOrdinal("אליהו התשבי"),136],
 ["Elijah ordinal squares",peratiOrdinal("אליהו"),306],
 ["Tishbite ordinal squares",peratiOrdinal("התשבי"),1054],
 ["Elijah Tishbite ordinal squares",peratiOrdinal("אליהו התשבי"),1360],
 ["square vs atbash",peratiOrdinal("אליהו התשבי"),10*(230-94)],
 ["Elijah regular",h("אליהו"),52],
 ["Tishbite regular",h("התשבי"),717],
 ["Elijah Tishbite regular",h("אליהו התשבי"),769],
 ["Elijah small",ordinalSmall("אליהו"),16],
 ["Tishbite small",ordinalSmall("התשבי"),15],
 ["Elijah Tishbite small",ordinalSmall("אליהו התשבי"),31],
 ["Elijah Tishbite word reductions",reducedDigit(h("אליהו"))+reducedDigit(h("התשבי")),13],
 ["Elijah regular atbash",hAtbash("אליהו"),630],
 ["Tishbite regular atbash",hAtbash("התשבי"),433],
 ["Elijah Tishbite regular atbash",hAtbash("אליהו התשבי"),1063],
 ["Latin milui Elijah",miluiSimple("אליהו"),175],
 ["Latin milui Tishbite",miluiSimple("התשבי"),194],
 ["Latin milui full",miluiSimple("אליהו התשבי"),369],
 ["Hebrew צדק",h("צדק"),194],
 ["Atbash and latin 888",hAtbash("אליהו התשבי")-miluiSimple("אליהו"),888],
 ["atbash vs squares modulo 99",(1360-1063)/99,3],
 ["modulo 99 residue",1063%99,73]
].forEach(([label,actual,expected])=>check(label,actual,expected));


check("Elijah to Markov Fibonacci 233",miluiSimple("אליהו התשבי")-(10*23-hOrdinal("אליהו התשבי")),233);
check("Markov Vieta 233",3*1*89-34,233);
check("Markov 1 89 233",1**2+89**2+233**2,3*1*89*233);

const standardFill={א:"אלף",ל:"למד",י:"יוד",ה:"הא",ו:"ויו",נ:"נון",ב:"בית"};
const prophetFill=(s,ordinal=false)=>hLetters(s).reduce((a,c)=>a+(ordinal?hOrdinal(standardFill[c]):h(standardFill[c])),0);
const englishReduced=s=>[...s.toUpperCase()].reduce((a,c)=>a+((c.charCodeAt(0)-65)%9+1),0);
const prophetLatin={...miluiV0,נ:"Nun"};
const prophetReduced=s=>hLetters(s).reduce((a,c)=>a+englishReduced(prophetLatin[c]),0);
function wordsPartsSum(s,fn) {return s.trim().split(/\s+/).reduce((a,w)=>a+fn(w),0)}
[
 ["Prophet ordinary",h("אליהו הנביא"),120],
 ["Prophet ordinal",hOrdinal("אליהו הנביא"),66],
 ["Prophet fill Elijah",prophetFill("אליהו"),233],
 ["Prophet fill Hanavi",prophetFill("הנביא"),655],
 ["Prophet fill 888",prophetFill("אליהו הנביא"),888],
 ["Prophet fill ordinal Elijah",prophetFill("אליהו",true),107],
 ["Prophet fill ordinal Hanavi",prophetFill("הנביא",true),124],
 ["Prophet fill ordinal 231",prophetFill("אליהו הנביא",true),231],
 ["Prophet reduced Elijah 67",prophetReduced("אליהו"),67],
 ["Prophet reduced Hanavi 69",prophetReduced("הנביא"),69],
 ["Prophet reduced 136",prophetReduced("אליהו הנביא"),136],
 ["Prophet 888+136",prophetFill("אליהו הנביא")+prophetReduced("אליהו הנביא"),1024],
 ["Prophet 330 word weighting",wordsPartsSum("אליהו הנביא",w=>w.length*hOrdinal(w)),330],
 ["Prophet 360 balance",wordsPartsSum("אליהו הנביא",w=>(w.length+1)/2*h(w)),360],
 ["Prophet 720 addition subtraction",wordsPartsSum("אליהו הנביא",w=>(w.length+1)*h(w)),720],
 ["Prophet Malachi literal fill",prophetFill("אליה הנביא"),866],
 ["Prophet Malachi literal reduced",prophetReduced("אליה הנביא"),127],
 ["Prophet 68 midpoint",prophetReduced("אליהו")+prophetReduced("הנביא"),2*68],
 ["Prophet 233 recurrence",prophetFill("אליהו"),3*89-34],
 ["Prophet 5 factorial",h("אליהו הנביא"),120],
 ["Prophet 6 factorial",6*h("אליהו הנביא"),720]
].forEach(([label,actual,expected])=>check(label,actual,expected));


function hAlbam(s){return hLetters(s).reduce((z,c)=>z+hval[(alphabet.indexOf(c)+11)%22],0);}
function hAlbamOrdinal(s){return hLetters(s).reduce((z,c)=>z+(alphabet.indexOf(c)+11)%22+1,0);}
function hAtbashOrdinal(s){return hLetters(s).reduce((z,c)=>z+22-alphabet.indexOf(c),0);}
function hSmall(s){return hLetters(s).reduce((z,c)=>z+Number(String(hval[alphabet.indexOf(c)])[0]),0);}
function smallWordWeighted(s){return s.split(/\s+/).reduce((z,w)=>z+w.length*hSmall(w),0);}
const still="דממה דקה",fullVoice="קול דממה דקה";
[
 ["Still regular",h(still),198],
 ["Still ordinal",hOrdinal(still),63],
 ["Still atbash",hAtbash(still),404],
 ["Still atbash ordinal",hAtbashOrdinal(still),98],
 ["Still small times word length",smallWordWeighted(still),98],
 ["Still albam",hAlbam(still),272],
 ["Still albam ordinal",hAlbamOrdinal(still),74],
 ["Still perati ordinal",peratiOrdinal(still),781],
 ["Still 26 squared",hAtbash(still)+hAlbam(still),26**2],
 ["Still 888",(hAtbashOrdinal(still)-hAlbamOrdinal(still))*(hAlbamOrdinal(still)/2),888],
 ["Still 136",hAlbam(still)/2,136],
 ["Still 1024",(hAtbashOrdinal(still)-hAlbamOrdinal(still))*(hAlbamOrdinal(still)/2)+hAlbam(still)/2,1024],
 ["Still base6 404=>148",parseInt("404",6),148],
 ["Still base6 4040=>888",parseInt("4040",6),888],
 ["Still ladder P4",4*4**3+4*4,272],
 ["Still ladder P5",4*5**3+4*5,520],
 ["Still ladder P6",4*6**3+4*6,888],
 ["Daka atbash is צדק",hAtbash("דקה"),h("צדק")],
 ["Voice kol ordinal",hOrdinal("קול"),37],
 ["Voice kol regular",h("קול"),136],
 ["Voice kol perati",peratiOrdinal("קול"),541],
 ["Voice kol albam",hAlbam("קול"),89],
 ["Voice kol albam ordinal",hAlbamOrdinal("קול"),26],
 ["Voice silence regular",h("דממה"),89],
 ["Full voice letter count",hLetters(fullVoice).length,10],
 ["Full voice regular",h(fullVoice),334],
 ["Full voice ordinal",hOrdinal(fullVoice),100],
 ["Full voice atbash",hAtbash(fullVoice),508],
 ["Full voice atbash ordinal",hAtbashOrdinal(fullVoice),130],
 ["Full voice albam",hAlbam(fullVoice),361],
 ["Full voice albam ordinal",hAlbamOrdinal(fullVoice),100],
 ["Full voice ordinal perati",peratiOrdinal(fullVoice),1322],
 ["Full voice albam square",hAlbam(fullVoice),19**2],
 ["Full voice ordinal square",hOrdinal(fullVoice),10**2],
 ["Full voice albam ordinal square",hAlbamOrdinal(fullVoice),10**2],
 ["Still 98-74",hAtbashOrdinal(still)-hAlbamOrdinal(still),24],
 ["Still 74/2",hAlbamOrdinal(still)/2,37],
 ["Still 404 as palindrome",Number(String(hAtbash(still)).split("").reverse().join("")),404]
].forEach(([label,actual,expected])=>check(label,actual,expected));

console.log("OK: "+tests+" deterministic checks passed");