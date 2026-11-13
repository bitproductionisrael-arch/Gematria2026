// RovGrid 2026-11-14: universal 8 shell, odd-26, modulo 13 bridge.
'use strict';
const check=(x,s)=>{if(!x)throw Error('FAIL '+s)};
const S=n=>(2*n)**3-(2*n-2)**3;
const O=n=>(2*n+1)**3-(2*n-1)**3;
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>a*b/gcd(a,b);
check(S(6)===728 && S(8)===1352,'first shells');
check(728+1352===2080 && 1352-728===624,'sum and difference');
check(lcm(160,lcm(208,520))===2080,'three names LCM');
check(lcm(8,26)===104 && 728%104===0 && 1352%104===0,'LCM 8 26');
let hits=[];
for(let m=1;m<=260;m++){
 const shell=S(m),odd=O(m);
 check(shell===8*(3*m*(m-1)+1),'even shell '+m);
 check(odd===24*m*m+2 && odd%8===2,'odd shell '+m);
 const should=m%13===6||m%13===8;
 check((shell%26===0)===should,'congruence characterization '+m);
 if(shell%26===0)hits.push(m);
}
check(hits[0]===6&&hits[1]===8,'first two congruence hits');
console.log(JSON.stringify({status:'PASS',mod13Roots:[6,8],firstTwoEvenSideLengths:[12,16],shells:[728,1352],sum:2080,firstHits:hits.slice(0,12)},null,2));
