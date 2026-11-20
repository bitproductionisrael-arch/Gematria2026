"use strict";
// Generated and preflight executed in connected JS environment.
function verify() {
  const assert=(v,m)=>{if(!v)throw new Error("FAIL: "+m)};
  const N=(a,b)=>a*a+a*b+b*b;
  const multiply=([a,b],[c,d])=>[a*c-b*d,a*d+b*c+b*d];
  const mod3=x=>((x%3)+3)%3;
  const residue=([a,b])=>mod3(a-b);
  const matrix=([a,b])=>[[a,-b],[b,a+b]];
  const det=m=>m[0][0]*m[1][1]-m[0][1]*m[1][0];
  const apply=(m,[a,b])=>[m[0][0]*a+m[0][1]*b,m[1][0]*a+m[1][1]*b];
  const z37=[4,3],z73=[8,1],z2701=multiply(z37,z73);
  assert(N(...z37)===37,"norm37");assert(N(...z73)===73,"norm73");
  assert(z2701[0]===29 && z2701[1]===31,"Eisenstein product");
  assert(N(...z2701)===2701 && N(...z2701)===37*73,"multiplicative norm");
  assert(det(matrix(z37))===37 && det(matrix(z73))===73 && det(matrix(z2701))===2701,"2x2 determinants");
  const mm=(A,B)=>[
   [A[0][0]*B[0][0]+A[0][1]*B[1][0],A[0][0]*B[0][1]+A[0][1]*B[1][1]],
   [A[1][0]*B[0][0]+A[1][1]*B[1][0],A[1][0]*B[0][1]+A[1][1]*B[1][1]]
  ];
  assert(JSON.stringify(mm(matrix(z37),matrix(z73)))===JSON.stringify(matrix(z2701)),"matrix composition");
  for(let r=0;r<=4;r++){
    const pts=[];
    for(let a=-r;a<=r;a++)for(let b=-r;b<=r;b++)if(Math.max(Math.abs(a),Math.abs(b),Math.abs(a+b))<=r)pts.push([a,b]);
    assert(pts.length===1+3*r*(r+1),"hex ball radius "+r);
    if(r===3)assert(pts.length===37,"37 centered points");
  }
  const ringCount=n=>{
    let count=0;
    for(let a=-70;a<=70;a++)for(let b=-70;b<=70;b++)if(N(a,b)===n)count++;
    return count;
  };
  assert(ringCount(37)===12 && ringCount(73)===12,"norm37/73 rings twelve vectors");
  const g1=[0,1,1,1],g2=[1,0,1,2];
  const tetracode=new Set();
  let weight3=0;
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){
    const code=g1.map((x,k)=>mod3(i*x+j*g2[k]));
    tetracode.add(code.join(""));
    if(code.some(x=>x!==0)){assert(code.filter(x=>x!==0).length===3,"tetracode weight3");weight3++;}
  }
  assert(tetracode.size===9 && weight3===8,"9 tetracode words, 8 nonzero");
  const coordinates=[];
  for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){const n=N(a,b);if(n===0||n===1||n===3)coordinates.push({pair:[a,b],n,res:residue([a,b])});}
  assert(coordinates.filter(x=>x.n===0).length===1 && coordinates.filter(x=>x.n===1).length===6 && coordinates.filter(x=>x.n===3).length===6,"coordinate norms");
  let roots=[],type24=0,type216=0;
  for(const x of coordinates)for(const y of coordinates)for(const z of coordinates)for(const w of coordinates){
    if(x.n+y.n+z.n+w.n!==3)continue;
    if(!tetracode.has([x.res,y.res,z.res,w.res].join("")))continue;
    const v=[x.pair,y.pair,z.pair,w.pair];
    roots.push(v);
    const norms=[x.n,y.n,z.n,w.n];
    if(norms.includes(3))type24++;else type216++;
  }
  assert(roots.length===240 && type24===24 && type216===216,"240=24+216 roots");
  const serialize=v=>JSON.stringify(v);
  const rootSet=new Set(roots.map(serialize));
  assert(rootSet.size===240,"distinct roots");
  assert(roots.every(v=>rootSet.has(serialize(v.map(([a,b])=>[-a,-b])))),"120 opposite root pairs");
  for(const zz of [z37,z73,z2701,[0,1]]){
    for(const v of roots){
      const w=v.map(coord=>multiply(coord,zz));
      assert(w.every((pair,i)=>residue(pair)===residue(v[i])) || zz[0]===0,"code preserved by scalar index37/73/2701");
      assert(w.reduce((sum,pair)=>sum+N(...pair),0)===3*N(...zz),"norm scaled for all E8 roots");
      if(zz[0]===0)assert(rootSet.has(serialize(w)),"hex 60 degree rotation automorphism");
    }
  }
  assert(37**4===1874161 && 73**4===28398241 && 2701**4===53222875750801,"8D similarity indices");
  assert(240/2===120 && 240+8===248,"E8 Lie and pairs");
  assert(248+120===368 && 248+208===456 && 456-368===88 && 120+88===208,"gematria number bridges");
  assert(120+16===136 && 120*8+16*4===1024,"independent Pascal/D4 bridges");
  assert(37*24===888 && 37*64===2368 && 73*74/2===2701,"RovGrid anchors");
  return {status:"PASS",hex37:"1+6+12+18",tetracodeWords:9,roots:roots.length,rootKinds:[type24,type216],e8Index37:37**4,e8Index73:73**4};
}
console.log(JSON.stringify(verify(),null,2));
