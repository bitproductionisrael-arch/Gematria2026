// RovGrid: exhaustive left-truncatable primes + 136/888/1024 bridge.
// Run: node research/rovgrid-left-truncatable-prime-24-37-137-136-888-1024-2026-11-21-verify.js
// Uses a deterministic Miller-Rabin witness set for n < 3317044064679887385961981.
// Source for bound: OEIS A014233 / Sorenson-Webster; cf. Magma prime handbook.
'use strict';
const assert = require('node:assert/strict');
const NUMBER = '357686312646216567629137';
const BOUND = 3317044064679887385961981n;
const bases = [2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n,41n];
function powmod(a,e,m) {
  let r=1n;
  a%=m;
  while(e>0n) {if(e&1n) r=r*a%m; a=a*a%m; e>>=1n;}
  return r;
}
function isPrime(n) {
  if(n<2n) return false;
  if(n>=BOUND) throw new Error('Outside the cited deterministic bound: '+n);
  for(const p of bases) {if(n===p) return true; if(n%p===0n) return false;}
  let d=n-1n, s=0;
  while((d&1n)===0n){d>>=1n; s++;}
  for(const a of bases) {
    let x=powmod(a,d,n);
    if(x===1n || x===n-1n) continue;
    let passed=false;
    for(let i=1;i<s;i++){x=x*x%n; if(x===n-1n){passed=true; break;}}
    if(!passed) return false;
  }
  return true;
}
const digitSum=s=>[...s].reduce((sum,x)=>sum+Number(x),0);
assert.equal(NUMBER.length,24);
assert.equal(digitSum(NUMBER),112);
for(let k=0;k<24;k++) assert.ok(isPrime(BigInt(NUMBER.slice(k))),'nonprime suffix at index '+k);
assert.equal(NUMBER.slice(-3),'137');
assert.equal(NUMBER.slice(-2),'37');
assert.equal(NUMBER.slice(-1),'7');
assert.equal(digitSum(NUMBER.slice(-16)),73);
assert.equal(digitSum(NUMBER.slice(-13)),61);
assert.equal(digitSum(NUMBER.slice(-6)),28);
assert.equal(NUMBER.match(/.{1,3}/g).join('|'),'357|686|312|646|216|567|629|137');
assert.equal(24+112,136);
assert.equal(24*37,888);
assert.equal((24+112)+(24*37),1024);
assert.equal(8*20+8*26+20*26,888);
assert.equal(128*8,1024);
// Enumerate every non-zero-digit left-truncatable prime through length 24.
let level=[2n,3n,5n,7n], total=level.length;
const counts=[level.length];
for(let depth=2;depth<=24;depth++) {
  const next=[];
  for(const n of level){
    const scale=10n**BigInt(String(n).length);
    for(let digit=1n;digit<=9n;digit++){
      const candidate=digit*scale+n;
      if(isPrime(candidate)) next.push(candidate);
    }
  }
  counts.push(next.length);total+=next.length;level=next;
}
const expected=[4,11,39,99,192,326,429,521,545,517,448,354,276,212,117,72,42,24,13,6,5,4,3,1];
assert.deepEqual(counts,expected);
assert.equal(total,4260);
assert.deepEqual(level,[BigInt(NUMBER)]);
// The only possible length-25 descendants are obtained by prepending 1..9.
// Each has a verified small non-trivial divisor; no size-25 primality assumption.
const explicitDivisors=[229n,3n,7n,911n,3n,11n,23n,3n,47n];
for(let d=1;d<=9;d++){
  const candidate=BigInt(String(d)+NUMBER);
  assert.equal(candidate%explicitDivisors[d-1],0n,'missing composite witness: '+d);
}
const primes=[];
for(let n=2;n<=137;n++) if(isPrime(BigInt(n))) primes.push(n);
assert.equal(primes[3],7);assert.equal(primes[11],37);assert.equal(primes[20],73);assert.equal(primes[32],137);
console.log('PASS: 24 prime suffixes; exact 4260-node enumeration; unique depth 24; no depth 25.');
console.log('PASS: digit sums 112, 73, 61, 28; 24+112=136; 24x37=888; 136+888=1024.');
console.log('Level counts:',counts.join(','));
