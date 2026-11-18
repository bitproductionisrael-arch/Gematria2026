"use strict";
// Genesis Fractional Code: reconstruct September 2026 message, independently verify and separate geometry from interpretation.
const assert=(v,m)=>{if(!v)throw Error(m)};
const centeredHex=n=>3*n*(n-1)+1;
const hex=n=>n*(2*n-1);
const cubeShell=n=>n**3-(n-1)**3;
const digitValues={ה:5,ר:200,י:10,ו:6,ן:50};
const ordinal={ה:5,ר:20,י:10,ו:6,ן:14};
const zeroOnce={ה:5,ר:20,י:1,ו:6,ן:5};
const sum=o=>Object.values(o).reduce((a,b)=>a+b,0);
assert(sum(digitValues)===271,"regular herayon");
assert(sum(ordinal)===55,"ordinal herayon");
assert(sum(zeroOnce)===37,"one-step zero herayon");
assert(centeredHex(10)===271 && cubeShell(10)===271,"centered hexagon C10 shell");
assert(centeredHex(4)===37&&cubeShell(4)===37,"centered hexagon C4 shell");
assert(cubeShell(5)===61,"shell5");
assert(hex(37)===2701,"hexagonal H37");
assert(37*73===2701,"Genesis factors");
assert(369===10*37-1 && 2701===10*271-9,"two decimal transforms");
assert(271*369===99999 && 10**5-1===99999,"reciprocal periods");
assert(369*271===10**5-1,"mirror repetends");
assert(369-271===98 && 369+271===640,"sum-difference");
assert(369===271+37+61,"shell decomposition");
assert(cubeShell(4)+cubeShell(5)===125-27,"shell telescope");
assert(271===135+1+135 && 271===6*45+1,"pregnancy-centered hex split");
assert(2701===1350+1+1350,"scaled 2-wing split");
assert(2701-271===2430 && 2430===27*90,"increment");
assert(271===320-49 && 369===320+49,"symmetry around 320");
assert(320**2-49**2===99999 && 320**2===100*1024 && 49**2===2401,"difference of squares");
assert((99999/369)===271 && (99999/271)===369,"exact quotients");
function decimalPeriod(n){
 let r=1%n,s="", seen=new Map();
 while(!seen.has(r)&&r!==0){seen.set(r,s.length);r*=10;s+=String(Math.floor(r/n));r%=n}
 return {period:s.slice(seen.get(r)),prefix:s.slice(0,seen.get(r)),all:s}
}
const a=decimalPeriod(369), b=decimalPeriod(271);
assert(a.period==="00271"&&b.period==="00369","mirror 5-digit period");
console.log(JSON.stringify({status:"PASS",pregnancy:{regular:271,ordinal:55,zero_step:37},hex:{centered10:centeredHex(10),centered4:centeredHex(4),ordinary37:hex(37)},reciprocal:{for369:a,for271:b},difference:98,sum:640,scale:{from271:2701,delta:2430},square_identity:"320² − 49² = 100×1024 − 2401 = 99999"},null,2));
