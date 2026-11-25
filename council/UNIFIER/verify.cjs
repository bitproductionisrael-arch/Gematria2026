// Run with Node.js: node verify.cjs
const assert = require("node:assert/strict");
function projection(a, b, c) {
  const points = new Set();
  for (let x = 0; x <= a; x++)
    for (let y = 0; y <= b; y++)
      for (let z = 0; z <= c; z++)
        points.add([x-z, y-z].join(","));
  let interior = 0;
  for (const p of points) {
    const [u,v] = p.split(",").map(Number);
    if (u > -c && u < a && v > -c && v < b && u-v > -b && u-v < a) interior++;
  }
  const vertices = [[a-c,-c],[a,0],[a,b],[0,b],[-c,b-c],[-c,-c]];
  const twiceArea = Math.abs(vertices.reduce((s,[x,y],i) => {
    const [u,v] = vertices[(i+1)%vertices.length];
    return s+x*v-y*u;
  },0));
  const area = a*b+a*c+b*c, sum = a+b+c;
  assert.equal(twiceArea,2*area);
  assert.equal(points.size,area+sum+1);
  assert.equal(interior,area-sum+1);
  return {area, closed:points.size, interior, boundary:points.size-interior};
}
let triples=0;
for(let a=1;a<=8;a++) for(let b=1;b<=8;b++) for(let c=1;c<=8;c++) {
  const p=projection(a,b,c);
  assert.equal(a*b*c-p.interior,(a-1)*(b-1)*(c-1));
  triples++;
}
const counts=[0,0,0,0];
for(const x of [-1,0,1]) for(const y of [-1,0,1]) for(const z of [-1,0,1])
  counts[[x,y,z].filter(v=>v===0).length]++;
const sides=counts.slice(0,3).map((_,i)=>counts.slice(0,i+1).reduce((s,v)=>s+v,0));
assert.deepEqual(sides,[8,20,26]);
const heb = Object.fromEntries([..."אבגדהוזחטיכלמנסעפצקרשת"].map((l,i)=>[l,i<9?i+1:i<18?10*(i-8):100*(i-17)]));
const words=["עמית","מייק","רוב"].map(w=>[...w].reduce((s,l)=>s+heb[l],0));
assert.deepEqual(words,[520,160,208]);
let previous=0;
for(let n=1;n<=24;n++) {
  const h=n**3-(n-1)**3;
  assert.equal(h,1+3*n*(n-1));
  previous+=h;
  assert.equal(previous,n**3);
}
const rows={abc:projection(1,3,6),cubeSpanThree:projection(3,3,3),primitive:projection(4,10,13),full:projection(...sides)};
const edges=8*2**7, pairs=16*17/2;
assert.equal(edges-pairs,rows.full.area);
function depthProfile(a,b,c) {
  const fibers=new Map();
  for(let x=0;x<=a;x++) for(let y=0;y<=b;y++) for(let z=0;z<=c;z++) {
    const key=[x-z,y-z].join(",");
    fibers.set(key,(fibers.get(key)||0)+1);
  }
  const sizes=[...fibers.values()];
  return Array.from({length:Math.max(...sizes)},(_,j)=>{
    const count=sizes.filter(n=>n>j).length;
    const [p,q,r]=[a-j,b-j,c-j];
    assert.equal(count,p*q+p*r+q*r+p+q+r+1);
    return count;
  });
}
const depths={name:depthProfile(8,20,26), twin:depthProfile(10,16,28)};
assert.deepEqual(depths.twin.slice(0,9),depths.name);
assert.deepEqual(depths.twin.slice(9),[187,133]);
console.log(JSON.stringify({depths,triples,counts,sides,words,rows,cubeLayers:24,Q8:{edges,pairs},carry:{xor:888^136,and:888&136}},null,2));
