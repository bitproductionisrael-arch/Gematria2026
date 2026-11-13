// RovGrid: universal peeling theorem; reproducible check for all even side lengths
'use strict';
const assert=(ok,what)=>{if(!ok)throw Error(what)};
const H=m=>3*m*(m-1)+1;
const S=m=>(2*m)**3-(2*m-2)**3;
let solutions=[];
for(let m=1;m<=1000;m++){
 const s=S(m), edge=2*m-2;
 assert(s===8*H(m)&&s===8+12*edge+6*edge**2, 'cube shell '+m);
 assert(s%8===0,'even parity');
 const total=Array.from({length:m},(_,k)=>8*H(k+1)).reduce((a,b)=>a+b,0);
 assert(total===(2*m)**3,'telescoping '+m);
 const odd=(2*m+1)**3-(2*m-1)**3;
 assert(odd===24*m*m+2&&odd%8===2,'odd parity');
 const rem=2*(2*m)**3-3*s;
 assert(rem-136===8*(m-4)*(2*m*m-m+5),'unique factor '+m);
 if(rem===136)solutions.push(m);
}
assert(solutions.length===1&&solutions[0]===4,'only side 8');
for(const L of [16,32,48,64]){
 let old=64*L;
 const shells=[];
 for(let k=1;k<=4;k++){
  const core=k===4?0:(8-2*k)**2*(L-2*k);
  shells.push(old-core);old=core;
 }
 assert(shells.join(',')===[28*L+72,20*L-8,12*L-40,4*L-24].join(','),'cuboid L='+L);
}
for(let d=1;d<=12;d++) for(let m=1;m<=10;m++)
 assert((2*m)**d-(2*m-2)**d===2**d*(m**d-(m-1)**d),'dimension '+d);
console.log(JSON.stringify({status:'PASS',evenSizesTested:1000,unique136EvenSide:8,firstShells:[1,2,3,4,5,6,7,8].map(m=>({side:2*m,H:H(m),shell:S(m)})),dDimensionsTested:12},null,2));
