#!/usr/bin/env node
"use strict";
// Independent reproduction against literal Hebrew alphabet, filling and cipher maps
// in Gematria2026/calculator.html (17 Nov 2026); 5^3 surface exposure audit.
const assert=require("node:assert/strict");
const HE="אבגדהוזחטיכלמנסעפצקרשת";
const FINAL={"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"};
const ALFIN="ךםןףץ";
const NAMES_STD={א:"אלף",ב:"בית",ג:"גימל",ד:"דלת",ה:"הא",ו:"ויו",ז:"זין",ח:"חית",ט:"טית",י:"יוד",כ:"כף",ל:"למד",מ:"מם",נ:"נון",ס:"סמך",ע:"עין",פ:"פא",צ:"צדי",ק:"קוף",ר:"ריש",ש:"שין",ת:"תיו"};
const NAMES_MAYIM={...NAMES_STD,מ:"מים"};
const base=c=>FINAL[c]||c;
function v(c){const i=HE.indexOf(base(c));if(i<0)throw Error("not Hebrew: "+c);return i<9?i+1:i<18?(i-8)*10:(i-17)*100}
function finalValue(c){const i=ALFIN.indexOf(c);return i<0?v(c):500+i*100}
function symbols(s){return [...s].filter(c=>HE.includes(c)||c in FINAL)}
function filling(s,names,depth=1){
 let chars=symbols(s);
 for(let d=0;d<depth;d++)chars=chars.flatMap(c=>[...names[base(c)]]);
 return chars.reduce((sum,c)=>sum+v(c),0);
}
function avgad(s){return symbols(s).reduce((sum,c)=>sum+v(HE[(HE.indexOf(base(c))+1)%22]),0)}
const chambers=Array.from({length:9},(_,i)=>[HE[i],HE[i+9],i<4?HE[i+18]:ALFIN[i-4]]);
function ayak(s){
 return symbols(s).reduce((sum,c)=>{
  const ch=chambers.find(a=>a.includes(c));
  const mate=ch[(ch.indexOf(c)+1)%3];
  return sum+finalValue(mate);
 },0);
}
assert.equal(filling("מפץ גדול",NAMES_MAYIM),888);
assert.deepEqual(symbols("מפץ גדול").map(c=>filling(c,NAMES_MAYIM)),[90,81,104,83,434,22,74]);
assert.equal(filling("מפץ גדול",NAMES_STD),878);
assert.equal(avgad("מפץ גדול"),296);
assert.equal(ayak("מפץ גדול"),1639);
assert.equal(filling("עמר עליון",NAMES_STD),1072);
assert.equal(filling("עמר תחתון",NAMES_STD),2098);
assert.equal(filling("עמר",NAMES_STD,2),1306);
const pi22="1415926535897932384626";
const piMap=Object.fromEntries([...HE].map((c,i)=>[c,Number(pi22[i])]));
function piAlpha(s){return symbols(s).reduce((s,c)=>s+piMap[base(c)],0)}
assert.equal(piAlpha("מפת שפע"),23);
assert.equal(piAlpha("מפת שפע יודהאויוהא"),64);
function profile(n){
 let histogram=[0,0,0,0];
 for(let x=0;x<n;x++)for(let y=0;y<n;y++)for(let z=0;z<n;z++){
  const count=[x,y,z].filter(v=>v===0||v===n-1).length;
  histogram[count]++;
 }
 const [core,face,edge,corner]=histogram;
 const thresholds=[corner,corner+edge,corner+edge+face];
 const exposed=corner*3+edge*2+face;
 const e2=thresholds[0]*thresholds[1]+thresholds[0]*thresholds[2]+thresholds[1]*thresholds[2];
 assert.deepEqual(histogram,[(n-2)**3,6*(n-2)**2,12*(n-2),8]);
 assert.deepEqual(thresholds,[8,12*n-16,6*n*n-12*n+8]);
 assert.equal(exposed,6*n*n);
 assert.equal(e2,24*(3*n**3-8*n*n+12*n-8));
 return {n,volume:n**3,core,face,edge,corner,thresholds,exposed,e2};
}
const profiles=Array.from({length:9},(_,i)=>profile(i+2));
assert.deepEqual(profiles.find(p=>p.n===3).thresholds,[8,20,26]);
assert.equal(profiles.find(p=>p.n===3).e2,888);
assert.deepEqual(profiles.find(p=>p.n===4).thresholds,[8,32,56]);
assert.equal(profiles.find(p=>p.n===4).e2,2496);
assert.deepEqual(profiles.find(p=>p.n===5),{n:5,volume:125,core:27,face:54,edge:36,corner:8,thresholds:[8,44,98],exposed:150,e2:5448});
assert.equal(5**3-3**3,98);
assert.equal(5**3-4**3,61);
assert.equal(4**3-3**3,37);
assert.equal(61+37,98);
assert.equal(1+26+37+61,125);
assert.equal(profiles.filter(p=>p.e2===888).length,1);
const expectedRows=[
 [2,8,8,8,192],[3,8,20,26,888],[4,8,32,56,2496],
 [5,8,44,98,5448],[6,8,56,152,10176],[7,8,68,218,17112],
 [8,8,80,296,26688],[9,8,92,386,39336],[10,8,104,488,55488],
];
assert.deepEqual(profiles.map(p=>[p.n,...p.thresholds,p.e2]),expectedRows);
assert.equal(profiles.find(p=>p.n===6).volume,216);
assert.equal(profiles.find(p=>p.n===6).exposed,216);
assert.equal(profiles.filter(p=>p.exposed===p.volume).map(p=>p.n).join(","),"6");
assert.equal(profiles.find(p=>p.n===8).thresholds[2],296);
assert.equal(profiles.find(p=>p.n===8).core,216);
assert.equal(profiles.find(p=>p.n===10).core,512);
assert.equal(profiles.find(p=>p.n===10).thresholds[2],488);
assert.equal(10**3,8**3+488);
assert.equal(2*8**3-10**3,24);

// General exact correspondence: filled six-pointed star S(n)=2*increment of cubes-1.
const tri=k=>k*(k+1)/2;
const delta=n=>n**3-(n-1)**3;
const star=n=>6*n*(n-1)+1;
for(let n=1;n<=100;n++){
 assert.equal(delta(n),1+6*tri(n-1));
 assert.equal(star(n),1+12*tri(n-1));
 assert.equal(star(n),2*delta(n)-1);
 if(n<100){assert.equal(delta(n+1)-delta(n),6*n);assert.equal(star(n+1)-star(n),12*n)}
}
assert.deepEqual([1,2,3,4,5].map(delta),[1,7,19,37,61]);
assert.equal(delta(4),star(3)); // unique positive coincidence for S(n)=delta(n+1)
assert.equal(star(4),73);
assert.equal(star(5),121);
assert.equal(star(5)-star(4),48);
assert.equal(delta(5)-delta(4),24);
assert.equal(delta(4)*star(4),2701);
assert.equal([1,2,3,4,5,6,7,8,9,10].filter(n=>star(n)===delta(n+1)).join(","),"3");
console.log("PASS | Milui Mayim 888, AVGaD 296, AYAK 1639, OMR fillings 1072/2098/1306, π alphabet 23/64, all n=2..10 cube exposure, 5^3 125/98/61/37; S(n)=2 delta(n)-1; 37*73=2701; 24->48.");
