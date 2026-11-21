// Research-only candidate; NOT prime-proven. RovGrid/Gematria2026 2026-11-21
// node research/rovgrid-world-record-37-unproved-41024322-digits-sieve-2026-11-21.js
'use strict';
const assert = require('node:assert/strict');
const NEXP = 136279842, K=9, BOUND=1000000;
function powmod2(exp,mod){
 let out=1, base=2%mod;
 while(exp>0){
  if(exp%2)out=(out*base)%mod;
  base=(base*base)%mod;exp=Math.floor(exp/2);
 }
 return out;
}
const sieve=new Uint8Array(BOUND).fill(1);
sieve[0]=0;sieve[1]=0;
for(let p=2;p*p<BOUND;p++)if(sieve[p])
 for(let k=p*p;k<BOUND;k+=p)sieve[k]=0;
let tested=0;
for(let p=2;p<BOUND;p++)if(sieve[p]){
 tested++;
 assert.notEqual((K*powmod2(NEXP,p)+1)%p,0,'COMPOSITE: small divisor '+p);
}
assert.equal(tested,78498);
assert.equal((K*powmod2(NEXP,100)+1)%100,37);
const digits=Math.floor(NEXP*Math.log10(2)+Math.log10(K))+1;
assert.equal(digits,41024322); // decimal.Decimal confirmed at 70-digit precision independently
console.log('UNPROVED candidate:',K+' × 2^'+NEXP+' + 1');
console.log('Digits:',digits,'last two: 37, small primes excluded below 1,000,000:',tested);
console.log('NOT PROVEN PRIME; NOT A WORLD RECORD.');
