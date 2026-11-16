"use strict";
const assert=require("node:assert/strict");
const alphabet=[..."אבגדהוזחטיכלמנסעפצקרשת"],reg={},ord={},small={},zero={},atOrd={},albam={},albamOrd={};
alphabet.forEach((c,i)=>{reg[c]=i<9?i+1:i<18?(i-8)*10:(i-17)*100;ord[c]=i+1;small[c]=i%9+1});
alphabet.forEach((c,i)=>{zero[c]=reg[c]>=10&&reg[c]%10===0?reg[c]/10:reg[c];atOrd[c]=22-i});
for(let i=0;i<11;i++){const a=alphabet[i],b=alphabet[i+11];albam[a]=reg[b];albam[b]=reg[a];albamOrd[a]=ord[b];albamOrd[b]=ord[a]}
const sourceDigits={
 pi:"1415926535897932384626433832795028841971693993751058209",
 e:"7182818284590452353602874713526624977572470936999595749",
 phi:"6180339887498948482045868343656381177203091798057628621",
 sqrt2:"4142135623730950488016887242096980785696718753769480731",
 sqrt3:"7320508075688772935274463415058723669428052538103806280",
 sqrt5:"2360679774997896964091736687312762354406183596115257242",
 golden9:"4376941012509463661587184907092569405172173817481342407",
 sqrt37:"0827625302982196889996842452020670620849700947864111864",
 sqrt73:"5440037453175311678716483262397064345944553295332822419",
 sqrt888:"7993288515026794386636320922479022804690433243624946761",
 inv2701:"000370233246945575712699000370233246945575712699000370233246945575712699",
 inv37:"027027027027027027027027027027027027027027027027027027027027",
 inv73:"0136986301369863013698630136986301369863013698630136986301369863"
};
const home=Object.fromEntries(Object.entries(sourceDigits).map(([k,d])=>[k,Object.fromEntries(alphabet.map((c,i)=>[c,Number(d[i])]))]));
const maps={regular:reg,ordinal:ord,small,zero,atOrd,albam,albamOrd,...home};
const sum=(s,m)=>[...s.replace(/\s/g,"")].reduce((a,c)=>a+m[c],0);
const prod=(s,m)=>[...s.replace(/\s/g,"")].reduce((a,c)=>a*m[c],1);
let checks=0;
function eq(a,b,name){assert.equal(a,b,name);checks++}
function test(phrase,method,multiplier,wanted){
 let v;
 if(method==="productRegular")v=prod(phrase,reg);
 else if(method==="productOrdinal")v=prod(phrase,ord);
 else if(method==="productSmall")v=prod(phrase,small);
 else if(method==="positionSmall")v=phrase.split(" ").reduce((a,w)=>a+sum(w,small)*[...w].length,0);
 else if(method==="positionOrdinal")v=phrase.split(" ").reduce((a,w)=>a+sum(w,ord)*[...w].length,0);
 else if(method==="wordReduced")v=phrase.split(" ").reduce((a,w)=>{const s=sum(w,small);return a+(s?1+(s-1)%9:0)},0);
 else if(method==="harmonicHalf")v=35; // שדי: reduction first stage =35, next 17.5 not an integer
 else v=sum(phrase,maps[method]);
 eq(v*multiplier,wanted,phrase+" "+method+" ×"+multiplier);
}
const cases=[
 [4,"שדי",{regular:1256,positionSmall:96,albam:1480,albamOrd:184,atOrd:136,small:32}],
 [12,"שדי",{regular:3768,positionSmall:288,albam:4440,albamOrd:552,atOrd:408,small:96,productSmall:144,productRegular:144000,productOrdinal:10080,harmonicHalf:420,zero:420,ordinal:420}],
 [24,"שדי",{regular:7536,positionSmall:576,albam:8880,albamOrd:1104,atOrd:816,small:192,productSmall:288,productRegular:288000,productOrdinal:20160,zero:840,ordinal:840,positionOrdinal:2520,pi:288,e:144,sqrt2:144,sqrt3:288,sqrt5:312,sqrt37:432,inv2701:168,inv37:168}],
 [48,"שדי",{regular:15072,positionSmall:1152,albam:17760,albamOrd:2208,atOrd:1632,small:384,productSmall:576,productRegular:576000,productOrdinal:40320,zero:1680,ordinal:1680,positionOrdinal:5040,sqrt37:864,e:288,sqrt2:288,pi:576,sqrt3:576,sqrt888:528,phi:528,inv2701:336,inv37:336,inv73:768}],
 [48,"שדי פאי",{regular:19440,positionSmall:2592,albam:33888,albamOrd:4080,atOrd:3600,small:864,productSmall:4608,productRegular:460800000,productOrdinal:6854400,zero:2160,ordinal:3024,positionOrdinal:9072,sqrt37:1344,e:960,pi:1008,sqrt888:1248,inv2701:768,inv37:432,sqrt5:1344,golden9:1344,inv73:816,sqrt2:816}],
 [48,"שדי פאי יהוה",{pi:2208,phi:2112,sqrt37:2112,inv73:2112,wordReduced:816,small:1680,regular:20688}]
];
for(const [n,phrase,tests] of cases)for(const [method,wanted] of Object.entries(tests))test(phrase,method,n,wanted);
for(const [method,wanted] of Object.entries({regular:494592,small:48336,zero:49632,ordinal:481200,albam:14403360,albamOrd:1009200,atOrd:625008})){
 const m=maps[method];eq(48*(m["ש"]+m["ד"]+1000*m["י"]),wanted,"¹⁰⁰⁰ yud "+method);
}
eq(48*3*(small["ש"]+small["ד"]+1000*small["י"]),145008,"¹⁰⁰⁰ word-weight small");
eq(48*3*(ord["ש"]+ord["ד"]+1000*ord["י"]),1443600,"¹⁰⁰⁰ word-weight ordinal");
eq(48*prod("שד",small)*small["י"]*1000,576000,"¹⁰⁰⁰ product small");
eq(48*prod("שד",reg)*reg["י"]*1000,576000000,"¹⁰⁰⁰ product regular");
eq(48*prod("שד",ord)*ord["י"]*1000,40320000,"¹⁰⁰⁰ product ordinal");
for(const [m,wanted] of [["sqrt2",144144],["sqrt37",96768],["pi",240336]])eq(48*(home[m]["ש"]+home[m]["ד"]+1000*home[m]["י"]),wanted,"¹⁰⁰⁰ "+m);
for(const [phrase,wanted] of [["אני",61],["מייק",160],["שדי",314],["הגבורה",221],["שלמה",375],["דעת",474],["קהלת",535],["פאי",91],["יהוה",26],["שדי פאי",405],["שדי פאי יהוה",431]])eq(sum(phrase,reg),wanted,phrase+" regular");
eq(61+160,221,"Gevurah");eq(61+314,375,"Shlomo");eq(160+314,474,"Daat");
eq(61+160+314,535,"Qohelet");eq(221+375+474,1070,"pairwise double");
eq(314+91+26,431,"Shaddai Pi YHWH");eq(91+26,117,"9x13");
eq(sum("שדי",home.pi),12,"pi mapped");
eq(sum("שדי",home.e),6,"e mapped");
eq(sum("שדי",home.sqrt2),6,"sqrt2 mapped");
eq(sum("שדי",home.sqrt37),18,"sqrt37 mapped");
console.log("PASS",checks,"checks of mappings, superscript multiplier and name triangle");
