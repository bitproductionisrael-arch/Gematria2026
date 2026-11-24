'use strict';
const assert=require('node:assert/strict');
const A='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const J=[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500];
function calc(s){return [...s.replace(/ /g,'')].reduce(([j,o],c)=>{const i=A.indexOf(c);assert(i>=0);return [j+J[i],o+i+1];},[0,0]);}
assert.deepEqual(calc('AMIT MIKE ROV'),[1024,136]);
assert.deepEqual(calc('AMIT'),[140,43]);assert.deepEqual(calc('MIKE'),[54,38]);assert.deepEqual(calc('ROV'),[830,55]);
assert.deepEqual(calc('AMIT MIIK ROV'),[1028,140]);assert.deepEqual(calc('AMIT MIKE ROB'),[326,116]);assert.deepEqual(calc('AMIT MIKE ROU'),[524,135]);
let count=0,total=0;const seen=new Set();
for(const a of A.slice(0,9))for(const b of A.slice(0,9))for(const c of A.slice(0,9))for(const d of A.slice(0,9)){
 const s=a+'M'+b+'T M'+c+'K'+d+' ROV';const [j,o]=calc(s);total++;seen.add(s);assert.equal(j-o,888);if(j===1024&&o===136)count++;
}
assert.equal(total,6561);assert.equal(seen.size,6561);assert.equal(count,375);
console.log({total,pairMatches:count,alternatives:count-1});
