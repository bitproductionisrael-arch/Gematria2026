/* Prime Clock: exact segmented sieve in a browser Web Worker.
   Coverage is exact only for safe integer intervals supported by this implementation. */
"use strict";
let basePrimes=[], baseLimit=1;
function preparePrimes(limit){
  limit=Math.max(2,Math.floor(limit));
  if(limit<=baseLimit) return;
  const sieve=new Uint8Array(limit+1);
  sieve.fill(1,2);
  for(let p=2;p*p<=limit;p++){
    if(sieve[p]) for(let j=p*p;j<=limit;j+=p)sieve[j]=0;
  }
  basePrimes=[];
  for(let p=2;p<=limit;p++)if(sieve[p])basePrimes.push(p);
  baseLimit=limit;
}
function scan(start,end){
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<2||end<=start||end-start>100000||end>100000000000001)
    throw Error("מחוץ לטווח הסריקה המדויק");
  const t=performance.now(),root=Math.floor(Math.sqrt(end-1));
  preparePrimes(root);
  const marks=new Uint8Array(end-start);marks.fill(1);
  for(const p of basePrimes){
    if(p*p>=end)break;
    const first=Math.max(p*p,Math.ceil(start/p)*p);
    for(let v=first;v<end;v+=p)marks[v-start]=0;
  }
  let count=0,first=null,last=null,hash=2166136261>>>0;
  const samples=[],primes=[];
  for(let i=0;i<marks.length;i++)if(marks[i]){
    const n=start+i;count++;primes.push(n);if(first===null)first=n;last=n;
    if(samples.length<7)samples.push(n);
    // Independent browsers use the same stable FNV-1a-style 32-bit checksum.
    const lo=n>>>0,hi=Math.floor(n/4294967296)>>>0;
    hash=Math.imul((hash^lo)>>>0,16777619)>>>0;
    hash=Math.imul((hash^hi)>>>0,16777619)>>>0;
  }
  return {start,end,count,first,last,samples,primes,hash:hash.toString(16).padStart(8,"0"),elapsedMs:Math.round(performance.now()-t),basePrimes:basePrimes.length};
}
function isPrimeSmall(n){if(n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;}
function mersenne(p){
  if(!Number.isInteger(p)||p<3||p>1279)throw Error("במצב הדפדפן אפשר לאמת מעריך ראשוני עד 1279");
  if(!isPrimeSmall(p))return {p,verdict:"composite",reason:"מעריך שאינו ראשוני"};
  const n=(1n<<BigInt(p))-1n;
  let s=4n;
  for(let j=0;j<p-2;j++){
    s=(s*s-2n)%n;
    if(j%Math.max(1,Math.floor((p-2)/25))===0)postMessage({type:"mersenne-progress",done:j+1,total:p-2});
  }
  return {p,verdict:s===0n?"proven-prime":"composite",digits:Math.floor(p*Math.LOG10E*Math.LN2)+1,steps:p-2};
}
onmessage=e=>{
  try{
    if(e.data.type==="scan")postMessage({type:"scan-result",id:e.data.id,result:scan(e.data.start,e.data.end)});
    if(e.data.type==="mersenne")postMessage({type:"mersenne-result",result:mersenne(Number(e.data.p))});
  }catch(error){postMessage({type:"error",message:String(error&&error.message||error)});}
};
