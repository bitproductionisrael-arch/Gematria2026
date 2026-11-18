/* RovGrid mirrored English alphabet 52 + two zeros; verification 2026-11-18.
   No dependence on external libraries; run: node this-file.js */
const assert=require('node:assert/strict');
const codes=Array.from({length:26},(_,i)=>i+1);
const sequence=[...codes,...codes.slice().reverse()];
const groups=[0,13,26,39].map(i=>sequence.slice(i,i+13).reduce((a,b)=>a+b,0));
assert.deepEqual(groups,[91,260,260,91]);
const sum=a=>a.reduce((x,y)=>x+y,0);
assert.equal(sum(sequence.slice(13,39)),520);
assert.equal(sum(sequence.slice(0,13))+sum(sequence.slice(39)),182);
assert.equal(sum(sequence),702);
assert.equal(sum(sequence.slice(0,26)),351);
assert.equal(sum([...codes,...codes].slice(13,39)),351);
const padded=[0,...sequence,0];
assert.equal(padded.length,54);
assert.equal(sum(padded),702);
const abc=3+6+9;
assert.equal(abc,18);
assert.deepEqual([0,1,2,3].map(k=>91-k*abc),[91,73,55,37]);
const ordinal=s=>[...s.toUpperCase()].reduce((a,ch)=>a+(/[A-Z]/.test(ch)?ch.charCodeAt(0)-64:0),0);
const ab=s=>[...s.toUpperCase()].map(ch=>/[A-Z]/.test(ch)?String.fromCharCode(91-(ch.charCodeAt(0)-64)):'').join('');
for(const [w,s,aw,as] of [['AMIT',43,'ZNRG',65],['ROV',55,'ILE',26],['MIKE',38,'NRPV',70],['JOKER',59,'QLPVI',76]]){
  assert.equal(ordinal(w),s,w);assert.equal(ab(w),aw,w);assert.equal(ordinal(ab(w)),as,w);
}
assert.equal(ordinal(ab('AMIT ROV')),91);
assert.equal(ordinal('AMIT MIKE ROV'),136);
assert.equal(ordinal(ab('AMIT MIKE ROV')),161);
assert.equal(65*8,520);assert.equal(26*8,208);assert.notEqual(70*8,160);
const c=26,b=520/26,a=54-b-c;
assert.deepEqual([a,b,c],[8,20,26]);
assert.equal(a+b+c,54);
assert.equal(a*b+a*c+b*c,888);
assert.equal(a*b*c,4160);
assert.equal(2*8**3,1024);
assert.equal((16*17)/2,136);
assert.equal(888+136,1024);
assert.equal(52**2,2704);
assert.equal(52**2-3,37*73);
assert.equal(24*37,888);

const q26=[1,12,13],q65=Array.from({length:10},(_,i)=>i+2),q260=Array.from({length:13},(_,i)=>i+14);
assert.deepEqual([sum(q26),sum(q65),sum(q260)],[26,65,260]);
assert.deepEqual([...q26,...q65,...q260].sort((a,b)=>a-b),codes);
assert.equal(sum([26,65,260,260,65,26]),702);
assert.equal((26+65+260)/27,13);
assert.equal((2*(26+65+260))/54,13);
assert.deepEqual([26+26,65+65,260+260],[52,130,520]);
assert.equal(26+65,91);
assert.equal(2*91,182);
assert.equal(2*10*26,520);
for(let n=1;n<100;n++){
 const sumOfMirrored=n*(n+1);
 assert.equal(sumOfMirrored/(2*n+2),n/2);
}

console.log('PASS: all mirrored-alphabet, gematria, cuboid, and closure assertions');
