// RovGrid: 2026-11-21 certified twin-prime 9437/9439 from star S8=337.
// Run: node research/rovgrid-algebraic-primality-jsww-pocklington-star8-9437-9439-2026-11-21-verify.js
'use strict';
const assert=require('node:assert/strict');
const big=x=>BigInt(x);
const gcd=(a,b)=>{while(b){[a,b]=[b,a%b];}return a<0n?-a:a;};
const powmod=(a,b,n)=>{let v=1n;a%=n;while(b>0n){if(b&1n)v=v*a%n;a=a*a%n;b>>=1n;}return v;};
const primeTrial=n=>{if(n<2n)return false;for(let d=2n;d*d<=n;d++)if(n%d===0n)return false;return true;};
function provePocklington(n, F, primes, base){
 assert.equal((n-1n)%F,0n,'F must divide n-1');
 assert(F*F>n,'F > sqrt(n)');
 let remaining=F;
 for(const q of primes){
  assert(primeTrial(q),'q must be proven prime');
  assert.equal(remaining%q,0n,'q must divide F');
  while(remaining%q===0n)remaining/=q;
  assert.equal(powmod(base,n-1n,n),1n,'Fermat condition');
  const z=powmod(base,(n-1n)/q,n);
  assert.equal(gcd(z-1n,n),1n,'Pocklington gcd');
 }
 assert.equal(remaining,1n,'complete factorization of F');
 return true;
}
const star=n=>6n*BigInt(n)*(BigInt(n)-1n)+1n;
const S8=star(8);
assert.equal(S8,337n);
assert(primeTrial(S8));
const P=28n*S8+1n, Q=P+2n;
assert.equal(P,9437n);assert.equal(Q,9439n);
assert.equal(P%100n,37n);
assert.equal(Q%100n,39n);
assert.equal((P-1n)/S8,28n);
assert.equal(powmod(2n,P-1n,P),1n);
assert.equal(powmod(2n,28n,P),9428n);
assert(provePocklington(P,337n,[337n],2n));
const F=11n*11n*13n;
assert.equal(F,1573n);
assert.equal((Q-1n)/F,6n);
assert.equal(powmod(2n,Q-1n,Q),1n);
assert.equal(powmod(2n,(Q-1n)/11n,Q),6468n);
assert.equal(powmod(2n,(Q-1n)/13n,Q),4139n);
assert(provePocklington(Q,F,[11n,13n],2n));
assert.equal((28n*star(8)+1n)+2n,Q);
console.log('PASS: S8=337 prime by trial; Pocklington certifies 9437,9439; gap 2 and ending 37');
