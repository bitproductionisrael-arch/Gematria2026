"use strict";
// RovGrid external-priority and geometry audit, 19 November 2026.
// This verifies arithmetic only, not textual intent, historical priority, or physical interpretation.
const assert=(p,label)=>{if(!p)throw Error("FAIL: "+label);};
const sum=a=>a.reduce((x,y)=>x+y,0);
const values=[913,203,86,401,395,407,296];
const T=n=>n*(n+1)/2;
const dodec=n=>30*n*n+2;
const platonicSurfaces=n=>[2*n*n+2,6*n*n+2,4*n*n+2,dodec(n),10*n*n+2];
const prism=n=>(n+1)*(3*n*n+3*n+1);
const rhomb=n=>n**4-(n-1)**4;
const glued=n=>prism(n)-n;
assert(sum(values)===2701 && T(73)===2701 && 37*73===2701,"Genesis sum and factorization");
assert(sum(values.slice(0,5))===1998 && sum(values.slice(5))===703 && T(37)===703,"Genesis word split");
let divisible=0;
for(let mask=1;mask<(1<<values.length);mask++){
  let s=0;for(let i=0;i<values.length;i++)if(mask&(1<<i))s+=values[i];
  if(s%37===0)divisible++;
}
assert(divisible===23,"Jenkins subset multiples of 37");
assert(sum(platonicSurfaces(1))===62 && platonicSurfaces(1).join(",")==="4,8,6,32,12","John five-surface n=1");
assert(sum(platonicSurfaces(8))===3338 && sum(platonicSurfaces(8))===52*8**2+10,"John five-surface n=8");
assert(20+12===32 && 12+20+30===62,"distinct 32 and 62 vertex/intersection counts");
assert(888+123===1011 && 913+296===1209 && 888+321===913+296 && 888+123===203+401+407,"forum arithmetic check");
assert(5476===74**2 && 814===22*37 && 5476-814===7*666 && 5476-814===6*777,"John full-letter totals");
assert(271===10**3-9**3 && 369===5**4-4**4 && 271*369===99999,"3D/4D shells and repeating reciprocal");
for(let n=0;n<50;n++){
  assert(rhomb(n+1)-prism(n)===n**3,"universal cube bridge n="+n);
  assert(glued(n)===3*n*(n+1)**2+1,"glued-center formula n="+n);
}
assert(prism(9)===2710 && glued(9)===2701 && rhomb(10)===3439,"n9 bridge");
for(let d=3;d<=12;d++){
  const V=d*(d-1)+2,E=2*d*(d-1),F=d*(d-1);
  assert(V-E+F===2,"Euler zonotope d="+d);
}
assert(2**6===64 && 20+12===32,"6Cube inputs and projected hull");
assert(2**10===1024 && 10*9+2===92 && 2*10*9===180 && 10*9===90,"10Cube inputs and generic projected hull");
console.log(JSON.stringify({PASS:true,Genesis:2701,T73:T(73),T37:T(37),subsetsMultiple37:divisible,JohnN1:platonicSurfaces(1),JohnN8:platonicSurfaces(8),shellProduct:271*369,cubicBridgeN9:rhomb(10)-prism(9),gluedN9:glued(9),hyperCube6:64,hyperCube10:1024},null,2));
