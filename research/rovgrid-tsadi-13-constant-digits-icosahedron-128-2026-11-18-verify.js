"use strict";
// RovGrid 2026-11-18: independent verification of Tsadi index 18,
// canonical HOMEPOWER_CONSTANTS digit mappings, 13-node geometry and x128.
// npm dependencies: none. Run: node research/rovgrid-tsadi-13-constant-digits-icosahedron-128-2026-11-18-verify.js
function check(condition, description) { if (!condition) throw new Error("FAIL: " + description); }
const series=[
["pi","1415926535897932384626433832795028841971693993751058209",8],
["e","7182818284590452353602874713526624977572470936999595749",5],
["phi","6180339887498948482045868343656381177203091798057628621",8],
["root2","4142135623730950488016887242096980785696718753769480731",8],
["root3","7320508075688772935274463415058723669428052538103806280",3],
["root5","2360679774997896964091736687312762354406183596115257242",6],
["golden9","4376941012509463661587184907092569405172173817481342407",6],
["root37","0827625302982196889996842452020670620849700947864111864",8],
["root73","5440037453175311678716483262397064345944553295332822419",7],
["root888","7993288515026794386636320922479022804690433243624946761",8],
["inv2701","000370233246945575712699000370233246945575712699000370233246945575712699",5],
["inv37","027027027027027027027027027027027027027027027027027027027027",7],
["inv73","0136986301369863013698630136986301369863013698630136986301369863",1]
];
const ordinalIndex=18;
for (const [label,digits,want] of series) {
 const actual=Number(digits[ordinalIndex-1]);
 check(actual===want,label+" digit18 "+actual+" != "+want);
}
const irr=series.slice(0,10).reduce((s,x)=>s+x[2],0);
const rat=series.slice(10).reduce((s,x)=>s+x[2],0);
check(irr===67 && rat===13 && irr+rat===80,"67+13=80");
function order10(n) {
 check(n>1 && n%2!==0 && n%5!==0,"coprime with 10");
 let r=10%n, k=1;
 while(r!==1) { r=r*10%n; k++; check(k<=n,"period bound"); }
 return k;
}
check(order10(37)===3&&order10(73)===8&&order10(2701)===24,"rational periods");
check(37*73===2701 && 24*37===888,"37/73 and 888");
check(3*296===888 && 296===8*37,"296");
function gcd(a,b){while(b) [a,b]=[b,a%b];return a;}
function phi(n){let count=0;for(let i=1;i<=n;i++) if(gcd(i,n)===1) count++;return count;}
check(phi(296)===144 && 8*18===144 && 16*9===144,"totient 296");
const f=(1+Math.sqrt(5))/2;
const points=[];
for (const s of [-1,1]) for (const t of [-1,1]) points.push([0,s,t*f]);
for (const s of [-1,1]) for (const t of [-1,1]) points.push([s,t*f,0]);
for (const s of [-1,1]) for (const t of [-1,1]) points.push([s*f,0,t]);
points.push([0,0,0]);
const count={radial:0,edge:0,diagonal:0,opposite:0};
for(let i=0;i<13;i++)for(let j=i+1;j<13;j++){
 if(i===12||j===12){count.radial++;continue;}
 const q=points[i].reduce((sum,v,k)=>sum+(v-points[j][k])**2,0);
 const type=Math.abs(q-4)<1e-8?"edge":Math.abs(q-4*f*f)<1e-8?"diagonal":Math.abs(q-4*(1+f*f))<1e-8?"opposite":"INVALID";
 check(type!=="INVALID","unclassified outer squared length "+q);
 count[type]++;
}
check(Object.values(count).reduce((a,b)=>a+b,0)===78,"78 pairs");
check(count.radial===12&&count.edge===30&&count.diagonal===30&&count.opposite===6,"12+30+30+6");
check(count.edge+count.radial===42 && count.diagonal+count.opposite===36,"42+36");
check(128*8===1024 && 128*32===4096 && 128*104===13*1024,"128 key identities");
check(128*9===1152 && 128*18===2304 && 128*90===11520,"128 base");
check(2**12===4096 && 2**13===8192,"binary masks");
check(26**2+14**2+4**2===888,"sqrt888 3D vector");
const repeated=series.map(([k,,v])=>({constant:k,digit18:v,x128:v*128}));
console.log(JSON.stringify({PASS:true,irrational_digits_sum:irr,rational_digits_sum:rat,digits_sum:80,periods:{inv37:3,inv73:8,inv2701:24},graph:count,all_pairs:78,states_outer_fixed_center:4096,with_switchable_center:8192,mapping:repeated},null,2));
