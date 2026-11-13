// RovGrid architect generator unique d=3 (finite spot checks only; see analytic proof in the .md)
const assert=require('node:assert/strict');
const C2=d=>d*(d-1)/2;
const phi=n=>{let z=n;for(let p=2;p*p<=n;p++){if(n%p===0){while(n%p===0)n/=p;z-=z/p;}}if(n>1)z-=z/n;return z;};
function model(d){
 const V=2**d,E=d*2**(d-1),F=C2(d)*2**(d-2);
 const A=V,B=V+E,C=V+E+F;
 const P=A*B+A*C+B*C,H=3*(V**3-(V-2)**3);
 const N=2*V**3,Y=N-P;
 return {d,V,E,F,A,B,C,P,H,N,Y};
}
const models=[2,3,4,5,6,7,8].map(model);
assert.deepEqual(models.filter(m=>m.P===m.H).map(m=>m.d),[3]);
const m=model(3);
assert.deepEqual([m.V,m.E,m.F],[8,12,6]);
assert.deepEqual([m.A,m.B,m.C],[8,20,26]);
assert.deepEqual([m.A*m.B,m.A*m.C,m.B*m.C],[160,208,520]);
assert.equal(m.P,888);assert.equal(m.H,888);assert.equal(m.N,1024);assert.equal(m.Y,136);
assert.equal(phi(160),64);assert.equal(phi(136),64);
assert.equal(phi(208),96);assert.equal(phi(520),192);
assert.equal(phi(728),288);assert.equal(phi(888),288);
assert.equal(phi(160)+phi(208)+phi(520),phi(888)+phi(136));
assert.equal(136/1024*100,13.28125);
assert.equal(888/1024*100,86.71875);
assert.equal(12**2+4**2,160);assert.equal(12**2+8**2,208);
assert.equal(14**2+18**2,520);assert.equal(10**2+6**2,136);
for(let d=1;d<100;d++){
 const S=6*d*(d-1)+1,D=(d+1)**3-d**3;
 assert.equal(S===D,d===3);
}
assert.equal(phi(3960),960);
console.log('PASS architect generator d=3, distinct confirmations and original proof gap');
