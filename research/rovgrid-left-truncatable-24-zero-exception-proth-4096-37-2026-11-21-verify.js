// RovGrid prime/truncation proof registry — 2026-11-21
// Run: node research/rovgrid-left-truncatable-24-zero-exception-proth-4096-37-2026-11-21-verify.js
'use strict';
const assert = require('node:assert/strict');
const powmod=(a,b,m)=>{let v=1n; a%=m; while(b>0n){if(b&1n)v=v*a%m; a=a*a%m;b>>=1n;}return v;};
const gcd=(a,b)=>{while(b){[a,b]=[b,a%b];}return a;};
const P=BigInt('357686312646216567629137');
const pstr=P.toString();
const digitSum=[...pstr].reduce((a,d)=>a+Number(d),0);
assert.equal(pstr.length,24);
assert.equal(digitSum,112);
assert.equal(24+112,136);
assert.equal(24*37,888);
assert.equal(136+888,1024);
assert.deepEqual([pstr.slice(-3),pstr.slice(-2),pstr.slice(-1)],['137','37','7']);
// Deterministic MR for n < 3317044064679887385961981; the largest input is P.
const MR_BOUND=3317044064679887385961981n;
const BASES=[2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n,41n];
function knownRangePrime(n){
 assert(n<MR_BOUND);
 if(n<2n)return false;
 for(const a of BASES){if(n===a)return true;if(n%a===0n)return false;}
 let d=n-1n, s=0;while((d&1n)===0n){d/=2n;s++;}
 for(const a of BASES){
  let x=powmod(a,d,n);
  if(x===1n||x===n-1n)continue;
  let ok=false;
  for(let r=1;r<s;r++){x=x*x%n;if(x===n-1n){ok=true;break;}}
  if(!ok)return false;
 }
 return true;
}
for(let i=0;i<pstr.length;i++)assert(knownRangePrime(BigInt(pstr.slice(i))), 'left suffix '+i);
assert(!pstr.includes('0'));
// Lucas full factorization certificate for the zero-allowed 26-digit extension.
const Q=3n*10n**25n+137n;
assert.equal(Q.toString(),'30000000000000000000000137');
assert.equal(Q.toString().length,26);
const fact=[[2n,3,3n],[269n,1,2n],[6997n,1,2n],[6911087n,1,2n],[288284142287n,1,2n]];
function primeByTrial(n){if(n<2n)return false;for(let d=2n;d*d<=n;d+=(d===2n?1n:2n))if(n%d===0n)return false;return true;}
let product=1n;
for(const [q,e,a] of fact){
 assert(primeByTrial(q),'factor q prime');
 product*=q**BigInt(e);
 assert.equal(powmod(a,Q-1n,Q),1n);
 assert.equal(gcd(powmod(a,(Q-1n)/q,Q)-1n,Q),1n);
}
assert.equal(product,Q-1n);
const qs=Q.toString();
for(let i=1;i<qs.length;i++)assert([137n,37n,7n].includes(BigInt(qs.slice(i))));
// Proth primality certificate for a 1238-digit prime ending in 37.
const K=94651n, EXP=4096n, R=K*2n**EXP+1n;
assert(K%2n===1n&&K>0n&&K<2n**EXP);
assert.equal(powmod(3n,(R-1n)/2n,R),R-1n);
assert.equal(R%100n,37n);
assert.equal(R.toString().length,1238);
assert.equal(R.toString().slice(-40),'2286602759377666359449127498947269492737');
console.log('PASS: 24 deterministic suffixes; Lucas 26-digit prime; Proth 1238-digit prime; 136/888/1024');
