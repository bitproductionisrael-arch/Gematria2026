// RovGrid | independent finite arithmetic verifier for ten D4-to-topology levels
// node research/rovgrid-10-levels-d4-to-genus-376-harmonic-2026-11-14-verify.js
const assert=require('node:assert/strict');
const T=n=>n*(n+1)/2;
const factors=(m,n)=>({V:m+n,E:m*n,beta:(m-1)*(n-1),genus:(m-2)*(n-2)/4});
let equalN=[];
for(let n=2;n<=512;n+=2){
  const A=(T(n)-T(n-1))/2, B=(T(n)+T(n-1))/2;
  assert.equal(A,n/2);assert.equal(B,n*n/2);
  assert.equal(A+B,T(n));
  if(A*B===4*n*n)equalN.push(n);
}
assert.deepEqual(equalN,[16]);
const A=8,B=128;const {V,E,beta,genus:g}=factors(A,B);
const F=E-V+2-2*g;
assert.equal(V,136);assert.equal(E,1024);assert.equal(beta,889);
assert.equal(g,189);assert.equal(F,512);assert.equal(4*F,2*E);
assert.equal(F-V,376);assert.equal(2*g-2,376);
assert.equal(376+136+376,888);assert.equal(47+17+47,111);
assert.equal(376/8,47);assert.equal(136/8,17);
assert.equal(376/512*100,73.4375);assert.equal(136/512*100,26.5625);
assert.equal(beta,F-1+2*g);assert.equal(F-1,511);assert.equal(2*g,378);
assert.equal(Math.sqrt(A*B),32);assert.equal(V-2,134);
const lapTrace=(B-1)*A+(A-1)*B+V;
assert.equal(lapTrace,2*E);
assert.equal((B-1)+(A-1)+1+1,V);
const exp=3*(B-1)+7*(A-1);
assert.equal(exp,430);assert.equal((V-1)+(E-V+1),E);
assert.equal(2/B,1/64);assert.equal(2/A,1/4);
assert.equal((V-1)/E,135/1024);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const phi=n=>{let ct=0;for(let k=1;k<=n;k++)if(gcd(k,n)===1)ct++;return ct;};
assert.equal(phi(888),288);assert.equal(phi(512),256);
assert.equal(phi(888)-phi(512),32);
let powerPairs=[];
for(let r=1;r<=20;r++)for(let s=r;s<=20;s++){
  if((2**r-1)*(2**s-1)===889)powerPairs.push([r,s]);
}
assert.deepEqual(powerPairs,[[3,7]]);
assert.equal(189+27,216);assert.equal(512-216,296);
console.log('PASS | 10 new D4, topology, homology, spectral, electrical and binary checks');
