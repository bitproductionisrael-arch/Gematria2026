#!/usr/bin/env node
"use strict";
/* RovGrid reproducible audit of 5846, 5845/5844 verse-boundary variants, 73 verses of 72 letters.
 * Run:
 * node research/rovgrid-5846-5844-73-158-cross-edition-audit-2026-11-12-verify.js Genesis.json Exodus.json Leviticus.json Numbers.json Deuteronomy.json
 * Use source Sefaria MAM Hebrew merged, repo Sivan22/Sefaria-Export-Hebrew-Texts.
 * This tests all single-boundary merges in Exodus 20 (23->22) and Deuteronomy 5 (30->29).
 * The 5845 variants are simulated intermediate counts, not a reconstruction of every historical tradition.
 */
const BOOKS=["Genesis","Exodus","Leviticus","Numbers","Deuteronomy"];
const onlyHebrew=/[אבגדהוזחטיכלמנסעפצקרשתךםןףץ]+/g;
function assert(ok,msg){if(!ok)throw new Error(msg)}
function wordsOf(raw){
 const s=raw.replace(/<i class="footnote">[\s\S]*?<\/i>/g,"")
  .replace(/<span class="mam-kq-q">[^<]*<\/span>/g,"")
  .replace(/<span class="mam-spi-[^"]+">\{[פס]\}<\/span>/g,"")
  .replace(/<[^>]*>/g,"").replace(/&[a-zA-Z]+;/g," ")
  .normalize("NFD").replace(/\p{M}/gu,"");
 return s.match(onlyHebrew)||[];
}
const countLength72=a=>a.filter(n=>n===72).length;
const count3x72=a=>a.reduce((sum,n,i)=>sum+(i>=2&&n===72&&a[i-1]===72&&a[i-2]===72?1:0),0);
const merge=(a,i)=>a.slice(0,i).concat([a[i]+a[i+1]],a.slice(i+2));
function verify(bookTexts){
 let lengths=[],bookCounts=[],chapters=[],wordCount=0,letterCount=0;
 for(let b=0;b<5;b++){
  const start=lengths.length,wStart=wordCount,lStart=letterCount;
  for(let ch=0;ch<bookTexts[b].length;ch++){
   const chStart=lengths.length;
   for(const verse of bookTexts[b][ch]){
    const w=wordsOf(verse);
    const count=w.join("").length;
    lengths.push(count);wordCount+=w.length;letterCount+=count;
   }
   chapters.push({book:BOOKS[b],chapter:ch+1,start:chStart,end:lengths.length});
  }
  bookCounts.push({book:BOOKS[b],verses:lengths.length-start,words:wordCount-wStart,letters:letterCount-lStart});
 }
 assert(lengths.length===5846,"MAM segment count not 5846");
 assert(wordCount===79977&&letterCount===304801,"canonical word/letter count mismatch");
 assert(countLength72(lengths)===73&&count3x72(lengths)===1,"original 73/1 mismatch");
 const ex=chapters.find(x=>x.book==="Exodus"&&x.chapter===20);
 const dt=chapters.find(x=>x.book==="Deuteronomy"&&x.chapter===5);
 assert(ex.end-ex.start===23&&dt.end-dt.start===30,"source Decalogue counts differ from expected");
 const exAdj=[],dtAdj=[];
 for(let i=ex.start;i<ex.end-1;i++)exAdj.push({pair:[i-ex.start+1,i-ex.start+2],combinedLength:lengths[i]+lengths[i+1]});
 for(let i=dt.start;i<dt.end-1;i++)dtAdj.push({pair:[i-dt.start+1,i-dt.start+2],combinedLength:lengths[i]+lengths[i+1]});
 assert(exAdj.length===22&&dtAdj.length===29,"incorrect alternative counts");
 assert(!exAdj.some(x=>x.combinedLength===72)&&!dtAdj.some(x=>x.combinedLength===72),"merging creates 72 verse");
 assert(!lengths.slice(ex.start,ex.end).includes(72)&&!lengths.slice(dt.start,dt.end).includes(72),"72 verse already in Decalogue");
 let count5845=0,count5844=0;
 for(let i=ex.start;i<ex.end-1;i++){
  const a=merge(lengths,i);count5845++;
  assert(a.length===5845&&countLength72(a)===73&&count3x72(a)===1,"failed Exodus-only merge");
  for(let j=dt.start;j<dt.end-1;j++){
   const bb=merge(a,j-1);count5844++;
   assert(bb.length===5844&&countLength72(bb)===73&&count3x72(bb)===1,"failed both-merge");
  }
 }
 for(let j=dt.start;j<dt.end-1;j++){
  const a=merge(lengths,j);count5845++;
  assert(a.length===5845&&countLength72(a)===73&&count3x72(a)===1,"failed Deuteronomy-only merge");
 }
 assert(count5845===51&&count5844===638,"scenario counts incorrect");
 const gen35=bookTexts[0][34][21];
 const splitParts=gen35.split(/<span class="mam-spi-pe">\{פ\}<\/span><br>/);
 assert(splitParts.length===2,"Genesis 35:22 parashah boundary missing");
 const splitLengths=splitParts.map(s=>wordsOf(s).join("").length);
 assert(splitLengths[0]===60&&splitLengths[1]===19,"unexpected Gen35 split lengths");
 assert(60+19===lengths[chapters.find(x=>x.book==="Genesis"&&x.chapter===35).start+21],"Gen35 total not matched");
 const p=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79];
 assert(p[11]===37&&p[20]===73&&p[21]===79,"prime indexes mismatch");
 assert(5846===37*158&&158===2*79&&158===72+86&&158===37+11**2,"158 factorizations mismatch");
 assert(86-37===49&&121-72===49,"square bridge mismatch");
 assert(26136===216*121&&26136===72*363,"word index bridge mismatch");
 return {
  date:"2026-11-12",
  source:"Sefaria/MAM via Sivan22/Sefaria-Export-Hebrew-Texts, 5 book merged.json",
  corpus:{verses:5846,words:79977,letters:304801,bookCounts,versesOfLength72:73,threeConsecutiveOfLength72:1},
  externalPublishedCounts:{torahCalc:5844,bekiyusMasorah:5845,sodtoraMethod:5846,taameiHamikraFisher:5846,torahByWord:5846},
  variantAudit:{
   chapterCounts:{exodus20:23,deuteronomy5:30},
   alternateChapterCounts:{exodus20:22,deuteronomy5:29},
   mergeOneBoundary:{verseCount:5845,scenarios:count5845,allPreserve73andOneTriple:true},
   mergeTwoBoundaries:{verseCount:5844,scenarios:count5844,allPreserve73andOneTriple:true},
   candidatePairs:{exodus20:exAdj.length,deuteronomy5:dtAdj.length},
   any72VersesInBothChapters:false,anyAdjacentPairsSumming72:false,
   resultScope:"All single adjacent mergers in these two chapters; not all historic verse-division traditions"
  },
  genesis3522:{optionalSplit:[60,19],alreadyOneVerse:true,eachPartNot72:true},
  math158:{
   equality:"5846=37*158",
   factorization:"158=2*79, 79 is 22nd prime; 37 is 12th prime; 73 is 21st prime",
   symbolic:"158=72+86 (72 names + Elohim gematria) — post-hoc interpretive link",
   secondBridge:"158=37+121=37+11^2; 121-72=86-37=49=7^2",
   linkToPosition:"the opening 72-name passage begins at Torah word 26136=216*121 in this textual word-count edition",
   limitation:"37 divides one published verse-boundary count exactly; other legitimate counts are not divisible by 37"
  }
 };
}
module.exports={verify};
if(require.main===module){
 const fs=require("node:fs"),paths=process.argv.slice(2);
 assert(paths.length===5,"usage: node script.js Genesis.json Exodus.json Leviticus.json Numbers.json Deuteronomy.json");
 const a=verify(paths.map(p=>JSON.parse(fs.readFileSync(p,"utf8")).text));
 console.log("PASS: 5846 73 length72, 1 triple; 51 one-boundary + 638 two-boundary variants; 158 factorization");
 console.log(JSON.stringify(a,null,2));
}
