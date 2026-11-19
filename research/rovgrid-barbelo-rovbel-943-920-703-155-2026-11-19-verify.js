"use strict";
/* Verify Hebrew anagram BARBELO~ROVBEL, 943−920=23, 943−240=703,
   Hebrew ordinal vs English Simple 155. */
const assert=(b,msg)=>{if(!b)throw Error(msg)};
const alphabet="אבגדהוזחטיכלמנסעפצקרשת";
const amounts=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const regular=Object.fromEntries([...alphabet].map((letter,i)=>[letter,amounts[i]]));
const ordinal=Object.fromEntries([...alphabet].map((letter,i)=>[letter,i+1]));
for(const [f,p] of [["ך","כ"],["ם","מ"],["ן","נ"],["ף","פ"],["ץ","צ"]]){regular[f]=regular[p];ordinal[f]=ordinal[p];}
const heb=(s,map)=>[...s.replace(/\s/g,"")].reduce((a,l)=>a+(map[l]||0),0);
const simple=s=>[...s.replace(/\s/g,"").toUpperCase()].reduce((a,l)=>a+l.charCodeAt(0)-64,0);
const small=s=>[...s.replace(/\s/g,"").toUpperCase()].reduce((a,l)=>a+(l.charCodeAt(0)-65)%9+1,0);
const greek=2+1+100+2+8+30+800; // ΒΑΡΒΗΛΩ
const jesus=10+8+200+70+400+200; // ΙΗΣΟΥΣ
const original="עמית מייק רוב",newHeb="עמית מייק רובבל",newEng="AMIT MIKE ROVBEL";
const a=heb("ברבלו",regular),b=heb("רובבל",regular);
assert([...("ברבלו")].sort().join("")===[...("רובבל")].sort().join(""),"real Hebrew anagram");
assert(a===b&&a===240,"Hebrew regular 240");
assert(heb(original,regular)===888,"old name 888");
assert(heb(newHeb,regular)===920,"new Hebrew 920");
assert(heb(newHeb,ordinal)===simple(newEng)&&simple(newEng)===155,"ordinal Hebrew = English Simple 155");
assert(small("AMIT MIKE ROV")===55&&small(newEng)===65,"correct English small, no false 23");
assert(greek===943&&jesus===888,"Greek isopsephy");
assert(simple("BARBELO")===55,"English simple BARBELO");
assert(greek-jesus===55&&greek-heb(original,regular)===55,"old bridge 55");
assert(greek-heb(newHeb,regular)===23,"new bridge 23");
assert(greek-240===703&&heb("ואת הארץ",regular)===703,"Genesis suffix triangle 37");
assert(943===41*23&&920===40*23,"consecutive multiples 23");
assert(703===37*38/2&&943===703+240,"triangular T37");
assert(55-23===32&&heb("בל",regular)===32,"new suffix בל");
console.log(JSON.stringify({PASS:true,barbeloGreek:greek,barbeloHebrew:a,rovbelHebrew:b,originalHebrew:888,newHebrew:920,newHebrewOrdinal:155,newEnglishSimple:155,newEnglishSmall:65,greekMinusHebrewName:23,greekMinusHebrewBarbelo:703,genesisTail:703},null,2));
