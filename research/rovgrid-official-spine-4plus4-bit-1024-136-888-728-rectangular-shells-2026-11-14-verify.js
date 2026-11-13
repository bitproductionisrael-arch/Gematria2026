// RovGrid — official spine 2026-11-14, reproducible audit
"use strict";
const check=(condition,label)=>{if(!condition)throw new Error("FAIL "+label);};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const phi=n=>{let k=0;for(let i=1;i<=n;i++)if(gcd(i,n)===1)k++;return k;};
const gray=n=>n^(n>>1);
check(16*16===256 && 4*256===1024,"4+4 bits and four banks");
check(136+888===1024 && 3*(8**3-6**3)===888,"1024,136,888");
check(32**2===1024 && 1024-136===888,"square");
check((8**3-6**3)===296 && 2*296-72===520,"joined shells");
check(2*6*6===72,"seam");
check(8**3+8**3-24===1000,"24");
check(24*37===888 && 1024-88===936,"37 and 88");
check(3**3-1===26 && 12**3-10**3===728,"odd and even shells");
check(208+520===728 && 728===7*104 && 104===26*4 && 104===8*13,"LCM");
check(101+59===160 && 160+728===888,"complement");
check(phi(136)===phi(160)&&phi(136)===64&&phi(728)===phi(888)&&phi(888)===288,"Euler checks");
const expected=[
 [16,[520,312,152,40],[504,192,40,0]],
 [32,[968,632,344,104],[1080,448,104,0]],
 [48,[1416,952,536,168],[1656,704,168,0]],
 [64,[1864,1272,728,232],[2232,960,232,0]]
];
for(const [L,shells,cores] of expected){
 let volume=8*8*L;
 let calc=[];
 for(let k=1;k<=4;k++){
   const inner=k===4?0:(8-2*k)**2*(L-2*k);
   check(inner===cores[k-1],"core "+L+"/"+k);
   const shell=volume-inner;calc.push(shell);
   check(shell===shells[k-1],"shell "+L+"/"+k);
   volume=inner;
 }
 check(calc.reduce((a,b)=>a+b,0)===64*L,"total "+L);
 check(calc.join(",")===[28*L+72,20*L-8,12*L-40,4*L-24].join(","),"linear laws "+L);
}
const bankTotal=[0,0,0,0],bankSelected=[0,0,0,0],codes=new Set();
for(let i=0;i<16;i++)for(let j=0;j<16;j++)for(let tail=0;tail<4;tail++){
 const bank=gray(i)&3;
 bankTotal[bank]++;
 const code=(gray(i)<<6)|(gray(j)<<2)|tail;
 check(!codes.has(code),"Q10 injectivity");codes.add(code);
 if(i<=j && tail===0)bankSelected[bank]++;
}
check(codes.size===1024,"Q10 vertex count");
check(bankTotal.every(x=>x===256) && bankSelected.every(x=>x===34),"balanced Gray banks");
const V=8+128,E=8*128,g=(8-2)*(128-2)/4;
check(V===136&&E===1024&&g===189&&E-V+2-2*g===512,"K8,128");
console.log(JSON.stringify({status:"PASS",bankTotal,bankSelected,bankRemaining:bankSelected.map(x=>256-x),shellTables:expected.map(([L,s,c])=>({L,shells:s,cores:c})),K_bipartite:{V,E,g,F:512}},null,2));
