'use strict';const assert=require('node:assert/strict');
const sequences={
 English:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
 Geez:'ሀለሐመሠረሰቀበተኀነአከወዐዘየደገጠጰጸፀፈፐ',
 Hebrew:'אבגדהוזחטיכלמנסעפצקרשת',
 Greek:'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ',
 Russian:'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
};
const expected={English:[26,91,260,520,702],Geez:[26,91,260,520,702],Hebrew:[22,66,187,374,506],Greek:[24,78,222,444,600],Russian:[33,136,425,850,1122]};
const T=n=>n*(n+1)/2;
const central=n=>2*(T(n)-T(Math.floor(n/2)));
for(const [lang,characters] of Object.entries(sequences)){
 const n=[...characters].length;
 assert.equal(new Set([...characters]).size,n,lang+' duplicate');
 const m=Math.floor(n/2);
 assert.deepEqual([n,T(m),T(n)-T(m),central(n),n*(n+1)],expected[lang],lang);
}
const extras={Arabic:[28,105,301,602,812],Armenian38:[38,190,551,1102,1482]};
for(const [key,[n,outer,inner,mid,total]] of Object.entries(extras)){
 const m=Math.floor(n/2);
 assert.deepEqual([n,T(m),T(n)-T(m),central(n),n*(n+1)],[n,outer,inner,mid,total],key);
}
for(let n=1;n<=300;n++)if(central(n)===520)assert.equal(n,26);
assert.equal(Array.from({length:300},(_,i)=>i+1).filter(n=>central(n)===520).join(','),'26');
assert.equal(70+40+10+400,520);
assert.equal(16+13+10+22,61);
const hebRegular=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
assert.equal(2*hebRegular.slice(11).reduce((a,b)=>a+b,0),2840);
console.log('PASS: 520 occurs at n=26 uniquely for locked mirror-center rule; Hebrew is a distinct regular-gematria equality');
