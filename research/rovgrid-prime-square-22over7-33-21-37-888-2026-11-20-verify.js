// RovGrid prime-square bridge verification — 2026-11-20
// Run: node research/rovgrid-prime-square-22over7-33-21-37-888-2026-11-20-verify.js
'use strict';
const assert = require('node:assert/strict');
function primesThroughIndex(n) {
  const p = [];
  for (let v = 2; p.length < n; v++) {
    let ok = true;
    for (const q of p) {
      if (q * q > v) break;
      if (v % q === 0) { ok = false; break; }
    }
    if (ok) p.push(v);
  }
  return p;
}
const p = primesThroughIndex(258);
const P = n => p[n - 1];
assert.equal(P(12), 37);
assert.equal(P(21), 73);
assert.equal(P(33), 137);
assert.equal(P(100), 541);
assert.equal(P(212), 1301);
assert.equal(P(258), 1627);
assert.equal(P(100) - 100, 21 ** 2);
assert.equal(P(212) - 212, 33 ** 2);
assert.equal(P(258) - 258, 37 ** 2);
assert.equal(P(12) - 12, 5 ** 2);
// Rational identity instead of floating equality: 2*(33/21) == 22/7.
assert.equal(2 * 33 * 7, 22 * 21);
assert.equal(2 * (33 - 21) * P(33 - 21), 888);
assert.equal(33 + 21, 8 + 20 + 26);
assert.equal(33 ** 2 - 21 ** 2, 12 * 54);
assert.equal(8 * 20 + 8 * 26 + 20 * 26, 888);
const star = n => 6 * n * (n - 1) + 1;
assert.equal(star(3), 37);
assert.equal(star(4), 73);
assert.equal(star(10), 541);
assert.equal(25 ** 2 + 26 ** 2, 1301);
assert.equal('AMIT'.split('').reduce((a,c)=>a+c.charCodeAt(0)-64,0)*6,258);
assert.equal(1+5+10+5,21); // אהיה
assert.equal(1+40+400,441); // אמת
assert.equal(10+300+200+1+30,541); // ישראל
const small = {'ע':7,'מ':4,'י':1,'ת':4,'ק':1,'ר':2,'ו':6,'ב':2};
const value = w => [...w].reduce((acc,ch)=>acc+small[ch],0);
assert.equal(value('עמית')+value('מייק')+value('רוב'),33);
console.log('PASS: prime indices, squares, 22/7, 888, stars, gematria checks');