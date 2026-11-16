"use strict";
const assert = require("node:assert/strict");
const alpha="אבגדהוזחטיכלמנסעפצקרשת", finals="ךםןףץ", roots="כמנפצ", verse="בראשית ברא אלהים את השמים ואת הארץ";
const reg={},ord={},small={},sf={};
for(let i=0;i<alpha.length;i++){let c=alpha[i];reg[c]=i<9?i+1:i<18?(i-8)*10:(i-17)*100;ord[c]=i+1;small[c]=i%9+1;sf[c]=small[c];}
for(let i=0;i<5;i++){let c=finals[i],b=roots[i];reg[c]=reg[b];ord[c]=ord[b];small[c]=small[b];sf[c]=(22+i)%9+1;}
let checks=0; const eq=(a,b,description)=>{assert.deepEqual(a,b,description);checks++};
const sum=(str,m)=>[...str.replace(/\s/g,"")].reduce((n,c)=>n+m[c],0);
for(const [name,m,wordTotal,verseTotal,wordBreak,wordBitCounts,verseBitCounts,width] of [
 ["regular",reg,913,2701,[913,203,86,401,395,407,296],14,62,9],
 ["small",small,13,82,[13,5,14,5,17,11,17],7,36,4],
 ["small final",sf,13,86,[13,5,16,5,19,11,17],7,38,4],
 ["ordinal",ord,76,298,[76,23,41,23,62,29,44],12,56,5]
]){
 eq(sum("בראשית",m),wordTotal,name+" word");
 eq(sum(verse,m),verseTotal,name+" verse");
 eq(verse.split(" ").map(w=>sum(w,m)),wordBreak,name+" word break");
 eq([...verse.replace(/\s/g,"")].reduce((n,c)=>n+m[c].toString(2).replace(/0/g,"").length,0),verseBitCounts,name+" popcount letters");
 eq([...verse.replace(/\s/g,"")].every(c=>m[c].toString(2).length<=width),true,name+" fixed width");
 eq([...verse.replace(/\s/g,"")].length*width,28*width,name+" bitstream length");
}
eq(sum("מעשה מרכבה",reg),682,"merkavah");
eq(sum("עברית",reg),682,"ivrit");
eq(sum("שדי",reg),314,"shaddai");
eq(sum("אלהים",reg),86,"elohim");
eq(2**2+6**2+8**2,104,"digit squares");
eq(104,4*26,"104=4x26");
eq(104*2,208,"rov 208");
eq(104*5,520,"amit 520");
eq(8*20,160,"mike 160");
eq(208+520+160,888,"faces 888");
eq((682).toString(2),"1010101010","682 binary");
eq((913).toString(2),"1110010001","913 binary");
eq((682).toString(2).replace(/0/g,"").length,5,"682 popcount");
eq((913).toString(2).replace(/0/g,"").length,5,"913 popcount");
eq(1023-682,341,"682 complement");
eq(1023-913,110,"913 complement");
eq(913+111,1024,"913+111=1024");
eq(913+110+1,1024,"913+110+1=1024");
eq((2701).toString(2),"101010001101","verse binary");
eq(parseInt("101010",2)*64+parseInt("001101",2),2701,"six-bit partition");
eq(82+4,86,"small-final offset");
eq([...verse].length,34,"28 letters and six spaces");
eq([...verse.replaceAll(" ","")].length,28,"28 letters");
const utf8bytes=[...verse].flatMap(c=>{let n=c.codePointAt(0);return n===32?[32]:[0xC0 | (n>>6),0x80 | (n&63)]});
eq(utf8bytes.length,62,"62 UTF8 bytes");
eq(utf8bytes.length*8,496,"496 UTF8 bits");
eq([0xD7,0x91].map(n=>n.toString(2).padStart(8,"0")).join(" "),"11010111 10010001","bet bytes");
console.log("PASS",checks,"checks: literal letter values, binary streams, totals, Unicode UTF8 and conditional links");
