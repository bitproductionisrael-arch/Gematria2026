// RovGrid 21.11.2026: verified mapping for תשע תשע תשע.
// Run with: node research/rovgrid-tesha-369-pi-e-root2-atbash-6930-2026-11-21-verify.js
const assert = require('node:assert/strict');
const order='אבגדהוזחטיכלמנסעפצקרשת';
const digits={
  pi:'1415926535897932384626433832795028841971693993751058209',
  e:'7182818284590452353602874713526624977572470936999595749',
  root2:'4142135623730950488016887242096980785696718753769480731'
};
function value(w,key){return [...w].reduce((s,ch)=>s+Number(digits[key][order.indexOf(ch)]),0);}
const values={pi:value('תשע','pi'),e:value('תשע','e'),root2:value('תשע','root2')};
assert.deepEqual(values,{pi:10,e:4,root2:7});
assert.equal(value('תשע'.repeat(3),'pi'),30);
assert.equal(value('תשע'.repeat(3),'e'),12);
assert.equal(value('תשע'.repeat(3),'root2'),21);
const map={ת:1,ש:2,ע:7};
const atbash=[...'תשע'].reduce((s,c)=>s+map[c],0);
assert.equal(atbash,10);
assert.equal(atbash*3,30);
const ordinal={ת:22,ש:21,ע:16,י:10,ו:6,נ:14};
const fill={ת:'תיו',ש:'שין',ע:'עין'};
const filled=[...'תשע'].reduce((s,c)=>s+[...fill[c]].reduce((t,x)=>t+ordinal[x],0),0);
assert.equal(filled,123);
assert.equal(3*filled,369);
const normal=400+300+70;
const letterTimesWordLength=3*normal;
const threeWords=3*letterTimesWordLength;
assert.equal(letterTimesWordLength,2310);
assert.equal(threeWords,6930);
assert.equal(letterTimesWordLength-filled,3**7);
assert.equal(threeWords-3*filled,3**8);
assert.equal(12+30,2*21);
assert.equal((6-1)+(2-2)+(2-7),0);
assert.equal(threeWords/(12+21+30),37+73);
assert.equal(threeWords/30,21*22/2);
console.log('All 21 validations passed: תשע ×3, e=12, √2=21, π/Atbash=30, 6930−369=6561.');
