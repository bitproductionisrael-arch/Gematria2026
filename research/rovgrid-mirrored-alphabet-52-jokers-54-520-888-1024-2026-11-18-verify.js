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


/* Extended ALM / mirror / π checks from original calculator mappings. */
const D_ABC='ABCDEFGHIJKLMNOPQRSTUVWXYZ',D_ix=c=>D_ABC.indexOf(c);
const D_seq=['ALM','BCDEFGHIJK','NOPQRSTUVWXYZ','ZYXWVUTSRQPON','KJIHGFEDCB','MLA'];
const D_tier=i=>i<9?i+1:i<18?(i-8)*10:(i-17)*100;
const D_agr=[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500];
const D_pi='14159265358979323846264338';
const D_funcs={
 simple:i=>i+1,regular:D_tier,reduced:i=>i%9+1,jewish:i=>D_agr[i],jewishSmall:i=>1+(D_agr[i]-1)%9,
 atbashSimple:i=>26-i,atbashRegular:i=>D_tier(25-i),rot13Regular:i=>D_tier((i+13)%26),avgadRegular:i=>D_tier((i+1)%26),
 peratiSimple:i=>(i+1)**2,peratiRegular:i=>D_tier(i)**2,peratiJewish:i=>D_agr[i]**2,
 kidmi:i=>Array.from({length:i+1},(_,j)=>D_tier(j)).reduce((a,b)=>a+b,0),pi:i=>Number(D_pi[i])
};
const D_expected={
 simple:[26,65,260,260,65,26],regular:[71,74,3950,3950,74,71],reduced:[8,47,71,71,47,8],
 jewish:[51,654,3490,3490,654,51],jewishSmall:[6,51,70,70,51,6],
 atbashSimple:[55,205,91,91,205,55],atbashRegular:[910,3040,145,145,3040,910],
 rot13Regular:[1550,2400,145,145,2400,1550],avgadRegular:[92,102,3901,3901,102,92],
 peratiSimple:[314,505,5382,5382,505,314],peratiRegular:[2501,784,2065500,2065500,784,2501],
 peratiJewish:[1301,360384,1877100,1877100,360384,1301],kidmi:[251,294,17635,17635,294,251],
 pi:[17,48,61,61,48,17]
};
const D_sum=(s,f)=>[...s].reduce((acc,ch)=>acc+f(D_ix(ch)),0);
for(const [method,fn] of Object.entries(D_funcs)){
 assert.deepEqual(D_seq.map(s=>D_sum(s,fn)),D_expected[method],method);
}
const D_pairs=['AL','BK','CJ','DI','EH','FG'];
for(const pair of D_pairs)assert.equal(D_sum(pair,D_funcs.simple),13);
assert.deepEqual(D_pairs.map(x=>D_sum(x+'M',D_funcs.peratiSimple)),[314,294,278,266,258,254]);
assert.equal(260-91,13**2);
assert.equal(520-182,2*13**2);
assert.equal(D_sum('JOKER',D_funcs.simple),59);
assert.equal(37+59+73,169);
assert.equal(91+37+59+73,260);
assert.equal(65+61,3**2+6**2+9**2);
assert.equal(71+74+3950,2**12-1);
const D_build=s=>[...s].reduce((v,ch,i)=>v+(s.length-i)*(D_ix(ch)+1),0);
assert.deepEqual(D_seq.map(D_build),[40,275,1638,2002,440,64]);
assert.equal(D_build('ALM')+D_build('MLA'),4*26);
assert.equal(D_build('BCDEFGHIJK')+D_build('KJIHGFEDCB'),11*65);
assert.equal(D_build('NOPQRSTUVWXYZ')+D_build('ZYXWVUTSRQPON'),14*260);

console.log('PASS: all mirrored-alphabet, gematria, cuboid, and closure assertions');
