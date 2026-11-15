#!/usr/bin/env node
"use strict";
// RG-MASTER-2026-11-15-v2.0. Independent no-dependency audit.
// Run: node research/rovgrid-master-2026-11-15-verify.js
const assert = require("node:assert/strict");
const T=n=>n*(n+1)/2;
const H=n=>3*n*(n-1)+1;
const S=n=>6*n*(n-1)+1;
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>a/gcd(a,b)*b;
const code={};
function check(label,fn){fn();code[label]="PASS";}

check("Q3 roots / cuboid / arithmetic",()=>{
 const V=8,E=12,F=6,a=V,b=V+E,c=V+E+F;
 assert.deepEqual([a,b,c],[8,20,26]);
 assert.deepEqual([a*b,a*c,b*c],[160,208,520]);
 assert.equal(a*b+a*c+b*c,888);
 assert.equal(a*b*c,4160);
 assert.equal(lcm(lcm(160,208),520),2080);
 assert.equal(2*V**3-888,136);
 assert.equal(3*(V**3-(V-2)**3),888);
});
check("Euler quadrangulation identity",()=>{
 for(let V=3;V<=300;V++){
  let a=V,b=3*V-4,c=4*V-6;
  let p=a*b+a*c+b*c;
  let h=3*(V**3-(V-2)**3);
  assert.equal(p-h,V*(V-8));
  if(p===h)assert.equal(V,8);
 }
});
check("Hypercube generator: only d=3 in 2..18",()=>{
 for(let d=2;d<=18;d++){
  const V=2**d,E=d*2**(d-1),F=(d*(d-1)/2)*2**(d-2);
  const a=V,b=V+E,c=V+E+F;
  const p=a*b+a*c+b*c,h=3*(V**3-(V-2)**3);
  assert.equal(p===h,d===3);
 }
});
check("D4 32×32 full orbit partition",()=>{
 const n=32,k=(r,c)=>r*n+c,rev=x=>n-1-x,seen=new Set(),sizes={};
 for(let r=0;r<n;r++)for(let c=0;c<n;c++){
  const idx=k(r,c);if(seen.has(idx))continue;
  const orbit=new Set([[r,c],[r,rev(c)],[rev(r),c],[rev(r),rev(c)],
    [c,r],[c,rev(r)],[rev(c),r],[rev(c),rev(r)]].map(([i,j])=>k(i,j)));
  for(const pos of orbit){assert(!seen.has(pos));seen.add(pos);}
  sizes[orbit.size]=(sizes[orbit.size]||0)+1;
 }
 assert.equal(seen.size,1024);
 assert.deepEqual(sizes,{"4":16,"8":120});
 assert.equal(16+120,136);
 assert.equal(120*7+16*3,888);
});
check("Pascal 16 rows and reflection pairs",()=>{
 let odd=0,even=0;
 for(let r=0;r<16;r++)for(let c=0;c<=r;c++) ((c&r)===c)?odd++:even++;
 assert.equal(odd,81);assert.equal(even,55);
 assert.equal(28+3*T(3)+9*T(1),55);
 assert.equal(28+82,110);assert.equal(37+73,110);
 for(const [a,b] of [[19,91],[28,82],[37,73],[46,64]])assert.equal(a+b,110);
});
check("Genesis triangle and star lattice",()=>{
 assert.equal(T(73),2701);
 assert.equal(37*73,2701);
 assert.equal(H(4),37);
 assert.equal(S(3),37);
 assert.equal(S(4),73);
 for(let k=1;k<=100;k++)assert.equal(2*T(3*k+1)-H(k+1),S(k+1));
});
check("Hebrew and English ciphers",()=>{
 const abc="אבגדהוזחטיכלמנסעפצקרשת";
 const v=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
 const ends={"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"};
 const heb=(s,mode="regular")=>[...s.replace(/\s/g,"")].reduce((z,ch)=>{
  let i=abc.indexOf(ends[ch]||ch);assert(i>=0);
  return z+(mode==="regular"?v[i]:mode==="ordinal"?i+1:((v[i]-1)%9)+1);
 },0);
 const simple=s=>[...s.toUpperCase().replace(/[^A-Z]/g,"")].reduce((z,c)=>z+c.charCodeAt(0)-64,0);
 const jmap=[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500];
 const jewish=s=>[...s.toUpperCase().replace(/[^A-Z]/g,"")].reduce((z,c)=>z+jmap[c.charCodeAt(0)-65],0);
 assert.deepEqual(["עמית","מייק","רוב"].map(w=>heb(w)),[520,160,208]);
 assert.deepEqual(["עמית","מייק","רוב"].map(w=>heb(w,"ordinal")),[61,52,28]);
 assert.equal(heb("עמית מייק רוב"),888);
 assert.equal(heb("עמית מייק רוב","small"),33);
 assert.equal(heb("לב"),32);assert.equal(heb("לב","ordinal"),14);
 assert.equal(heb("ישראל","ordinal"),64);
 assert.equal(heb("בראשית")+heb("אלף"),1024);
 const words=["בראשית","ברא","אלהים","את","השמים","ואת","הארץ"];
 assert.deepEqual(words.map(heb),[913,203,86,401,395,407,296]);
 assert.equal(words.join("").length,28);
 assert.equal(words.slice(0,3).join("").length,14);
 assert.equal(words.slice(3).join("").length,14);
 assert.equal(words.map(heb).reduce((a,b)=>a+b,0),2701);
 assert.equal(heb(words.join(""),"small"),82);
 assert.deepEqual(["AMIT","MIKE","ROV"].map(simple),[43,38,55]);
 assert.deepEqual(["AMIT","MIKE","ROV"].map(jewish),[140,54,830]);
 assert.equal(simple("AMIT MIKE ROV"),136);
 assert.equal(jewish("AMIT MIKE ROV"),1024);
 assert.equal(6*simple("ROV"),330);
 assert.equal(1024-136,888);
});
check("24-cell vertices, quotient and ranks",()=>{
 const verts=[];
 for(let axis=0;axis<4;axis++)for(const s of [-2,2]){
  const v=[0,0,0,0];v[axis]=s;verts.push(v);
 }
 for(let mask=0;mask<16;mask++)verts.push([0,1,2,3].map(i=>(mask&(1<<i))?1:-1));
 assert.equal(verts.length,24);
 const key=v=>v.join(",");
 const vi=new Map(verts.map((v,i)=>[key(v),i]));
 let edges=[],degrees=Array(24).fill(0);
 for(let i=0;i<24;i++)for(let j=i+1;j<24;j++){
  const sq=verts[i].reduce((z,x,p)=>z+(x-verts[j][p])**2,0);
  if(sq===4){edges.push([i,j]);degrees[i]++;degrees[j]++;}
 }
 assert.equal(edges.length,96);assert(degrees.every(d=>d===8));
 const group=new Map();
 for(let i=0;i<24;i++){
  const opposite=vi.get(key(verts[i].map(x=>-x)));
  assert(opposite!==undefined && opposite!==i);
  group.set(i,Math.min(i,opposite));
 }
 assert.equal(new Set(group.values()).size,12);
 const quotient=new Set(edges.map(([i,j])=>[group.get(i),group.get(j)].sort((a,b)=>a-b).join(":")));
 assert.equal(quotient.size,48);
 assert.equal(96-24+1,73);
 assert.equal(48-12+1,37);
 assert.equal(24*(1+T(8)),888);
});
check("Q4 528 unordered edge-pairs have seven symmetry orbits",()=>{
 const edges=[];
 for(let v=0;v<16;v++)for(let axis=0;axis<4;axis++)if(!(v&(1<<axis)))edges.push([v,v|(1<<axis)]);
 assert.equal(edges.length,32);
 const edgeMap=new Map(edges.map(([a,b],i)=>[a+":"+b,i]));
 const transVertex=(v,g)=>{
  if(g<4)return v^(1<<g);
  const i=g-4,j=i+1,bi=(v>>i)&1,bj=(v>>j)&1;
  return bi===bj?v:v^((1<<i)|(1<<j));
 };
 const transformEdge=(edgeIdx,g)=>{
  let [x,y]=edges[edgeIdx].map(v=>transVertex(v,g)).sort((a,b)=>a-b);
  const target=edgeMap.get(x+":"+y);assert(target!==undefined);return target;
 };
 const pairKey=(a,b)=>[a,b].sort((x,y)=>x-y).join(":");
 const seen=new Set(),sizes=[];
 for(let i=0;i<32;i++)for(let j=i;j<32;j++){
  const start=pairKey(i,j);if(seen.has(start))continue;
  const q=[start];seen.add(start);
  for(let at=0;at<q.length;at++){
   const [a,b]=q[at].split(":").map(Number);
   for(let g=0;g<7;g++){
    const next=pairKey(transformEdge(a,g),transformEdge(b,g));
    if(!seen.has(next)){seen.add(next);q.push(next);}
   }
  }
  sizes.push(q.length);
 }
 assert.equal(seen.size,528);
 assert.deepEqual(sizes.sort((a,b)=>a-b),[16,32,48,48,96,96,192]);
});
check("Q4 dimensional lock G(d)=T(E(d))",()=>{
 const G=d=>2*(2**d)**2+d*d;
 const E=d=>d*2**(d-1);
 for(let d=1;d<=12;d++){
  const diff=G(d)-T(E(d));
  const rhs=2**(2*d-3)*(16-d*d)+d*(d-2**(d-2));
  assert.equal(diff,rhs);
  assert.equal(diff===0,d===4);
 }
 assert.equal(G(4),528);
 assert.equal(T(E(4)),528);
});
check("The 14x−previous recurrence and mod 12",()=>{
 let seq=[1,13];
 for(let i=0;i<3;i++)seq.push(14*seq[seq.length-1]-seq[seq.length-2]);
 assert.deepEqual(seq,[1,13,181,2521,35113]);
 assert(seq.every(x=>x%12===1));
 assert(136%12!==1);
});
const entries=Object.entries(code);
console.log("PASS:",entries.length,"independent verification groups");
for(const [k,v] of entries)console.log(v+": "+k);
