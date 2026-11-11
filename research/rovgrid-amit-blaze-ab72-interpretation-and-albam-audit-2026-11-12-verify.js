#!/usr/bin/env node
"use strict";
/** RovGrid reproducible Hebrew ALBaM-Ordinal audit, 12 Nov 2026.
 *  Includes textual verification, 48-path invariance and calculator source smoke test.
 *  No external dependencies or network activity.
 *  Run: node research/rovgrid-amit-blaze-ab72-interpretation-and-albam-audit-2026-11-12-verify.js
 */
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const SOURCE=[
  "ויסעמלאכהאלהימההלכלפנימחנהישראלוילכמאחריהמויסעעמודהעננמפניהמויעמדמאחריהמ",
  "ויבאבינמחנהמצרימובינמחנהישראלויהיהעננוהחשכויאראתהלילהולאקרבזהאלזהכלהלילה",
  "ויטמשהאתידועלהימויולכיהוהאתהימברוחקדימעזהכלהלילהוישמאתהימלחרבהויבקעוהמימ"
];
const EXPECTED_24="נתה האא ירת שאה ריי אום לכב ושר יחו להח כוק מנד אני חעם רהע ייז ההה מיך וול ילה סאל ערי עשל מיה";
const A="אבגדהוזחטיכלמנסעפצקרשת";
const REG=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const FINAL_TO_BASE=Object.fromEntries([["ך","כ"],["ם","מ"],["ן","נ"],["ף","פ"],["ץ","צ"]]);
const BASE_TO_FINAL=Object.fromEntries(Object.entries(FINAL_TO_BASE).map(([a,b])=>[b,a]));
const clean=s=>[...s].filter(c=>c in FINAL_TO_BASE || A.includes(c)).map(c=>FINAL_TO_BASE[c]||c).join("");
const index=c=>{const i=A.indexOf(c);assert.ok(i>=0,"invalid character "+c);return i};
const regular=s=>[...clean(s)].reduce((n,c)=>n+REG[index(c)],0);
const ordinal=s=>[...clean(s)].reduce((n,c)=>n+index(c)+1,0);
const albam=s=>[...clean(s)].reduce((n,c)=>n+REG[(index(c)+11)%22],0);
const albamOrdinal=s=>[...clean(s)].reduce((n,c)=>n+1+((index(c)+11)%22),0);
const rendered=s=>s.slice(0,-1)+(BASE_TO_FINAL[s.slice(-1)]||s.slice(-1));
const backwards=s=>[...s].reverse().join("");
function names(rows){
 return Array.from({length:72},(_,i)=>rows[0][i]+rows[1][71-i]+rows[2][i]);
}
function matchesRegular(text,target=888){
 const s=clean(text),found=[];
 for(let start=0;start<s.length;start++){
  let total=0;
  for(let end=start;end<s.length;end++){
   total+=REG[index(s[end])];
   if(total===target)found.push({start:start+1,end:end+1,text:s.slice(start,end+1)});
  }
 }
 return found;
}
function verify(){
 assert.deepEqual(SOURCE.map(x=>x.length),[72,72,72]);
 const all=names(SOURCE), middle=all.slice(24,48), displayed=middle.map(rendered).join(" ");
 assert.equal(displayed,EXPECTED_24,"Exact 24 strings matched");
 assert.equal(albamOrdinal(displayed),888);
 assert.equal(regular(displayed),3969);
 assert.equal(ordinal(displayed),756);
 assert.equal(albam(SOURCE[1].slice(1,11)),888);
 assert.equal(SOURCE[1].slice(1,11),"יבאבינמחנה");
 assert.equal(albam("יבא בין מחנה"),888);
 assert.equal(albam("ויבא בין מחנה"),968);
 assert.equal(regular(SOURCE[1]),3043);
 assert.deepEqual(matchesRegular(SOURCE[1]),[]);
 assert.deepEqual(matchesRegular(middle.join("")),[
  {start:16,end:35,text:"אומלכבושריחולהחכוקמנ"},
  {start:53,end:69,text:"יכוולילהסאלעריעשל"}]);
 assert.equal(regular("עב"),72);
 assert.equal(ordinal("עב"),18);
 assert.equal(regular("עמית"),520);
 assert.equal(regular("בלייז"),59);
 const P=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 let count=0;
 for(let mask=0;mask<8;mask++){
  const rows=SOURCE.map((v,j)=>mask&(1<<j)?backwards(v):v);
  for(const perm of P){
   const nn=Array.from({length:72},(_,i)=>perm.map(k=>rows[k][i]).join(""));
   assert.equal(albamOrdinal(nn.slice(24,48).join("")),888);
   count++;
  }
 }
 assert.equal(count,48);
 // Check the code in the *actual production calculator* rather than an inferred name.
 const calcPath=path.join(__dirname,"..","calculator.html");
 const html=fs.readFileSync(calcPath,"utf8");
 assert.ok(html.includes("key:'albamOrdinal',cat:'cipher',name:'אלב״ם סדרי'"));
 assert.ok(html.includes("HE_ALBAM_ORD[a]=HE_ORD[b]"));
 assert.ok(html.includes("HE_ALBAM_ORD[f]=HE_ALBAM_ORD[b]"));
 assert.ok(html.includes("albamOrdinal:'ALBaM Ordinal'"));
 assert.ok(html.includes("'he:albamOrdinal'"));
 assert.ok(html.includes("key:'albam',cat:'cipher',name:'אלב״ם / ALBaM'"));
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 assert.ok(scripts.length>0);
 for(const script of scripts)if(script.trim() && !script.match(/^\s*\{/))new Function(script);
 console.log("PASS | calculator ALBaM Ordinal registered; Hebrew finals; full inline-script syntax");
 console.log("PASS | 24 names #25–#48: ALBaM Ordinal 888; regular 3969; ordinal 756");
 console.log("PASS | all 48 orientation/permutation paths retain middle-third 888");
 console.log("PASS | Exodus 14:20 positions 2–11 ALBaM regular 888, original verse regular 3043");
 console.log("PASS | exactly 2 regular 888 contiguous windows in the middle 24 names");
 console.log("PASS | ע״ב initials: ע + ב=72 regular, 18 ordinal; עמית=520, בלייז=59");
}
verify();
