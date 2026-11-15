// RovGrid / Gematria2026 — Genesis of Genesis
// Reproduce triangular-lattice overlap counts (all integer lattice points).
// Run: node research/rovgrid-genesis-of-genesis-overlapping-triangles-2026-11-15-verify.js
"use strict";

const assert = require("node:assert/strict");
const T = n => n * (n + 1) / 2;
const H = n => 3 * n * (n - 1) + 1;
const S = n => 6 * n * (n - 1) + 1;

function check(k) {
  const up = new Set(), down = new Set();
  for (let x = -2*k; x <= 2*k; x++) {
    for (let y = -2*k; y <= 2*k; y++) {
      const key = x + "," + y;
      if (x >= -k && y >= -k && x+y <= k) up.add(key);
      if (x <= k && y <= k && x+y >= -k) down.add(key);
    }
  }
  const intersection = [...up].filter(point => down.has(point)).length;
  const union = new Set([...up, ...down]).size;
  const residual = up.size - intersection;
  assert.equal(up.size, T(3*k+1));
  assert.equal(down.size, T(3*k+1));
  assert.equal(intersection, H(k+1));
  assert.equal(union, S(k+1));
  assert.equal(residual, 3*T(k));
  assert.equal(2*up.size-intersection, union);
  assert.equal(T(3*k+1), 9*T(k)+1);
  assert.equal(intersection, 6*T(k)+1);
  assert.equal(union, 12*T(k)+1);
  return {k, seed:T(k), triangle:up.size, overlap:intersection, union, outsideEach:residual};
}
const cases=[2,3,4,5,21,24].map(check);
assert.deepEqual(cases.map(r=>r.triangle),[28,55,91,136,2080,2701]);
assert.deepEqual(cases.map(r=>r.overlap),[19,37,61,91,1387,1801]);
assert.deepEqual(cases.map(r=>r.union),[37,73,121,181,2773,3601]);
assert.deepEqual(cases.map(r=>r.outsideEach),[9,18,30,45,693,900]);

assert.equal(S(3),37);
assert.equal(H(4),37);
assert.equal(T(73),2701);
assert.equal(S(3)*S(4),2701);
assert.equal(T(64),2080);
assert.equal(T(16),136);
assert.equal(2*2701-1801,3601);
assert.equal(2701-1801,900);
assert.equal(3601-2701,900);
assert.equal(900,30**2);
assert.equal(3601,60**2+1);
assert.equal(1801,6*T(24)+1);
assert.equal(2701,9*T(24)+1);
assert.equal(3601,12*T(24)+1);

const overlapCrossovers=[];
const factorCrossovers=[];
for(let n=1;n<=1000;n++){
  if(S(n)===H(n+1))overlapCrossovers.push(n);
  if(S(n)*S(n+1)===T(S(n+1)))factorCrossovers.push(n);
}
assert.deepEqual(overlapCrossovers,[3]);
assert.deepEqual(factorCrossovers,[3]);

function ordinalHebrew(word) {
  const alphabet="אבגדהוזחטיכלמנסעפצקרשת";
  return [...word].reduce((sum,letter)=>{
    const index=alphabet.indexOf(letter);
    assert.ok(index>=0,"Unknown Hebrew letter");
    return sum+index+1;
  },0);
}
function standardHebrew(word) {
  const alphabet="אבגדהוזחטיכלמנסעפצקרשת";
  const values=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
  return [...word].reduce((sum,letter)=>{
    const index=alphabet.indexOf(letter);
    assert.ok(index>=0,"Unknown Hebrew letter");
    return sum+values[index];
  },0);
}
assert.equal(standardHebrew("חוה"),19);
assert.equal(standardHebrew("אני"),61);
assert.equal(standardHebrew("כח"),28);
assert.equal(standardHebrew("יהוה"),26);
assert.equal(standardHebrew("אדני"),65);
assert.equal(standardHebrew("יהוה")+standardHebrew("אדני"),91);
assert.equal(ordinalHebrew("רוב"),28);
assert.equal([...("AMITMIKEROV")].length,11);
assert.equal(2**(11-1),1024);

console.log(JSON.stringify({status:"PASS",cases,overlapCrossovers,factorCrossovers},null,2));
