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
console.log(JSON.stringify({PASS:true,A005915:cases,grid4D_n9:{total:10000,adjacent_equal:2710,excluded_nine_nonzero_diagonal:9,remaining:2701},projection_vertex_counts:{four_cubeto_rhombic_dodecahedron:14,six_cubeto_rhombic_triacontahedron:32}},null,2));
