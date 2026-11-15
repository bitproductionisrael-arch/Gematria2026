"use strict";
const assert=require("node:assert/strict");
const L=[..."אבגדהוזחטיכלמנסעפצקרשת"],N=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const finals={ך:"כ",ם:"מ",ן:"נ",ף:"פ",ץ:"צ"};
const make=fn=>{let o={};L.forEach((c,i)=>o[c]=fn(i));for(const [f,b]of Object.entries(finals))o[f]=o[b];return o};
const regular=make(i=>N[i]),ordinal=make(i=>i+1),small=make(i=>i%9+1),zero1=make(i=>N[i]>=10&&N[i]%10===0?N[i]/10:N[i]);
const final={...regular,ך:500,ם:600,ן:700,ף:800,ץ:900},smallFinal={...small,ך:5,ם:6,ן:7,ף:8,ץ:9};
const atbash=make(i=>N[21-i]),atbashOrdinal=make(i=>22-i),albam=make(i=>N[(i+11)%22]),albamOrdinal=make(i=>(i+11)%22+1);
let a=0;const kidmi=make(i=>a+=N[i]),pi=make(i=>Number("1415926535897932384626"[i])),e=make(i=>Number("7182818284590452353602"[i]));
const maps={regular,ordinal,small,zero1,final,smallFinal,atbash,atbashOrdinal,albam,albamOrdinal,kidmi,pi,e};
const sum=ar=>ar.reduce((x,y)=>x+y,0);
function gem(text,method){
 const words=text.trim().split(/\s+/);
 const map=maps[({peratiOrdinal:"ordinal",weightedSmall:"small",weightedOrdinal:"ordinal",weightedRegular:"regular",position:"regular",ratzo:"regular",addsub:"regular",productSmall:"small",wordReduced:"small",milui:"regular"}[method]||method)];
 assert.ok(map,method);
 const vals=w=>[...w].map(c=>{assert.ok(map[c]!=null,c);return map[c]});
 if(method==="peratiOrdinal")return sum(words.map(w=>sum(vals(w).map(v=>v*v))));
 if(method.startsWith("weighted"))return sum(words.map(w=>w.length*sum(vals(w))));
 if(method==="position")return sum(words.map(w=>sum(vals(w).map((v,i)=>v*(i+1)))));
 if(method==="ratzo")return sum(words.map(w=>{let t=0;let p=vals(w).map(v=>t+=v);return sum(p)+sum(p.slice(0,-1))}));
 if(method==="addsub")return sum(words.map(w=>{let ar=vals(w),t=0;return sum(ar.map(v=>t+=v))+sum(ar.map((_,i)=>sum(ar.slice(i))))}));
 if(method==="productSmall")return [...words.join("")].reduce((x,c)=>x*small[c],1);
 if(method==="wordReduced")return sum(words.map(w=>{let t=sum(vals(w));return t?1+(t-1)%9:0}));
 if(method==="milui")return sum(words.map(w=>sum([...w].map(c=>{const spelled={כ:"כף",ח:"חית"}[c];assert.ok(spelled);return sum([...spelled].map(c=>regular[c]))}))));
 return sum(words.map(w=>sum(vals(w))));
}
const sources=[
 ["כח תחתון כח עליון",{regular:1086,zero1:141,atbashOrdinal:154,albamOrdinal:190,pi:81,smallFinal:73,weightedSmall:285,small:69,kidmi:4165,weightedOrdinal:726,weightedRegular:5262,e:45,albam:1612,ordinal:168,final:2386,ratzo:6818,wordReduced:15}],
 ["כח כח",{ordinal:38,small:20,kidmi:222,peratiOrdinal:370,milui:1036,position:72,ratzo:136,addsub:168,productSmall:256,atbashOrdinal:54,atbash:180,albamOrdinal:82,pi:26,e:14}],
 ["כח בראשית",{ordinal:95,small:23,position:4091,pi:37,e:27,productSmall:768,zero1:104}]
];
const multiplied=[
 [2,{ordinal:190,small:46,position:8182,pi:74,e:54,productSmall:1536,zero1:208,albam:1818}],
 [5,{small:115,pi:185,e:135,zero1:520,albam:4545,wordReduced:25,regular:4705,ordinal:475}]
];
let sourceCount=0;
for(const [phrase,values]of sources)for(const [method,expected]of Object.entries(values)){assert.equal(gem(phrase,method),expected,phrase+" / "+method);sourceCount++;}
for(const [factor,values]of multiplied)for(const [method,expected]of Object.entries(values)){assert.equal(factor*gem("כח בראשית",method),expected,factor+"× / "+method);sourceCount++;}
assert.equal(sourceCount,54);
const derived={
 "104=4×26":gem("כח בראשית","zero1")===104 && 104===4*26,
 "104×2=208":2*gem("כח בראשית","zero1")===208,
 "104×5=520":5*gem("כח בראשית","zero1")===520,
 "208+520=728":208+520===728,
 "728=28×26":728===28*26,
 "728=12³−10³":728===12**3-10**3,
 "728+160=888":728+160===888,
 "37×27=999":gem("כח בראשית","pi")*gem("כח בראשית","e")===999,
 "37+27=64":gem("כח בראשית","pi")+gem("כח בראשית","e")===64,
 "5×37=185":5*gem("כח בראשית","pi")===185,
 "peratiOrdinal half=185":gem("כח כח","peratiOrdinal")/2===185,
 "peratiOrdinal=משל":gem("כח כח","peratiOrdinal")===gem("משל","regular"),
 "37²−32²=160+185":37**2-32**2===160+185,
 "26+14=40":gem("כח כח","pi")+gem("כח כח","e")===40,
 "37+27=64 column":gem("כח בראשית","pi")+gem("כח בראשית","e")===64,
 "40+64=104":40+64===104,
 "11+13=24 differences":gem("כח בראשית","pi")-gem("כח כח","pi")+gem("כח בראשית","e")-gem("כח כח","e")===24,
 "full π=26+27+28":gem("כח תחתון כח עליון","pi")===26+27+28,
 "81+55=136":gem("כח תחתון כח עליון","pi")+55===136,
 "81+73=154":gem("כח תחתון כח עליון","atbashOrdinal")===81+73,
 "1086=2×543":gem("כח תחתון כח עליון","regular")===2*gem("אהיה אשר אהיה","regular"),
 "4165=8×20×26+5":gem("כח תחתון כח עליון","kidmi")===8*20*26+5,
 "168=addsub":gem("כח תחתון כח עליון","ordinal")===gem("כח כח","addsub"),
 "190=2×95":gem("כח תחתון כח עליון","albamOrdinal")===2*gem("כח בראשית","ordinal"),
 "190=10×19":190===10*gem("כח","ordinal"),
 "69=32+37":gem("כח תחתון כח עליון","small")===32+37,
 "26π+14e=40":gem("כח כח","pi")+gem("כח כח","e")===40,
 "256×4=1024":gem("כח כח","productSmall")*4===1024,
 "π/e + e/π difference":((37-26)+(27-14))===24
};
for(const [name,ok]of Object.entries(derived))assert.equal(ok,true,name);
assert.equal(Object.keys(derived).length,29);
console.log(JSON.stringify({status:"PASS",sourceValues:sourceCount,derivedChecks:Object.keys(derived).length,totalChecks:sourceCount+Object.keys(derived).length},null,2));
