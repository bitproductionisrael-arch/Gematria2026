// RovGrid 2026-11-14 — the triple lock V=8
// Execute: node research/rovgrid-why-520-returns-vertex8-triple-lock-2026-11-14-verify.js
"use strict";
const check=(x,m)=>{if(!x)throw new Error('FAIL: '+m)};
const f=v=>({V:v,E:2*v-4,F:v-2});
const A=v=>v, B=v=>3*v-4, C=v=>4*v-6;
const gluedEdges=v=>2*f(v).E-4;
const cuboidShell=v=>2*v**3-(v-2)**2*(2*v-2);
const P=v=>A(v)*B(v)+A(v)*C(v)+B(v)*C(v);
const H=v=>3*(v**3-(v-2)**3);
let zeros1=[],zeros2=[],zeros3=[];
for(let v=8;v<=500;v+=2){
  const d1=gluedEdges(v)-B(v);
  const d2=B(v)*C(v)-cuboidShell(v);
  const d3=P(v)-H(v);
  check(d1===v-8,'lock1 '+v);
  check(d2===2*(v-1)*(v-8),'lock2 '+v);
  check(d3===v*(v-8),'lock3 '+v);
  if(d1===0)zeros1.push(v);
  if(d2===0)zeros2.push(v);
  if(d3===0)zeros3.push(v);
}
check(zeros1.join(',')==='8'&&zeros2.join(',')==='8'&&zeros3.join(',')==='8','uniqueness finite check');
check(f(8).E===12&&f(8).F===6,'cube skeleton');
check(gluedEdges(8)===20,'joined skeleton');
check(cuboidShell(8)===520,'physical shell');
check(P(8)===888&&H(8)===888,'triple shell');
check(2*8**3-H(8)===136,'remainder');
check(cuboidShell(10)===848&&B(10)*C(10)===884,'negative control');
check(2*(8**3-(8-2)**3)-cuboidShell(8)===72,'seam cancellation');
console.log(JSON.stringify({status:'PASS',commonRoot:8,shell520:cuboidShell(8),P888:P(8),H888:H(8),rem136:1024-888,joinedEdges:gluedEdges(8),controlAt10:{BC:B(10)*C(10),shell:cuboidShell(10)},evenValuesTested:247},null,2));
