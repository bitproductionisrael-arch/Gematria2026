'use strict';
const assert=require('node:assert/strict');
const gcd=(a,b)=>{while(b){[a,b]=[b,a%b]}return a;};
const T=n=>n*(n+1)/2;
const mirror=(n,x)=>n+1-x;
const cycles=(n,d)=>{const seen=new Set(),list=[];for(let start=1;start<=n;start++){if(seen.has(start))continue;const cyc=[];let x=start;while(!seen.has(x)){seen.add(x);cyc.push(x);x=1+((x-1+d)%n);}list.push(cyc);}return list;};
for(const n of [22,24,26,33]){
 for(let x=1;x<=n;x++){assert.equal(mirror(n,mirror(n,x)),x);assert.equal(x+mirror(n,x),n+1);}
 assert.equal(2*T(n),n*(n+1));
 const cs=cycles(n,3);
 assert.equal(cs.length,gcd(n,3));
 assert.ok(cs.every(c=>c.length===n/gcd(n,3)));
 assert.equal(new Set(cs.flat()).size,n);
 for(let k=1;k<=n;k++){const s=Array.from({length:k},(_,i)=>i+1);assert.equal(s.reduce((a,x)=>a+x+mirror(n,x),0),k*(n+1));}
 if(n%2===0){const m=n/2;const outer=2*T(m);const inner=2*(T(n)-T(m));assert.equal(inner-outer,2*m*m);}
}
assert.deepEqual([22,24,26,33].map(n=>n*(n+1)),[506,600,702,1122]);
assert.deepEqual([22,24,26,33,13].map(n=>cycles(n,3).map(c=>c.length)),[[22],[8,8,8],[26],[11,11,11],[13]]);
assert.equal(2*(T(26)-T(13)),520);
assert.equal(2*T(13),182);
const groups=[[1,4,7,10,13],[3,6,9,12],[2,5,8,11]];
const sum=a=>a.reduce((x,y)=>x+y,0);
assert.deepEqual(groups.map(sum),[35,30,26]);
assert.equal(sum(groups[0])+sum(groups[1]),65);
console.log('PASS: cross-alphabet mirror and step-3 cycle laws');
