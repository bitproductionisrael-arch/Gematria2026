// RovGrid 14.11.2026 — adjoining 8-cubes, odd intermediate, general LCM theorem
"use strict";
const check=(b,s)=>{if(!b)throw new Error('FAIL '+s)};
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>a*b/gcd(a,b);
check(8**3+8**3===1024,'two cubes');
check(8**3-6**3===296,'single shell');
check(8*8*16-6*6*14===520,'joined shell');
check(2*296-520===72,'seam');
check(8**3-7**3===169&&7**3-6**3===127&&169+127===296,'parity cube');
check(8*8*16-7*7*15===289&&7*7*15-6*6*14===231&&289+231===520,'parity cuboid');
check(289===17**2,'17 square');
for(let n=1;n<=100;n++){
 const a=2*n**3-(n-1)**2*(2*n-1);
 check(a===5*n*n-4*n+1,'generic first phase');
 if(a===(2*n+1)**2)check(n===8,'unique first phase square');
}
const [A,B,C]=[8,20,26];
check(gcd(gcd(A,B),C)===2,'gcd vector');
check(lcm(lcm(A*B,A*C),B*C)===A*B*C/2,'LCM face products');
check(160+208+520===888&&20*26===520,'pair products');
check(lcm(lcm(160,208),520)===2080,'name LCM');
check(2080===4*520&&2080===728+1352,'two shell representations');
for(let a=1;a<=16;a++)for(let b=1;b<=16;b++)for(let c=1;c<=16;c++){
 const actual=lcm(lcm(a*b,a*c),b*c);
 const predicted=a*b*c/gcd(gcd(a,b),c);
 check(actual===predicted,'general LCM '+[a,b,c]);
}
console.log(JSON.stringify({status:'PASS',rectangularShell:520,intermediateOddCuboid:735,intermediateDifferences:[289,231],LCM:2080,universalityTriplesChecked:4096},null,2));
