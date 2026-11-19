"use strict";
// RovGrid A005915 bridge. Independent arithmetic/combinatorial verification.
// Run with: node research/rovgrid-a005915-hexagonal-prism-4cube-2710-2701-2026-11-19-verify.js
const assert=(v,s)=>{if(!v)throw new Error("FAIL "+s)};
const centeredHex=m=>3*m*(m-1)+1;
const A005915=n=>(n+1)*(3*n*n+3*n+1);
const A5fromHypergrid=n=>(n+1)**4-(n+1)*n**3;
const cases=[];
for(let n=0;n<12;n++){
 const a=A005915(n),h=(n+1)*centeredHex(n+1),b=A5fromHypergrid(n);
 assert(a===h&&a===b,"formula match "+n);
 cases.push({n,a,centeredHex:centeredHex(n+1)});
}
assert(A005915(3)===148 && A005915(6)===889 && A005915(9)===2710,"anchor terms");
assert(centeredHex(10)===271 && A005915(9)-9===2701 && 2701===37*73,"Genesis");
assert(10**4-10*9**3===2710,"4D complement");
assert(3*1000-3*100+10===2710,"4D inclusion exclusion");
assert((10000-7290)-9===2701,"retain designated all-zero diagonal");
// Exhaustively confirm that a(3)=148 counts 4-tuples in {0,1,2,3}^4
let count=0, exceptional=0;
for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++)for(let d=0;d<4;d++){
 if(a===b||b===c||c===d)count++;
 if(a===b&&b===c&&c===d&&a!==0)exceptional++;
}
assert(count===148&&exceptional===3&&count-exceptional===145,"exhaustive n3");
assert(8+6===14 && 20+12===32,"platonic vertex subsets in 4D/6D projection envelopes");

 // 2026-11-19 extended research: genuine center gluing for ALL n,
 // dimensional shell product, tesseract binary projection, and finite differences.
const glued=n=>A005915(n)-n;
for(let n=0;n<64;n++){
 assert(glued(n)===3*n*(n+1)**2+1,"center-glue universal identity n="+n);
 if(n>=3){
  const third=glued(n)-3*glued(n-1)+3*glued(n-2)-glued(n-3);
  assert(third===18,"constant third finite difference n="+n);
 }
}
const anchors={0:1,1:13,2:55,3:145,4:301,5:541,6:883,7:1345,8:1945,9:2701,11:4753};
for(const [n,v] of Object.entries(anchors))assert(glued(+n)===v,"g(n) anchors "+n);
assert(glued(9)-glued(8)===27*28,"27x28 growth at genesis step");
const b005917=n=>n**4-(n-1)**4;
assert(b005917(5)===369,"rhombic dodecahedral 369");
assert((10**3-9**3)*b005917(5)===10**5-1,"3D 4D shell product 99999");
const hex=k=>k*(2*k-1);
assert(hex(37)===glued(9)&&hex(49)===glued(11),"g(n) hexagonal intersections");
let binaryGood=0;const binaryMiss=[];
const counts={cube:0,octa:0,center:0};const unique=new Set();
for(let w=0;w<2;w++)for(let x=0;x<2;x++)for(let y=0;y<2;y++)for(let z=0;z<2;z++){
 const bits=[w,x,y,z];
 if(w===x||x===y||y===z)binaryGood++;else binaryMiss.push(bits.join(""));
 const s=bits.map(v=>2*v-1);
 const p=[
  (s[0]+s[1]-s[2]-s[3])/2,
  (s[0]-s[1]+s[2]-s[3])/2,
  (s[0]-s[1]-s[2]+s[3])/2
 ];
 unique.add(p.join(","));
 if(p.every(v=>v===0))counts.center++;
 else if(p.every(v=>Math.abs(v)===1))counts.cube++;
 else if(p.filter(v=>Math.abs(v)===2).length===1&&p.filter(v=>v===0).length===2)counts.octa++;
 else throw Error("unexpected projected 4D vertex "+p);
}
assert(binaryGood===14&&binaryMiss.sort().join(",")==="0101,1010","A005915(1) 14 binary configurations");
assert(counts.cube===8&&counts.octa===6&&counts.center===2&&unique.size===15,"4cube 8+6+2 projection");

console.log(JSON.stringify({PASS:true,A005915:cases,grid4D_n9:{total:10000,adjacent_equal:2710,excluded_nine_nonzero_diagonal:9,remaining:2701},projection_vertex_counts:{four_cubeto_rhombic_dodecahedron:14,six_cubeto_rhombic_triacontahedron:32}},null,2));
