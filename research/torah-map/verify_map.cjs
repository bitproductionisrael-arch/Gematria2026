'use strict';
const fs=require('node:fs'),zlib=require('node:zlib'),assert=require('node:assert/strict'),crypto=require('node:crypto'),E=require('./engine.cjs');
const D=__dirname,source=JSON.parse(fs.readFileSync(D+'/source/verses.json')),manifest=JSON.parse(fs.readFileSync(D+'/source/manifest.json'));
const index=JSON.parse(zlib.gunzipSync(fs.readFileSync(D+'/index.json.gz'))).verses;
assert.equal(index.length,source.length);let seen=[],findings=0,intervalChecks=0,rawChecks=0,spanValues=0,wordValues=0;const hashes=[];
const calc=(text,key)=>E.calculate(text,'he',E.METHODS.he.find(m=>m.key===key));
const val=r=>r.exactFraction||r.total;
for(const book of manifest.books){let bookCount=0;for(let c=1;c<=book.chapter_counts.length;c++){
 const file=`chapters/${book.book}.${String(c).padStart(2,'0')}.json.gz`,bytes=fs.readFileSync(D+'/'+file),rows=JSON.parse(zlib.gunzipSync(bytes));
 assert.equal(rows.length,book.chapter_counts[c-1]);hashes.push({file,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
 for(const r of rows){
  const src=source[seen.length],idx=index[seen.length];assert.equal(r.ref,src.ref);assert.equal(idx.ref,r.ref);assert.equal(r.text,src.text);assert.equal(r.scan_complete,true);seen.push(r.ref);bookCount++;
  assert.equal(r.status,r.findings.length?'נמצא':r.pending.length?'דורש בדיקה':'לא מצאתי');assert.equal(Object.keys(r.raw).length,70);assert.equal(r.word_totals.length,r.words.length);assert.equal(Object.keys(r.intervals).length,57);
  const n=r.words.length;let spans=[];for(let i=0;i<n;i++)for(let j=i+1;j<=n;j++)spans.push([i,j]);
  for(const m of E.METHODS.he){
   const direct=calc(r.text,m.key);assert.equal(val(direct),val(r.raw[m.key]),r.ref+' raw '+m.key);assert.equal(idx.totals[m.key],val(direct));rawChecks++;
   assert.equal(r.intervals[m.key].length,n*(n+1)/2);spanValues+=spans.length;wordValues+=n;
   const which=(r.torah_index*17+m.key.length*13)%spans.length,[a,b]=spans[which];assert.equal(r.intervals[m.key][which],val(calc(r.words.slice(a,b).join(' '),m.key)),r.ref+' interval '+m.key);intervalChecks++;
  }
  for(const h of r.findings){
   const ev=h.evidence,key=h.method,v=r.raw[key].total;
   if(h.type==='reversed_prime_factors'){assert.equal(ev.factors[0]*ev.factors[1],v);assert.equal(String(ev.factors[0]).split('').reverse().join(''),String(ev.factors[1]));for(const p of ev.factors){for(let d=2;d*d<=p;d++)assert.notEqual(p%d,0)}}
   else if(h.type==='internal_word_power'){assert.equal(calc(r.words[ev.word_index-1],key).total**ev.exponent,v)}
   else if(h.type==='symmetric_center_balance'||h.type==='symmetric_difference_position'||h.type==='center_difference_digit_mirror'){
    const mid=(n-1)/2,l=calc(r.words.slice(0,mid).join(' '),key).total,rr=calc(r.words.slice(mid+1).join(' '),key).total,cc=calc(r.words[mid],key).total;assert.equal(l,ev.left);assert.equal(rr,ev.right);assert.equal(cc,ev.center_value);
    if(h.type==='symmetric_center_balance')assert.equal(l,rr);else if(h.type==='symmetric_difference_position')assert.equal(Math.abs(l-rr),ev.target);else assert.equal(String(cc).split('').reverse().join(''),String(Math.abs(l-rr)));
   }else if(h.type==='contiguous_equal_partition'){const k=ev.left_words[1];assert.equal(calc(r.words.slice(0,k).join(' '),key).total,calc(r.words.slice(k).join(' '),key).total)}
   else if(h.type==='word_value_palindrome'){assert.deepEqual(ev.word_values,[...ev.word_values].reverse())}
   else if(h.type==='position_square')assert.equal(ev.target**2,v);
   else if(h.type==='historical_milui_square')assert.equal(ev.root**2,v);
   else if(h.type==='prime_index_opening'){assert.equal(calc(r.words.slice(0,ev.opening_words[1]).join(' '),key).total,ev.index)}
   else assert.equal(h.type,'prime_index_position');
   findings++;
  }
 }
 }
 assert.equal(bookCount,book.verses);
}
assert.deepEqual(seen,source.map(r=>r.ref));assert.equal(new Set(seen).size,source.length);
assert.equal(index.find(r=>r.ref==='Gen.1.1').totals.regular,2701);
for(const [ref,type] of [['Gen.1.27','symmetric_difference_position'],['Gen.4.19','symmetric_center_balance'],['Exod.34.10','center_difference_digit_mirror']])assert.ok(index.find(r=>r.ref===ref).findings.some(h=>h.type===type&&h.method==='ordinal'));
const out={passed:true,verse_count:seen.length,chapter_count:hashes.length,missing:[],duplicates:[],first:seen[0],last:seen.at(-1),raw_total_rechecks:rawChecks,independent_engine_interval_rechecks:intervalChecks,stored_interval_values:spanValues,stored_word_values:wordValues,verified_findings:findings,engine_blob:E.blob,chapter_hashes:hashes};fs.writeFileSync(D+'/coverage-audit.json',JSON.stringify(out,null,2));console.log(JSON.stringify({...out,chapter_hashes:undefined}));
