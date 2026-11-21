// RovGrid/Gematria2026 — compact deterministic Pocklington chain, 21 Nov 2026
// Run: node research/rovgrid-recursive-pocklington-8-steps-1111-digit-mod9-1-ending39-2026-11-21-verify.js
'use strict';
const assert=require('node:assert/strict');
const deltas=[3100n,782n,1682n,26432n,21932n,56582n,412082n,404432n];
const a2=[2n,3n,3n,2n,2n,3n,3n,2n];
const pow=(a,b,m)=>{let r=1n;a%=m;while(b){if(b&1n)r=r*a%m;a=a*a%m;b>>=1n;}return r;};
const gcd=(a,b)=>{while(b){[a,b]=[b,a%b];}return a<0n?-a:a;};
const trial=n=>{if(n<2n)return false;for(let d=2n;d*d<=n;d++)if(n%d===0n)return false;return true;};
function witness(n,q,a){assert((n-1n)%q===0n);assert.equal(pow(a,n-1n,n),1n);assert.equal(gcd(pow(a,(n-1n)/q,n)-1n,n),1n);}
assert(trial(337n));
let q=9437n;
assert.equal(q,28n*337n+1n);
assert(337n*337n>q);
witness(q,337n,2n);
const MR64=[2n,325n,9375n,28178n,450775n,9780504n,1795265022n];
function prime64(n){
 assert(n<(1n<<64n));
 if(n<2n)return false;
 for(const x of [2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n]){if(n===x)return true;if(n%x===0n)return false;}
 let d=n-1n,s=0;while(d%2n===0n){d/=2n;s++;}
 for(const b of MR64){const a=b%n;if(a===0n)continue;
  let t=pow(a,d,n);if(t===1n||t===n-1n)continue;
  let ok=false;for(let j=1;j<s;j++){t=t*t%n;if(t===n-1n){ok=true;break;}}
  if(!ok)return false;
 }return true;
}
for(let i=0;i<deltas.length;i++){
 const R=q+deltas[i],n=2n*q*R+1n;
 assert(deltas[i]<q,'Pocklington size guard');
 assert((2n*q)**2n>n,'known fully factored part 2q must exceed sqrt(n)');
 witness(n,q,2n);
 witness(n,2n,a2[i]);
 assert.equal(n%9n,1n);
 assert.equal(n%100n,39n);
 console.log('PASS stage',i+1,'digits',n.toString().length,'offset',deltas[i].toString(),'bases 2 /',a2[i].toString());
 q=n;
}
assert(prime64(236623337n));
assert(prime64(111981579197920037n));
console.log('PROVED: final prime digits',q.toString().length);
console.log('PROVED: first two smaller twin neighbors 236623337, 111981579197920037');
console.log('FINAL PRIME:',q.toString());
