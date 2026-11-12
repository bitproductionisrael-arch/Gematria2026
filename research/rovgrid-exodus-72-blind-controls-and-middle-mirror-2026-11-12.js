#!/usr/bin/env node
"use strict";
// RovGrid reproducible cross-Torah negative controls for Exodus 14:19-21.
// Input: five Sefaria Hebrew/MAM merged JSON book exports, in Torah order.
// Usage: node research/rovgrid-exodus-72-blind-controls-and-middle-mirror-2026-11-12-verify.js Gen.json Exod.json Lev.json Num.json Deut.json
const BOOKS=["Genesis","Exodus","Leviticus","Numbers","Deuteronomy"];
const SOURCE=["ויסעמלאכהאלהימההלכלפנימחנהישראלוילכמאחריהמויסעעמודהעננמפניהמויעמדמאחריהמ","ויבאבינמחנהמצרימובינמחנהישראלויהיהעננוהחשכויאראתהלילהולאקרבזהאלזהכלהלילה","ויטמשהאתידועלהימויולכיהוהאתהימברוחקדימעזהכלהלילהוישמאתהימלחרבהויבקעוהמימ"];
const ALPHABET="אבגדהוזחטיכלמנסעפצקרשת";
const REG=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const FINAL={"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"};
function check(ok,msg){if(!ok)throw new Error("FAILED "+msg)}
function tokenise(raw){
 const stripped=raw.replace(/<i class="footnote">[\s\S]*?<\/i>/g,"")
 .replace(/<span class="mam-kq-q">[^<]*<\/span>/g,"")
 .replace(/<span class="mam-spi-[^"]+">\{[פס]\}<\/span>/g,"")
 .replace(/<[^>]*>/g,"").replace(/&[a-zA-Z]+;/g," ")
 .normalize("NFD").replace(/\p{M}/gu,"");
 return stripped.match(/[אבגדהוזחטיכלמנסעפצקרשתךםןףץ]+/g)||[];
}
function canon(s){return [...s].map(c=>FINAL[c]||c).join("")}
function value(s,kind){
 return [...canon(s)].reduce((sum,c)=>{
  const i=ALPHABET.indexOf(c);
  check(i>=0,"unexpected Hebrew letter "+c);
  return sum+(kind==="regular"?REG[i]:i+1);
 },0);
}
function reverse(s){return [...s].reverse().join("")}
function run(bibles){
 check(bibles.length===5,"five Torah books required");
 let verses=[],totalWords=0,totalLetters=0;const stats=[];
 for(let b=0;b<5;b++){
  const t=bibles[b].text,bw=totalWords,bl=totalLetters,bv=verses.length;
  for(let c=0;c<t.length;c++)for(let v=0;v<t[c].length;v++){
   const words=tokenise(t[c][v]);
   const text=canon(words.join(""));
   const item={ref:BOOKS[b]+" "+(c+1)+":"+(v+1),b,c:c+1,v:v+1,
    wordStart:totalWords+1,letterStart:totalLetters+1,
    len:text.length,text,wordList:words.map(w=>({text:w,regular:value(w,"regular"),ordinal:value(w,"ordinal")}))};
   verses.push(item);totalWords+=words.length;totalLetters+=text.length;
  }
  stats.push({book:BOOKS[b],verses:verses.length-bv,words:totalWords-bw,letters:totalLetters-bl});
 }
 check(totalWords===79977&&totalLetters===304801,"Torah canonical words and letters");
 check(verses.length===5846,"MAM exported verse boundary count");
 check(stats[0].words===20612&&stats[1].words===16713,"Genesis+Exodus word counts");
 const target=verses.find(v=>v.ref==="Exodus 14:19");
 const ind=verses.indexOf(target),one=verses[ind+1],two=verses[ind+2];
 check(target.text===SOURCE[0]&&one.text===SOURCE[1]&&two.text===SOURCE[2],"3x72 source verses match previous census");
 check(target.wordStart===26136&&target.letterStart===99060,"Torah absolute word and letter start");
 const all72=verses.filter(v=>v.len===72),triples72=[],triples216=[];
 for(let i=0;i<verses.length-2;i++){
  const a=verses[i],b=verses[i+1],c=verses[i+2];
  if(a.len===72&&b.len===72&&c.len===72)triples72.push({index:i+1,refs:[a.ref,b.ref,c.ref],wordStart:a.wordStart});
  if(a.len+b.len+c.len===216){
   const list=a.wordList.concat(b.wordList,c.wordList);
   triples216.push({ref:a.ref,lengths:[a.len,b.len,c.len],wordCount:list.length,
    wordStart:a.wordStart,startDiv216:a.wordStart%216===0,
    localOffsetFixedPoints:list.filter((w,j)=>w.regular===j).length,
    word11_217_216:b.wordList[10]?.regular===217&&c.wordList[10]?.regular===216});
  }
 }
 check(all72.length===73&&triples72.length===1&&triples72[0].index===ind+1,"unique triple72");
 check(triples216.length===19&&triples216.filter(x=>x.startDiv216).length===1,"19 equal216 controls");
 const pairProfile=v=>{
  let pairs=[];for(let i=0;i<36;i++)if(v.text[i]===v.text[71-i])pairs.push({left:i+1,right:72-i,letter:v.text[i]});
  return {ref:v.ref,total:pairs.length,central12:pairs.filter(p=>p.left>=25).length,
   central13:pairs.filter(p=>p.left>=24).length,pairs};
 };
 const mirror72=all72.map(pairProfile),midProfile=mirror72.find(x=>x.ref===one.ref);
 check(midProfile.total===6&&midProfile.central12===5&&midProfile.central13===6,"middle-mirror profile");
 check(JSON.stringify(midProfile.pairs.map(x=>x.left))==="[24,27,28,30,34,36]","all exact six matched positions");
 check(mirror72.filter(x=>x.central12>=5).length===1,"unique middle-central mirror among 73");
 const distribution={};for(const x of mirror72)distribution[x.central12]=(distribution[x.central12]||0)+1;
 check(JSON.stringify(distribution)==='{"0":28,"1":33,"2":10,"3":1,"5":1}',"control mirror histogram");
 let r217216=0,r217216Ord=0,wordPairChecks=0,alignedBigrams=0;const alignedTarget=[];
 for(let i=0;i<verses.length-1;i++){
  const a=verses[i],b=verses[i+1];
  if(a.wordList[10]?.regular===217&&b.wordList[10]?.regular===216){
   r217216++;
   if(a.wordList[10].ordinal===37&&b.wordList[10].ordinal===36)r217216Ord++;
  }
  for(let k=0;k<Math.min(a.wordList.length,b.wordList.length)-1;k++){
   wordPairChecks++;
   const aa=a.wordList[k].text+" "+a.wordList[k+1].text;
   const bb=b.wordList[k].text+" "+b.wordList[k+1].text;
   if(aa===bb){alignedBigrams++;if(a.ref==="Exodus 14:19"&&b.ref==="Exodus 14:20")alignedTarget.push({position:k+1,text:aa})}
  }
 }
 check(r217216===1&&r217216Ord===1,"unique adjacent #11 pair");
 check(wordPairChecks===57527&&alignedBigrams===420,"aligned bigram controls");
 check(alignedTarget.length===1&&alignedTarget[0].position===6&&alignedTarget[0].text==="מחנה ישראל","local aligned bigram");
 const center21=verses.filter(x=>x.wordList.length===21);
 const center216=center21.filter(x=>x.wordList[10].regular===216);
 check(center21.length===146&&center216.length===2,"center 21-word verse controls");
 const stable=[];for(let i=0;i<36;i++)if(SOURCE[1][i]===SOURCE[1][71-i]){
  stable.push({locations:[i+1,72-i],middleLetter:SOURCE[1][i],
   names:[SOURCE[0][i]+SOURCE[1][71-i]+SOURCE[2][i],SOURCE[0][71-i]+SOURCE[1][i]+SOURCE[2][71-i]]});
 }
 check(stable.length===6&&stable.filter(x=>x.locations[0]>=25).length===5,"six stable name pairs, five central");
 const P=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
 let centralAni=0,anyAni=0;
 for(let mask=0;mask<8;mask++){
  const rows=SOURCE.map((text,j)=>mask&(1<<j)?reverse(text):text);
  for(const p of P){
   const n=Array.from({length:72},(_,i)=>p.map(j=>rows[j][i]).join(""));
   if(n[36]==="אני")centralAni++;
   if(n.includes("אני"))anyAni++;
  }
 }
 check(centralAni===2&&anyAni===4,"ANI center across48 paths");
 return {
  date:"2026-11-12",source:"Sivan22/Sefaria-Export-Hebrew-Texts (Sefaria Hebrew MAM merged)",
  counting:"Ketiv text; 1-based word and letter indexes; maqaf split; remove footnotes, parashah indicators and alternate qere",
  caveat:"Source has 5846 verse records vs canonical 5844 verse boundaries, because some verse splits differ; word/letter totals match TorahCalc",
  book_stats:stats,torah:{verses:verses.length,words:totalWords,letters:totalLetters},
  count72verse:all72.length,contiguous_3x72:triples72,
  total_216_letter_three_verse_controls:triples216.length,controls216:triples216,
  target_start_word:target.wordStart,target_start_letter:target.letterStart,
  middle_verse_mirror_profile:midProfile,
  all72_mirror_profiles:mirror72,
  mirror_central12_histogram:distribution,
  verses_with_middle12_at_least5:mirror72.filter(x=>x.central12>=5).map(x=>x.ref),
  stable_name_pairs:stable,
  exactly_center_ANI_in_48_paths:centralAni,any_ANI_in_48_paths:anyAni,
  central_words:{secondVerseWord11:one.wordList[10],thirdVerseWord11:two.wordList[10],
   adjacentWord11_217_to216:r217216,alsoOrdinal37_to36:r217216Ord,
   all_21word_verses:center21.length,
   center_word_regular216:center216.map(x=>({ref:x.ref,word:x.wordList[10].text}))},
  aligned_bigrams:{checked_pairs:wordPairChecks,total_matches:alignedBigrams,local_exodus_match:alignedTarget}
 };
}
module.exports={run};
if(require.main===module){
 const fs=require("node:fs"),files=process.argv.slice(2);
 check(files.length===5,"requires Genesis Exodus Leviticus Numbers Deuteronomy JSON files");
 const result=run(files.map(f=>JSON.parse(fs.readFileSync(f,"utf8"))));
 console.log("PASS: 5-book negative controls; one triple 72; middle-mirror profile and word #11 uniqueness");
 console.log(JSON.stringify(result,null,2));
}
