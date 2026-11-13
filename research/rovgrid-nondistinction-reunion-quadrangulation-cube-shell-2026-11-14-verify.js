// Euler quadrangulation + three-shell meeting; finite checks corroborate algebraic factorization
const assert=require('node:assert/strict');
function fromV(V){
 const F=V-2,E=2*F,A=V,B=V+E,C=V+E+F;
 const P=A*B+A*C+B*C,H=3*(V**3-(V-2)**3);
 return {V,E,F,A,B,C,P,H,diff:P-H};
}
for(let V=3;V<1000;V++){
 const r=fromV(V);
 assert.equal(r.V-r.E+r.F,2);
 assert.equal(r.E,2*r.F);
 assert.equal(r.P,19*V**2-44*V+24);
 assert.equal(r.H,18*V**2-36*V+24);
 assert.equal(r.diff,V*(V-8));
 assert.equal(r.P===r.H,V===8);
}
const x=fromV(8);
assert.deepEqual([x.V,x.E,x.F],[8,12,6]);
assert.deepEqual([x.A,x.B,x.C],[8,20,26]);
assert.deepEqual([x.A*x.B,x.A*x.C,x.B*x.C],[160,208,520]);
assert.equal(x.P,888);assert.equal(x.H,888);
assert.equal(2*x.V**3,1024);
assert.equal(2*x.V**3-x.P,136);
console.log('PASS: P(V)-H(V)=V(V-8) and unique positive V=8 in modeled family');
