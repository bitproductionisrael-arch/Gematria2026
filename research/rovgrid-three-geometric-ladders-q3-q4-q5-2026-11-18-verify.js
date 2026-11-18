"use strict";
// Reproducible geometric checks for three interlaced hypercube ladders.
const assert = (condition, label) => { if (!condition) throw new Error(label); };
const choose=(n,k)=>{
  if(k<0||k>n) return 0;
  let p=1;
  for(let i=1;i<=k;i++) p=p*(n-i+1)/i;
  return Math.round(p);
};
const face=(n,k)=>choose(n,k)*2**(n-k);
const vertex=n=>face(n,0);
const edge=n=>face(n,1);
const facets=n=>face(n,n-1);
const tri=n=>n*(n+1)/2;
// Q3 is the primitive geometric unit; Q0=point,Q1=interval,Q2=square.
for(let k=1;k<=6;k++){
  for(let r=0;r<3;r++){
    const n=3*k+r;
    assert(vertex(n)===8**k*2**r,"Qn Cartesian product "+n);
    if(k>1) assert(vertex(n)===8*vertex(n-3),"cube-block expansion "+n);
    assert(vertex(n+1)===2*vertex(n),"interval expansion "+n);
  }
}
for(let n=1;n<=17;n++){
  let sum=0;
  for(let j=0;j<=n;j++){
    const f=face(n,j); sum+=f;
    if(n>1&&j<n) assert(f===2*face(n-1,j)+((j===0)?0:face(n-1,j-1)),"face recurrence "+n+","+j);
  }
  assert(sum===3**n,"three-state face count "+n);
}
assert(JSON.stringify([0,1,2,3].map(j=>face(3,j)))===JSON.stringify([8,12,6,1]),"Q3 f-vector");
assert(JSON.stringify([0,1,2,3,4].map(j=>face(4,j)))===JSON.stringify([16,32,24,8,1]),"Q4 f-vector");
assert(JSON.stringify([0,1,2,3].map(j=>face(6,j)))===JSON.stringify([64,192,240,160]),"Q6 f-vector");
assert(vertex(6)===64 && vertex(10)===1024 && edge(8)===1024 && facets(8)===16,"64/1024/16 anchors");
assert(tri(facets(8))===136 && edge(8)-tri(facets(8))===888,"Q8 faces vs edges");
assert(16+8+112===136,"facet pair categories");
assert(1024/16===64 && edge(7)===448,"do not confuse quotient with edges per facet");
assert(vertex(13)===8192 && facets(13)===26,"Q13 facets");
const V=face(3,0), E=face(3,1), F=face(3,2);
const [a,b,c]=[V,V+E,V+E+F];
assert(a===8 && b===20 && c===26,"cumulative Q3");
assert(JSON.stringify([a,b,c].map(x=>x/2))===JSON.stringify([4,10,13]),"primitive cuboid");
assert(a+b+c===54 && a*b+a*c+b*c===888 && a*b*c===4160,"cuboid measures");
const ABC=[3,6,9], D=[1,-2,1], center=ABC.map(x=>x*3);
for(const sign of [-1,1]){
  const x=center.map((v,i)=>v+sign*D[i]);
  assert(x.reduce((s,z)=>s+z,0)===54,"mirror perimeter");
  assert(x[0]*x[1]+x[0]*x[2]+x[1]*x[2]===888,"mirror invariant");
}
assert(8**3===512 && 2*8**3===1024, "two 512-cell physical cubes");
const gridEdges=3*7*8*8;
assert(gridEdges===1344 && edge(9)===2304 && gridEdges!==edge(9),"3D grid does not equal Q9");
console.log("PASS geometric three ladders Q(3k),Q(3k+1),Q(3k+2), n<=17; Q8 1024/136/888; Q3 cuboid 8/20/26");
