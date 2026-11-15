"use strict";
// Reproduce 24-digit π/e positional-dot products. This is NOT ordinary π×e.
const assert=require("node:assert/strict");
const sig={pi:"314159265358979323846264",e:"271828182845904523536028"};
const frac={pi:"141592653589793238462643",e:"718281828459045235360287"};
const dot=(a,b)=>{assert.equal(a.length,b.length);return [...a].reduce((s,x,i)=>s+Number(x)*Number(b[i]),0)};
const blocks=({pi,e})=>[0,8,16].map(i=>dot(pi.slice(i,i+8),e.slice(i,i+8)));
assert.equal(sig.pi.length,24);assert.equal(sig.e.length,24);
assert.equal(frac.pi.length,24);assert.equal(frac.e.length,24);
assert.deepEqual(blocks(sig),[157,226,145]);
assert.deepEqual(blocks(frac),[161,220,162]);
assert.equal(dot(sig.pi,sig.e),528);
assert.equal(dot(frac.pi,frac.e),543);
assert.equal(543-528,15);
assert.equal(528,32*33/2);
assert.equal(528,24*22);
assert.equal(543,3*(6*6*5+1)); // S6=181
assert.equal(136,9*15+1);
assert.equal(15,5*6/2);
assert.equal(543+345,888);
assert.equal(528+360,888);
assert.equal(360-345,15);
assert.equal(24*37,888);
assert.equal(360,300+10+50); // שין
assert.equal(345,40+300+5); // משה
assert.equal(345,1+30+300+10+4); // אל שדי
assert.equal(528,40+80+400+8); // מפתח
assert.equal(543,21+501+21); // אהיה אשר אהיה
assert.equal(1086,2*543); // כח תחתון כח עליון regular
// Exact finite 24-place decimal approximations differ from normal digit-dot products:
const fixedProduct=BigInt("3"+frac.pi)*BigInt("2"+frac.e);
const digits=fixedProduct.toString().padStart(49,"0");
assert.equal(digits,"8539734222673567065463548346886804831162095258541"); // check and correct if wrong
console.log(JSON.stringify({status:"PASS",significantDigits:dot(sig.pi,sig.e),decimalDigits:dot(frac.pi,frac.e),sigBlocks:blocks(sig),fracBlocks:blocks(frac)},null,2));
