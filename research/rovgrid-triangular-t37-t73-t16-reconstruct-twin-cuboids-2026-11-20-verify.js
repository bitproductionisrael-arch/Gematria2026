"use strict";
const assert=require("node:assert/strict");
const T=n=>n*(n+1)/2;
for(let n=1;n<=1000;n++)assert.equal(4*T(n)-T(2*n-1),3*n);
assert.equal(T(37),703); assert.equal(T(73),2701); assert.equal(T(16),136); assert.equal(T(55),1540);
const u=4*T(37)-T(73);
const s=(T(73)-T(37))/37;
const p=(T(16)/17)*u;
assert.deepEqual([u,s,p],[111,54,888]);
assert.equal(T(16)+p,1024);
assert.equal(T(37)+T(73),2*T(55)+18**2);
const sols=[];
for(let a=1;a<=s;a++)for(let b=a;b<=s;b++){const c=s-a-b;if(c>=b&&a*b+a*c+b*c===p)sols.push([a,b,c,a*b*c]);}
assert.deepEqual(sols,[[8,20,26,4160],[10,16,28,4480]]);
for(const [a,b,c] of sols){assert.equal(a*a+b*b+c*c,s*s-2*p);assert.equal(2*(a*b+a*c+b*c),1776);}
assert.equal(sols[1][3]-sols[0][3],320);
console.log("PASS: T37/T73/T16 -> 54,888 -> unique positive-integer twin cuboids 8x20x26 and 10x16x28.");
