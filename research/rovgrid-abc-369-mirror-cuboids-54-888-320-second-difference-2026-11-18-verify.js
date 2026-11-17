#!/usr/bin/env node
"use strict";
// Exact, integer-only structural proof: the two 54/888 cuboids are
// mirror points about 3*(3,6,9) along the primitive second-difference vector.
const assert=require("node:assert/strict");
const sum=a=>a.reduce((s,x)=>s+x,0);
const dot=(a,b)=>sum(a.map((x,i)=>x*b[i]));
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const neg=a=>a.map(x=>-x);
const scale=(n,a)=>a.map(x=>n*x);
const q=([a,b,c])=>a*b+a*c+b*c;
const prod=a=>a.reduce((x,y)=>x*y,1);
const abc=[3,6,9],center=scale(3,abc),step=[1,-2,1];
assert.deepEqual(center,[9,18,27]);
assert.equal(sum(abc),18);
assert.equal(dot(abc,abc),126);
assert.equal(sum(step),0);
assert.equal(dot(abc,step),0);
assert.equal(dot(center,step),0);
assert.equal(dot(step,step),6);
assert.equal(dot(center,center),1134);
assert.equal(sum(center),54);
assert.equal(q(center),891);
const original=add(center,neg(step)),twin=add(center,step);
assert.deepEqual(original,[8,20,26]);
assert.deepEqual(twin,[10,16,28]);
for(const dims of [original,twin]){
 assert.equal(sum(dims),54);
 assert.equal(dot(dims,dims),1140);
 assert.equal(q(dims),888);
 assert.equal((sum(dims)**2-dot(dims,dims))/2,888);
 assert.deepEqual([dims[1]-dims[0],dims[2]-dims[1]],dims[0]===8?[12,6]:[6,12]);
}
assert.deepEqual([prod(original),prod(twin)],[4160,4480]);
assert.equal(prod(twin)-prod(original),320);
function profile([a,b,c]){
 const core=(a-2)*(b-2)*(c-2);
 const edge=4*((a-2)+(b-2)+(c-2));
 const face=2*((a-2)*(b-2)+(a-2)*(c-2)+(b-2)*(c-2));
 const corner=8;
 const H=[core,face,edge,corner];
 assert.equal(sum(H),a*b*c);
 assert.equal(3*corner+2*edge+face,2*q([a,b,c]));
 assert.equal(face,2*q([a,b,c])-8*sum([a,b,c])+24);
 return H;
}
assert.deepEqual(profile(original),[2592,1368,192,8]);
assert.deepEqual(profile(twin),[2912,1368,192,8]);
assert.equal(profile(twin)[0]-profile(original)[0],320);
assert.deepEqual(profile(twin).slice(1),profile(original).slice(1));
// Polynomial 1+S*x+Q*x^2+P*x^3 is same up to quadratic term:
assert.deepEqual([1,sum(original),q(original),prod(original)],[1,54,888,4160]);
assert.deepEqual([1,sum(twin),q(twin),prod(twin)],[1,54,888,4480]);
// Orthogonality makes the whole mirror line's Q depend only on t^2.
for(let t=-8;t<=8;t++){
 const dims=add(center,scale(t,step));
 assert.equal(sum(dims),54);
 assert.equal(q(dims),891-3*t*t);
 assert.equal(dot(dims,dims),1134+6*t*t);
 assert.equal(q(dims)===888,Math.abs(t)===1);
 assert.equal(prod(dims),4374+162*t-54*t*t-2*t*t*t);
}
// The integer kernel of sum(w)=dot(abc,w)=0, within a representative box,
// contains only integer multiples of (1,-2,1).
for(let a=-10;a<=10;a++)for(let b=-10;b<=10;b++)for(let c=-10;c<=10;c++){
 if(a+b+c===0&&3*a+6*b+9*c===0)
  assert.deepEqual([a,b,c],[c,-2*c,c]);
}
// Complete enumeration of unordered positive integer cuboids under S=54,Q=888:
const all=[];
for(let a=1;a<=18;a++)for(let b=a;b<=27;b++){
 const c=54-a-b;
 if(c<b)continue;
 if(q([a,b,c])===888)all.push([a,b,c]);
}
assert.deepEqual(all,[original,twin]);
// Primitive scale k and t=+/-1: e2=99*k^2-3, so 888 iff k=3.
for(let k=1;k<=100;k++){
 const c=scale(k,abc);
 assert.equal(q(add(c,step)),99*k*k-3);
 if(q(add(c,step))===888)assert.equal(k,3);
}
assert.equal(99*3*3-3,888);
console.log("PASS | central 3×(3,6,9) and unique primitive shift ±(1,−2,1) give two boxes 8×20×26 / 10×16×28; same e1=54,e2=888 and external 8/192/1368; only cubic volume term differs by 320; exhaustive positive integer classification.");
