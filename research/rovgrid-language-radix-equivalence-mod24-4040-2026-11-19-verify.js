'use strict';
const assert = require('node:assert/strict');
const digits=(n,b)=>{assert(Number.isInteger(n)&&n>=0&&Number.isInteger(b)&&b>=2);if(n===0)return [0];const a=[];while(n){a.push(n%b);n=Math.floor(n/b);}return a.reverse();};
const decode=(a,b)=>a.reduce((n,d)=>n*b+d,0);
const decimalRead=a=>a.every(x=>x<=9)?Number(a.join('')):null;
const bases={10:[5,2,0],12:[3,7,4],13:[3,1,0],16:[2,0,8],20:[1,6,0],5:[4,0,4,0]};
for(const [b,expected] of Object.entries(bases)){assert.deepEqual(digits(520,Number(b)),expected);assert.equal(decode(expected,Number(b)),520);}
assert.deepEqual(digits(888,6),[4,0,4,0]);
for(let b=5;b<=50;b++)assert.equal(decode([4,0,4,0],b),4*b**3+4*b);
assert.deepEqual([5,6,7,8].map(b=>decode([4,0,4,0],b)),[520,888,1400,2080]);
const parts=[520,160,208];const english=[136,1024];
assert.deepEqual([...parts,...english].map(n=>n%24),[16,16,16,16,16]);
assert.deepEqual([...parts,...english].map(n=>(n-16)/24),[21,6,8,5,42]);
assert.equal(parts.reduce((a,b)=>a+b,0),888);
assert.equal(21+6+8+2,37);
assert.equal(42-5,37);
assert.equal(1024-136,888);
assert.equal(24*37,888);
assert.equal(24*(21+6+8)+3*16,888);
assert.equal(310,70+40+200);
assert.deepEqual(digits(310,16),[1,3,6]);
assert.deepEqual(digits(136,16),[8,8]);
assert.equal(decimalRead(digits(520,12)),374);
assert.equal(decimalRead(digits(520,13)),310);
let sols=[];
for(let N=1;N<=888;N++){
 const s16=decimalRead(digits(N,16)); const s20=decimalRead(digits(N,20));
 if(s16!==null&&s20!==null && N+s16+s20===888)sols.push([N,s16,s20]);
}
assert.deepEqual(sols,[[520,208,160]]);
assert.equal(decode(digits(520,10),10)+decode(digits(520,16),16)+decode(digits(520,20),20),1560);
assert.equal(decimalRead(digits(520,10))+decimalRead(digits(520,16))+decimalRead(digits(520,20)),888);
console.log('PASS | 520 radix5/10/12/13/16/20, 4040 base5→6, mod24 invariant, sole 1..888 decimal-read solution');
