"use strict";
// Independent, integer-only verification of the 16 Nov 2026 figurate phase research.
const assert = require("node:assert/strict");
const T = n => n*(n+1)/2;
const C = (s,n) => 1 + s*T(n-1);
const Tet = n => n*(n+1)*(n+2)/6;
const Dod = n => n*(3*n-1)*(3*n-2)/2;
const SqPyr = n => n*(n+1)*(2*n+1)/6;
let checks=0;
function eq(got,want,name){assert.equal(got,want,name);checks++;}

[
 ["T8",T(8),36], ["T9",T(9),45], ["T10",T(10),55],
 ["T16",T(16),136],
 ["C3(10)",C(3,10),136],["C6(10)",C(6,10),271],
 ["C12(10)",C(12,10),541],["C15(9)",C(15,9),541],
 ["C8(5)",C(8,5),81],["C8(10)",C(8,10),361],
 ["C5(11)",C(5,11),276],["T23",T(23),276],
 ["square pyramid 5",SqPyr(5),55],
 ["D6",Dod(6),816],["tet16",Tet(16),816],
 ["star core",C(6,10)+6*T(9),541],
 ["ring 54",6*(10-1),54],
 ["star partition",1+54+6*(T(8)+T(9)),541],
 ["9 square",T(8)+T(9),81],
 ["T16=T10+81",T(16)-T(10),81],
 ["gap",Tet(16)-C(12,10),275],
 ["five triangles",5*T(10),275],
 ["gap via 136",2*T(16)+3,275],
 ["centered pentagon minus center",C(5,11)-1,275],
 ["541 via 136",4*T(16)-3,541],
 ["816 via 136",6*T(16),816],
 ["D3 to D4 layer",Dod(4)-Dod(3),136],
 ["D5 to D6 layer",Dod(6)-Dod(5),361],
].forEach(([label,actual,expected])=>eq(actual,expected,label));

for(let n=1;n<=1000;n++){
  eq(Dod(n),Tet(3*n-2),"D/Tet all n="+n);
  eq(Dod(n)-Dod(n-1),C(3,3*n-2),"D-layer all n="+n);
  eq(C(6,n),2*C(3,n)-1,"C6/C3 all n="+n);
  eq(C(12,n),4*C(3,n)-3,"C12/C3 all n="+n);
  eq(C(12,n),1+6*(n-1)+6*(n-1)**2,"star partition all n="+n);
  eq(T(n)+T(n-1),n*n,"consecutive triangles square n="+n);
}
const special=[];
for(let n=2;n<=1000;n++) if(1+6*(n-1)===T(n))special.push(n);
assert.deepEqual(special,[10]);
checks++;
for(let sides=3;sides<=12;sides++)eq(C(sides,10),1+45*sides,"all ten centered phases s="+sides);
console.log("Verified",checks,"assertions. Unique n>1 <= 1000 for 1+6(n-1)=T(n):",special);
console.log("No test equates physical spatial shapes or ascribes theological meaning.");
