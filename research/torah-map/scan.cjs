'use strict';
const fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const E=require('./engine.cjs'),D=__dirname;
const source=JSON.parse(fs.readFileSync(D+'/source/verses.json'));
const manifest=JSON.parse(fs.readFileSync(D+'/source/manifest.json'));
assert.equal(JSON.parse(fs.readFileSync(D+'/validation.json')).passed,true);
const corpus=JSON.parse(fs.readFileSync(path.join(D,'../../corpus-data.json'))).entries;
const corpusIndex=new Map();corpus.forEach((r,i)=>{const k=String(r.value);if(!corpusIndex.has(k))corpusIndex.set(k,[]);corpusIndex.get(k).push(i)});
const methods=E.METHODS.he;
const names=Object.fromEntries(methods.map(m=>[m.key,m.name]));
const extraDefs=[['miluiGenesis74','מילוי רש · בראשית 74²','genesis74'],['miluiVavTu','מילוי ואו ותו · פרופיל כתיב','vavTu']];
extraDefs.forEach(([k,n])=>names[k]=n);
for(const d of E.YHVH_MILUI_GALLERY.filter(d=>d.kind!=='derived'))names['yhvh_'+d.id]=d.name+' · הרחבת המנוע';
names.permutationsBase='תמורות אותיות · סופיות כבסיס';names.permutationsFinals='תמורות אותיות · סופיות נפרדות';
const registry=methods.map(m=>Object.fromEntries(Object.entries(m).map(([k,v])=>[k,typeof v==='function'?v.toString():v])));
function json(x){return JSON.stringify(x,(_,v)=>typeof v==='bigint'?v.toString():v)}
function write(file,value,gz=false){const p=path.join(D,file);fs.mkdirSync(path.dirname(p),{recursive:true});const data=typeof value==='string'?value:json(value);fs.writeFileSync(p+'.tmp',gz?zlib.gzipSync(data,{level:6}):data);fs.renameSync(p+'.tmp',p)}
write('methods.json',{engine_commit:E.commit,engine_blob:E.blob,registered:registry,names,extras:extraDefs,gallery:E.YHVH_MILUI_GALLERY,interval_order:'For start=0..word_count-1, end=start+1..word_count, [start,end) ; one value per interval, same order for all registered methods.',raw_encoding:'Original calculate() outputs omit method object (see registry), word.raw (see source.words), and tokens (see baseVals and method.map); parts, baseVals, vals, folded, subtotal and all calculation metadata retained. Full token rows can be reconstructed from fixed unmarked source and registry.'});
write('corpus-index.json',{source_commit:E.commit,entries:corpus});
const MAXPRIME=5000000,prime=new Uint8Array(MAXPRIME+1);prime.fill(1,2);for(let p=2;p*p<=MAXPRIME;p++)if(prime[p])for(let n=p*p;n<=MAXPRIME;n+=p)prime[n]=0;
const primeIndex=new Uint32Array(MAXPRIME+1);let pi=0;for(let n=2;n<=MAXPRIME;n++)if(prime[n])primeIndex[n]=++pi;
function root(n){return n===0?0:1+(n-1)%9}
function gcd(a,b){while(b){let t=a%b;a=b;b=t}return a}
function fraction(n,d){let g=gcd(n,d);n/=g;d/=g;return d===1n?String(n):n+'/'+d}
function compact(r){const {method,words,...rest}=r;return {...rest,words:words?.map(w=>{const {raw,toks,...v}=w;return v})}}
function resultNumber(r){return r.exactFraction||r.total}
function extra(text){
 const out={};for(const [k,n,p] of extraDefs)out[k]=compact(E.calculateMilui(text,p));
 for(const d of E.YHVH_MILUI_GALLERY.filter(d=>d.kind!=='derived'))out['yhvh_'+d.id]=E.yhvhComputeMilui(d,text);
 for(const flag of [false,true]){E.setDistinctFinals(flag);out[flag?'permutationsFinals':'permutationsBase']=E.computePermutationData(text)}E.setDistinctFinals(false);
 return out;
}
function totalsFor(text){return Object.fromEntries(methods.map(m=>[m.key,resultNumber(E.calculate(text,'he',m))]))}
function intervalsFor(row,results,wordTotals){
 const intervals={},n=row.words.length;
 for(const m of methods){
  const pref=[0];for(const w of wordTotals)pref.push(pref.at(-1)+(typeof w[m.key]==='number'?w[m.key]:0));
  const reg=[0],small=[0],zero=[0],letterPref=[0];for(let i=0;i<n;i++){reg.push(reg.at(-1)+wordTotals[i].regular);small.push(small.at(-1)+wordTotals[i].reduced);zero.push(zero.at(-1)+wordTotals[i].zeroStep);letterPref.push(letterPref.at(-1)+row.words[i].length)}
  let product=[1n];if(m.letterProduct||m.letterDivision)for(const w of row.words){let p=1n;for(const c of w)p*=BigInt(m.map[c]);product.push(product.at(-1)*p)}
  const arr=[];
  for(let i=0;i<n;i++)for(let j=i+1;j<=n;j++){
   let value;
   if(m.letterProduct){const v=product[j]/product[i];value=v<=BigInt(Number.MAX_SAFE_INTEGER)?Number(v):String(v)}
   else if(m.letterDivision){const first=BigInt(m.map[row.words[i][0]]);value=fraction(first*first,product[j]/product[i])}
   else if(m.custom==='harmonicHalf'){const v=zero[j]-zero[i];value=v>0&&v%2===0?v/2:v}
   else if(m.key==='kolel')value=reg[j]-reg[i]+1;
   else if(m.key==='musafi')value=reg[j]-reg[i]+letterPref[j]-letterPref[i];
   else if(m.fold==='total')value=root(small[j]-small[i]);
   else value=pref[j]-pref[i];
   arr.push(value);
   if(row.torah_index<=31){const direct=E.calculate(row.words.slice(i,j).join(' '),'he',m);assert.equal(value,resultNumber(direct),row.ref+' '+m.key+' '+i+':'+j)}
   if(i===0&&j===n)assert.equal(value,resultNumber(results[m.key]),row.ref+' interval whole '+m.key);
  }
  intervals[m.key]=arr;
 }
 return intervals;
}
function analyze(row,raw,words,intervals){
 const hits=[],pending=[],facts={},n=row.words.length;
 const add=(type,method,equation,evidence)=>hits.push({type,method,equation,evidence,status:'נמצא ואומת',verification:'exact arithmetic; significance beyond stated structure not asserted'});
 const cmpKeys=['regular','ordinal','reduced','final','smallFinals','zeroStep','atbash','atbashOrdinal','albam','avgad','ayak','kidmi','perati','peratiOrdinal','milui','miluiTalmudic','miluiMayim','miluiLegacy','miluiPelia','milui2','achorayim','positional','equivalence','ratzo','addsub','wordPositionRegular','wordPositionSmall','wordPositionOrdinal','latinMiluiUserSimple','latinMiluiUserReduced','latinMiluiUserRegular',...methods.filter(m=>m.cat==='power').map(m=>m.key)];
 const positions={verse:row.verse,chapter:row.chapter,words:n,letters:row.letters,book_index:row.book_index,torah_index:row.torah_index};
 for(const key of cmpKeys){
  const v=raw[key].total,ws=words.map(w=>w[key]);
  if(!Number.isSafeInteger(v)||v<=0)continue;
  const fact={};if(v<=MAXPRIME&&prime[v])fact.prime_index=primeIndex[v];
  const s=Math.sqrt(v);if(Number.isInteger(s))fact.square_root=s;
  const tr=(Math.sqrt(8*v+1)-1)/2;if(Number.isInteger(tr))fact.triangular_index=tr;
  const cu=Math.round(Math.cbrt(v));if(cu**3===v)fact.cube_root=cu;
  if(Object.keys(fact).length)facts[key]=fact;
  // A perfect power is retained only with an internal witness word under the SAME method.
  for(let i=0;i<n;i++)for(const exponent of [2,3])if(ws[i]>1&&ws[i]**exponent===v)add('internal_word_power',key,`${v} = ${ws[i]}^${exponent}`,{total:v,word_index:i+1,word:row.words[i],word_value:ws[i],exponent});
  // Reversed prime factors: exact factorization, e.g. 37 × 73, not arbitrary composite factors.
  for(let p=2;p*p<=v&&p<=10000;p++)if(prime[p]&&v%p===0){let q=v/p;if(q<=MAXPRIME&&prime[q]&&p!==q&&String(p).split('').reverse().join('')===String(q))add('reversed_prime_factors',key,`${v} = ${p} × ${q}`,{total:v,factors:[p,q],prime_indices:[primeIndex[p],primeIndex[q]]})}
  const pref=[0];ws.forEach(x=>pref.push(pref.at(-1)+x));
  if(n>=5&&n%2===1){const mid=(n-1)/2,l=pref[mid],c=ws[mid],r=v-pref[mid+1],diff=l-r;
   if(l>0&&r>0&&diff===0)add('symmetric_center_balance',key,`${l} | ${c} | ${r}; ${l} − ${r} = 0`,{left_words:[1,mid],center_word:mid+1,center:row.words[mid],right_words:[mid+2,n],left:l,center_value:c,right:r});
   if(l>0&&r>0&&diff!==0)for(const [kind,target] of Object.entries(positions))if(Math.abs(diff)===target)add('symmetric_difference_position',key,`${l} − ${r} = ${diff}; |difference| = ${kind} = ${target}`,{left_words:[1,mid],center_word:mid+1,center:row.words[mid],right_words:[mid+2,n],left:l,center_value:c,right:r,difference:diff,position:kind,target});
   if(c>=10&&Math.abs(diff)>=10&&String(c).split('').reverse().join('')===String(Math.abs(diff))&&c!==Math.abs(diff))add('center_difference_digit_mirror',key,`${l} | ${c} | ${r}; ${l} − ${r} = ${diff}`,{center_word:mid+1,center:row.words[mid],left:l,center_value:c,right:r,difference:diff});
  }
  for(let k=2;k<=n-2;k++)if(pref[k]>0&&pref[k]*2===v)add('contiguous_equal_partition',key,`${pref[k]} = ${v-pref[k]}`,{left_words:[1,k],right_words:[k+1,n],left:pref[k],right:v-pref[k]});
  if(n>=4&&ws.every((x,i)=>x===ws[n-1-i])&&new Set(row.words).size>1)add('word_value_palindrome',key,ws.join(' | '),{word_values:ws});
  if(fact.prime_index){
   for(const [kind,target] of Object.entries(positions))if(fact.prime_index===target)add('prime_index_position',key,`prime_index(${v}) = ${target} = ${kind}`,{total:v,index:target,position:kind});
   for(let k=1;k<=Math.floor(n/2);k++)if(pref[k]===fact.prime_index)add('prime_index_opening',key,`prime_index(${v}) = ${fact.prime_index} = opening words 1…${k}`,{total:v,index:fact.prime_index,opening_words:[1,k],opening_value:pref[k]});
  }
  for(const [kind,target] of Object.entries(positions))if(v===target**2&&target>1)add('position_square',key,`${v} = ${target}² = ${kind}²`,{total:v,position:kind,target});
 }
 // Corpus numeric correspondences are searchable leads, never sufficient successes.
 const matches=[];for(const [key,r] of Object.entries(raw)){const ids=corpusIndex.get(String(resultNumber(r)));if(ids)matches.push({method:key,value:resultNumber(r),corpus_entry_ids:ids})}
 // No blanket 'requires review' for textual ketiv/qere: fixed ketiv computations remain verified.
 // A concrete historical claim needs review if the frozen wording gives a different result.
 if(row.book==='Exod'&&row.chapter===1){const expected=[3161,807,1083,1144,2450,981,3259,2211,1727,3316,5465,2808,1784,4163,5040,3845,4338,3805,5290,1237,2172,3025][row.verse-1];if(raw.regular.total!==expected)pending.push({type:'historical_source_discrepancy',method:'regular',expected,actual:raw.regular.total,source:'research/rovgrid-exodus-chapter-1-complete-audit-2026-11-08.md',status:'דורש בדיקה'})}
 if(row.ref==='Gen.1.1')for(const key of ['miluiTalmudic','miluiGenesis74']){const value=raw[key].total;assert.equal(value,74**2);add('historical_milui_square',key,'5476 = 74² = (37 + 37)²',{value,root:74,source:'calculator.html / fixed profile'})}
 return {findings:hits,pending,numeric_facts:facts,corpus_matches:matches,status:hits.length?'נמצא':pending.length?'דורש בדיקה':'לא מצאתי'};
}
const checkpointFile=D+'/checkpoint.json';let completed=0;
if(fs.existsSync(checkpointFile)&&!process.argv.includes('--restart')){let c=JSON.parse(fs.readFileSync(checkpointFile));assert.equal(c.engine_blob,E.blob);completed=c.completed_verses}
let index=[],chapterResults=[],currentChapter=null,chapterFirst=0;
if(completed){const files=fs.readdirSync(D+'/chapters').filter(f=>f.endsWith('.summary.json'));for(const f of files)index.push(...JSON.parse(fs.readFileSync(D+'/chapters/'+f)).verses);index.sort((a,b)=>a.torah_index-b.torah_index);assert.equal(index.length,completed)}
const limit=Number(process.env.TORAH_STOP_AFTER||source.length);
function flush(next){if(!chapterResults.length)return;
 const ch=currentChapter,rows=chapterResults;write(`chapters/${ch}.json.gz`,rows,true);
 const summaries=rows.map(r=>({ref:r.ref,book:r.book,book_he:r.book_he,chapter:r.chapter,verse:r.verse,torah_index:r.torah_index,book_index:r.book_index,text:r.text,word_count:r.words.length,letters:r.letters,status:r.status,findings:r.findings,pending:r.pending,totals:Object.fromEntries(Object.entries(r.raw).map(([k,v])=>[k,resultNumber(v)]))}));
 write(`chapters/${ch}.summary.json`,{chapter:ch,first:rows[0].ref,last:rows.at(-1).ref,verse_count:rows.length,verses:summaries});index.push(...summaries);
 completed+=rows.length;write('checkpoint.json',{engine_commit:E.commit,engine_blob:E.blob,source_commit:manifest.commit,completed_verses:completed,last_completed:rows.at(-1).ref,next_verse:next?.ref||null,coverage_complete:completed===source.length,chapter_file:`chapters/${ch}.json.gz`});
 if(!next||next.book!==rows[0].book){const b=manifest.books.find(b=>b.book===rows[0].book),br=index.filter(r=>r.book===b.book);assert.equal(br.length,b.verses);for(let c=1;c<=b.chapter_counts.length;c++)assert.equal(br.filter(r=>r.chapter===c).length,b.chapter_counts[c-1]);write(`book-checkpoints/${b.book}.json`,{book:b.book,expected:b.verses,completed:br.length,missing:[],last_completed:rows.at(-1).ref,next_verse:next?.ref||null})}
 console.log(json({chapter:ch,completed,total:source.length,findings:rows.reduce((s,r)=>s+r.findings.length,0),next:next?.ref||null}));chapterResults=[];
}
for(let i=completed;i<source.length&&i<limit;i++){
 const row=source[i],ch=row.book+'.'+String(row.chapter).padStart(2,'0');
 if(currentChapter&&ch!==currentChapter)flush(row);currentChapter=ch;
 const results=Object.fromEntries(methods.map(m=>[m.key,E.calculate(row.text,'he',m)]));
 const raw=Object.fromEntries(Object.entries(results).map(([k,r])=>[k,compact(r)]));Object.assign(raw,extra(row.text));
 const wordTotals=row.words.map(w=>totalsFor(w));
 const intervals=intervalsFor(row,results,wordTotals);
 const analysis=analyze(row,raw,wordTotals,intervals);
 const alternate={maqqef:row.maqqef_text===row.text?{same_as:'primary'}:{text:row.maqqef_text,totals:totalsFor(row.maqqef_text)},boundaryless:{text:E.boundaryless(row.text),totals:totalsFor(E.boundaryless(row.text))},openFinals:{text:E.openFinals(row.text),totals:totalsFor(E.openFinals(row.text))}};
 const record={...row,...analysis,scan_complete:true,raw,word_totals:wordTotals,intervals,alternate,scan_policy:'v1 structural detectors; no exhaustive claim about all possible mathematical identities'};
 chapterResults.push(record);
 // Persistent per-verse journal precedes advancing; chapter gzip is the committed durable unit.
 fs.appendFileSync(D+'/verse-journal.jsonl',json({ref:row.ref,completed:true,record_sha256:crypto.createHash('sha256').update(json(record)).digest('hex')})+'\n');
 if(i===source.length-1||i===limit-1)flush(source[i+1]);
}
write('index.json.gz',{schema:'rovgrid-torah-map-v1',names,verses:index},true);
const counts=Object.fromEntries(['נמצא','לא מצאתי','דורש בדיקה'].map(s=>[s,index.filter(r=>r.status===s).length]));
const summary={engine_commit:E.commit,engine_blob:E.blob,source_commit:manifest.commit,registered_methods:methods.length,total_result_channels:Object.keys(names).length,expected_verses:source.length,completed_verses:index.length,coverage_complete:index.length===source.length,counts,findings:index.reduce((s,r)=>s+r.findings.length,0),pending_findings:index.reduce((s,r)=>s+r.pending.length,0),books:manifest.books.map(b=>({book:b.book,book_he:b.book_he,expected:b.verses,completed:index.filter(r=>r.book===b.book).length})),next_verse:source[index.length]?.ref||null};
write('summary.json',summary);console.log(json(summary));
