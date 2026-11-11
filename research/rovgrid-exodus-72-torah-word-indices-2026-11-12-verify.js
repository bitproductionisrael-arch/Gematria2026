#!/usr/bin/env node
"use strict";
// RovGrid: Torah-wide 1-based lexical word and letter indexes for Exodus 14:19–21.
// Usage: node research/rovgrid-exodus-72-torah-word-indices-2026-11-12-verify.js Genesis-Hebrew-merged.json Exodus-Hebrew-merged.json
// Public source: github.com/Sivan22/Sefaria-Export-Hebrew-Texts
const ABC="אבגדהוזחטיכלמנסעפצקרשת";
const RV=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const FIN={"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"};
const clean=s=>s.replace(/<i class="footnote">[\s\S]*?<\/i>/g,"")
  .replace(/<span class="mam-kq-q">[^<]*<\/span>/g,"")
  .replace(/<span class="mam-spi-[^"]+">\{[פס]\}<\/span>/g,"")
  .replace(/<[^>]*>/g,"").replace(/&[a-zA-Z]+;/g," ")
  .normalize("NFD").replace(/\p{M}/gu,"");
const words=s=>clean(s).match(/[אבגדהוזחטיכלמנסעפצקרשתךםןףץ]+/g)||[];
const normalized=s=>s.replace(/[ךםןףץ]/g,c=>FIN[c]);
const score=(s,mode="regular")=>[...normalized(s.replace(/\s+/g,""))].reduce((n,c)=>{
 const i=ABC.indexOf(c);if(i<0)throw Error("Unknown letter: "+c);
 return n+(mode==="regular"?RV[i]:mode==="ordinal"?i+1:mode==="atbash_ordinal"?22-i:0);
},0);
const assert=(yes,msg)=>{if(!yes)throw Error("FAIL: "+msg)};
function build(genesis,exodus){
 let wCount=0,lCount=0,vCount=0;
 const bookStats=[],selected=[];
 [genesis.text,exodus.text].forEach((book,b)=>{
  const w0=wCount,l0=lCount,v0=vCount;
  book.forEach((chapter,ci)=>chapter.forEach((v,vi)=>{
   const arr=words(v),vw=wCount,vl=lCount;vCount++;
   if(b===1&&ci===13&&vi>=18&&vi<=20){
    let offset=0;
    const entries=arr.map((word,i)=>{
      const obj={verse:vi+1,position:i+1,word,
       regular:score(word),ordinal:score(word,"ordinal"),atbash_ordinal:score(word,"atbash_ordinal"),
       torah_word_index:vw+i+1,torah_letter_start:vl+offset+1,torah_letter_end:vl+offset+word.length};
      offset+=word.length;return obj;
    });
    const chars=entries.flatMap(entry=>[...entry.word].map((letter,k)=>({
      letter,word:entry.word,word_position:entry.position,
      torah_word_index:entry.torah_word_index,torah_letter_index:entry.torah_letter_start+k
    })));
    selected.push({
      verse:vi+1,torah_verse_index:vCount,beshalach_verse_index:vi+6,
      word_count:arr.length,letter_count:offset,
      torah_word_start:vw+1,torah_word_end:vw+arr.length,
      torah_letter_start:vl+1,torah_letter_end:vl+offset,
      words:entries,letters:chars
    });
   }
   wCount+=arr.length;lCount+=arr.join("").length;
  }));
  bookStats.push({book:b?"Exodus":"Genesis",verses:vCount-v0,words:wCount-w0,letters:lCount-l0});
 });
 const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
 assert(equal(bookStats.map(x=>[x.words,x.letters]),[[20612,78063],[16713,63527]]),"external book counts");
 assert(equal(selected.map(v=>[v.word_count,v.letter_count]),[[15,72],[20,72],[21,72]]),"local word/letter counts");
 assert(equal(selected.map(v=>v.torah_verse_index),[1909,1910,1911]),"global verse indices");
 assert(equal(selected.map(v=>v.torah_word_start),[26136,26151,26171]),"global word indices");
 assert(equal(selected.map(v=>v.torah_letter_start),[99060,99132,99204]),"global letter indices");
 const names=Array.from({length:72},(_,k)=>{
  const src=[selected[0].letters[k],selected[1].letters[71-k],selected[2].letters[k]];
  const raw=normalized(src.map(a=>a.letter).join(""));
  return {index:k+1,name:raw,
    source_word_positions:src.map(a=>a.word_position),
    source_words:src.map(a=>a.word),
    torah_word_indices:src.map(a=>a.torah_word_index),
    torah_letter_indices:src.map(a=>a.torah_letter_index),
    source_letter_indices:[k+1,72-k,k+1],
    source_word_position_sum:src.reduce((v,a)=>v+a.word_position,0)};
 });
 assert(names[0].name==="והו"&&names[36].name==="אני"&&names[71].name==="מומ","source 72 names");
 assert(equal(names[36].torah_letter_indices,[99096,99167,99240]),"#37 global letters");
 assert(equal(names[36].source_word_positions,[9,9,12]),"#37 word source positions");
 assert(equal(names[71].source_word_positions,[15,1,21]),"#72 word source positions");
 assert(names.every(x=>x.torah_letter_indices[2]-x.torah_letter_indices[0]===144),"outer letter gap 144");
 const all=selected.flatMap(v=>v.words);
 const eqOffset=all.filter(v=>v.regular===v.torah_word_index-26136);
 assert(eqOffset.length===1&&eqOffset[0].word==="אל","sole word index/value offset fixed point");
 assert(score("זה אל זה")===55&&score("זה אל זה","ordinal")===37&&score("זה אל זה","atbash_ordinal")===101,"זה אל זה");
 assert(selected[1].words.slice(15,18).map(x=>x.word).join(" ")==="זה אל זה","middle verse Ze-El-Zeh");
 assert(selected[1].words[10].word==="ויאר"&&score("ויאר")===217&&score("ויאר","ordinal")===37,"central word verse20");
 assert(selected[2].words[10].word==="ברוח"&&score("ברוח")===216&&score("ברוח","ordinal")===36,"central word verse21");
 assert(score("מלאך")===91&&score("האלהים")===91,"two adjacent 91 words");
 assert(score("ובין מחנה ישראל","ordinal")===136,"136 direct");
 assert(score("את הים")===456,"456 direct");
 assert(all.length===56&&216-all.length===160,"within-word adjacency edges");
 assert(26136===216*11*11&&26191-26136===55,"global index identities");
 const aligned=[];
 for(let a=0;a<3;a++)for(let b=a+1;b<3;b++)for(let i=0;i<Math.min(selected[a].words.length,selected[b].words.length)-1;i++){
  const s1=selected[a].words.slice(i,i+2).map(x=>x.word).join(" ");
  const s2=selected[b].words.slice(i,i+2).map(x=>x.word).join(" ");
  if(s1===s2)aligned.push({verses:[selected[a].verse,selected[b].verse],position:i+1,words:s1});
 }
 assert(aligned.length===1&&aligned[0].position===6&&aligned[0].words==="מחנה ישראל","aligned repeated phrase");
 const fullWord888=[];
 for(const v of selected)for(let i=0;i<v.words.length;i++){
  let z=0;for(let j=i;j<v.words.length;j++){z+=v.words[j].regular;if(z===888)fullWord888.push({verse:v.verse,range:[i+1,j+1]})}
 }
 assert(fullWord888.length===0,"no whole-word within-verse regular888");
 const withoutLetterArrays=selected.map(({letters,...x})=>x);
 return {protocol:"one-based indexes; maqaf separates words; omit footnotes, parasha markers and alternate qere renderings",
 source:"Sivan22/Sefaria-Export-Hebrew-Texts: json/Tanakh/Torah/Genesis|Exodus/Hebrew/merged.json",
 book_stats:bookStats,
 word_total:56,letter_total:216,within_word_letter_edges:160,
 verse_indices:[1909,1910,1911],parsha_verses:[25,26,27],
 first_word_index:26136,last_word_index:26191,
 first_letter_index:99060,last_letter_index:99275,
 middle_phrase:{words:"זה אל זה",positions:[16,17,18],regular:55,ordinal:37,atbash_ordinal:101},
 aligned_bigrams:aligned,
 sole_word_with_regular_equals_word_offset:eqOffset[0],
 name37:names[36],name72:names[71],
 name72_word_position_sum37_multiplicity:names.filter(x=>x.source_word_position_sum===37).length,
 repeated_phrase_at_hayam:[{verse:21,positions:[9,10]},{verse:21,positions:[17,18]}],
 whole_word_888_within_each_verse:fullWord888,
 verses:withoutLetterArrays,names
 };
}
module.exports={build,words,score};
if(require.main===module){
 const fs=require("node:fs"),args=process.argv.slice(2);
 if(args.length!==2)throw Error("Expected 2 paths: Genesis.json Exodus.json");
 const result=build(...args.map(p=>JSON.parse(fs.readFileSync(p,"utf8"))));
 console.log("PASS 72 name sources, Torah word indexes, 56/216, gematria identities, single aligned repeated bigram");
 console.log(JSON.stringify(result,null,2));
}
