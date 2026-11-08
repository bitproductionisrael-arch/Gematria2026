'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),E=require('./engine.cjs');
const rows=JSON.parse(fs.readFileSync(__dirname+'/source/verses.json'));
const get=ref=>rows.find(r=>r.ref===ref),calc=(t,k)=>E.calculate(t,'he',E.METHODS.he.find(m=>m.key===k));
const independentMap={};const letters=Array.from('אבגדהוזחטיכלמנסעפצקרשת');
letters.forEach((x,i)=>independentMap[x]=[i<9?i+1:i<18?(i-8)*10:(i-17)*100,i+1,i%9+1]);
for(const [x,y] of Object.entries({'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'}))independentMap[x]=independentMap[y];
function independent(t,i){return [...t].reduce((s,c)=>s+(independentMap[c]?.[i]||0),0)}
const tests=[];
const a=get('Gen.1.1');assert.equal(calc(a.text,'regular').total,2701);assert.equal(37*73,2701);tests.push({ref:a.ref,text:a.text,method:'regular',value:2701,equation:'2701 = 37 × 73'});
for(const [ref,l,c,r] of [['Gen.1.27',222,41,195],['Gen.4.19',208,34,208],['Exod.34.10',608,37,535]]){
 const row=get(ref),w=row.words,i=(w.length-1)/2;assert.ok(Number.isInteger(i));
 const texts=[w.slice(0,i).join(' '),w[i],w.slice(i+1).join(' ')];
 const values=texts.map(t=>calc(t,'ordinal').total);assert.deepEqual(values,[l,c,r]);
 texts.forEach((t,j)=>assert.equal(independent(t,1),values[j]));
 tests.push({ref,text:row.text,word_count:w.length,method:'ordinal',parts:texts,values,difference:l-r});
}
assert.equal(get('Exod.34.10').words.length,33);
for(const [k,v] of Object.entries({wordReduced:37,wordReducedFinals:32,reduced:82,smallFinals:86,milui:5506,miluiTalmudic:5476,miluiLegacy:5497}))assert.equal(calc(a.text,k).total,v);
assert.equal(calc('אלף','letterProductRegular').total,2400);assert.equal(calc('א לף','letterProductRegular').total,2400);
assert.equal(calc('אלף','letterDivisionRegular').exactFraction,'1/2400');
assert.equal(calc('עמית','harmonicHalf').total,26);
assert.equal(calc('א','homePower_root37').total,0);
assert.equal(calc('ם','homePower_pi').total,calc('מ','homePower_pi').total);
assert.equal(calc('ך','final').total,500);assert.equal(calc('ך','ordinal').total,11);
// Every Torah verse independently validates three foundational maps, letter counts and tokenization.
for(const row of rows)for(const [i,k] of ['regular','ordinal','reduced'].entries())assert.equal(calc(row.text,k).total,independent(row.text,i),row.ref+' '+k);
// Every registered method: alphabet coverage, both word boundaries, raw output and determinism.
for(const m of E.METHODS.he){
 for(const t of ['אבגדהוזחטיכלמנסעפצקרשתךםןףץ','אב גד','א־ב גד','א ב','מים מם',a.text]){
  const r=E.calculate(t,'he',m);assert.ok(r.total!==undefined);assert.deepEqual(E.calculate(t,'he',m),r);
 }
}
const result={passed:true,engine_blob:E.blob,registered_hebrew_methods:E.METHODS.he.length,independent_full_torah_base_checks:rows.length*3,examples:tests};
fs.writeFileSync(__dirname+'/validation.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
