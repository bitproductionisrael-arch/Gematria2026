"use strict";
// 19 November 2026. Transcribed from Frederik Wisse's composite
// Apocryphon of John, anatomical list, NHC II 15:29–17:8,
// 72 slots including 2 manuscript lacunae and a final incomplete entry.
// This checks counts and arithmetic; NOT historical intentionality.
const assert=(p,m)=>{if(!p) throw new Error("FAIL: "+m)};
const body72=[
  "Eteraphaope-Abron",
  "Meniggesstroeth",
  "Asterechme",
  "Thaspomocha",
  "Yeronumos",
  "Bissoum",
  "Akioreim",
  "Banen-Ephroum",
  "Amen",
  "Ibikan",
  "Basiliademe",
  "Achcha",
  "Adaban",
  "Chaaman",
  "Dearcho",
  "Tebar",
  "[lacuna]",
  "Mniarcon",
  "[lacuna]",
  "Abitrion",
  "Evanthen",
  "Krys",
  "Beluai",
  "Treneu",
  "Balbel",
  "Kriman",
  "Astrops",
  "Barroph",
  "Baoum",
  "Ararim",
  "Areche",
  "Phthave",
  "Senaphim",
  "Arachethopi",
  "Zabedo",
  "Barias",
  "Phnouth",
  "Abenlenarchei",
  "Chnoumeninorin",
  "Gesole",
  "Agromauna",
  "Bano",
  "Sostrapal",
  "Anesimalar",
  "Thopithro",
  "Biblo",
  "Roeror",
  "Taphreo",
  "Ipouspoboba",
  "Bineborin",
  "Atoimenpsephei",
  "Entholleia",
  "Bedouk",
  "Arabeei",
  "Eilo",
  "Sorma",
  "Gorma-Kaiochlabar",
  "Nebrith",
  "Pserem",
  "Asaklas",
  "Ormaoth",
  "Emenun",
  "Knyx",
  "Tupelon",
  "Achiel",
  "Phnene",
  "Phiouthrom",
  "Boabel",
  "Trachoun",
  "Phikna",
  "Miamai",
  "Labernioum"
];
const body30=[
  "Diolimodraza",
  "Yammeax",
  "Yakouib",
  "Verton",
  "Oudidi",
  "Arbao",
  "Lampno",
  "Leekaphar",
  "Barbar",
  "Imae",
  "Pisandriaptes",
  "Koade",
  "Odeor",
  "Asphixix",
  "Synogchouta",
  "Arouph",
  "Sabalo",
  "Charcharb",
  "Chthaon",
  "Bathinoth",
  "Choux",
  "Charcha",
  "Aroer",
  "Toechtha",
  "Aol",
  "Charaner",
  "Bastan",
  "Archentechtha",
  "Marephnounth",
  "Abrana"
];
assert(body72.length===72 && body72.filter(x=>x==="[lacuna]").length===2,"72 anatomical slots, two lacunae");
assert(body30.length===30,"30 secondary anatomical powers");
assert(body72[8]==="Amen" && body72[24]==="Balbel","anatomical names positions 9 and 25");
assert(body72.includes("Agromauna") && body72.includes("Taphreo"),"heart and spine present");
const hebLetters="אבגדהוזחטיכלמנסעפצקרשת";
const hebVals=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const H=Object.fromEntries([...hebLetters].map((c,i)=>[c,hebVals[i]]));
for(const [c,p] of [["ך","כ"],["ם","מ"],["ן","נ"],["ף","פ"],["ץ","צ"]])H[c]=H[p];
const heb=s=>[...s.replace(/\s/g,"")].reduce((v,c)=>v+(H[c]||0),0);
const simple=s=>[...s.toUpperCase().replace(/[^A-Z]/g,"")].reduce((v,c)=>v+c.charCodeAt(0)-64,0);
for(const [word,val] of Object.entries({"אדם":45,"חוה":19,"אלי":41,"חיה":23,"חי":18,"יהוה":26,"אהיה":21,"לב":32,"בל":32,"מייק":160,"חכמה":73}))assert(heb(word)===val,word);
assert(heb("אדם")+heb("חוה")===64&&heb("אלי")+heb("חיה")===64,"paired Genesis/family conservation = 64");
assert(heb("אדם")-heb("חוה")===26&&heb("אלי")-heb("חיה")===18,"pair differences =26 and18");
assert((heb("אדם")-heb("אלי"))===4 && (heb("חיה")-heb("חוה"))===4,"balanced 4-step");
assert(heb("חיה")*heb("אלי")===943,"Haya times Eli = Barbelo Greek 943");
assert(heb("מייק")-heb("חיה")===137,"Mike minus Haya = 137");
assert((heb("חיה")+heb("חוה"))/2===heb("אהיה"),"Haya Eve midpoint 21");
for(const [s,v] of Object.entries({"AMEN":33,"BALBEL":34,"BARBELO":55,"MICHAEL":51,"MIKE":38,"ADAM":19,"EVE":32}))assert(simple(s)===v,"English Simple "+s);
assert(simple("BARBELO")-simple("BALBEL")===heb("אהיה"),"Barbelo-Balbel 21");
assert(simple("MICHAEL")-simple("MIKE")===heb("אחד"),"Michael-Mike 13");
const BARBELO_GREEK=2+1+100+2+8+30+800; // ΒΑΡΒΗΛΩ
const SOPHIA_GREEK=200+70+500+10+1; // ΣΟΦΙΑ
assert(BARBELO_GREEK===943&&SOPHIA_GREEK===781,"same Greek isopsephy");
assert(BARBELO_GREEK-SOPHIA_GREEK===3*6*9,"Barbelo-Sophia=162");
assert(3*6*9===heb("קול")+heb("יהוה"),"162=136+26");
assert(72*5===360 && 360+5===365 && 365===5*73,"72 pentads, 360+5 calendar, 5*73");
assert(36+1===37 && 72+1===73 && 37*73===2701,"decans, half decans, added centers 2701");
assert(2701-365===32*73,"Genesis difference from 365 = 32*73");
assert(4*3===12 && 7+5===12 && 4+12===16,"upper/lower 12 and tesseract 16");
assert(3**2+4**2===5**2,"3-4-5 arithmetic motif");
console.log(JSON.stringify({PASS:true,anatomicalSlots:body72.length,readable72:70,lacunae:2,secondAnatomicalLayer:body30.length,pairedSums:64,BarbeloGreekProduct:943,names:{AMEN:33,BALBEL:34,MICHAEL:51,MIKE:38},circle:{halfDecans:72,days:365,Genesis:2701,delta:2336}},null,2));
