"use strict";
const assert=(c,m)=>{if(!c)throw Error(m)};
const alpha="אבגדהוזחטיכלמנסעפצקרשת", weights=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const dict=Object.fromEntries([...alpha].map((c,i)=>[c,weights[i]]));
const fin={"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"};
const gem=(s)=>{
 const letters=[...s].map(c=>fin[c]||c).filter(c=>c in dict);
 return [letters.reduce((a,c)=>a+dict[c],0),letters.reduce((a,c)=>a+alpha.indexOf(c)+1,0),letters.reduce((a,c)=>a+[...String(dict[c])].reduce((b,d)=>b+Number(d),0),0)];
};
const verse="בראשית ברא אלהים את השמים ואת הארץ".split(" ");
const expected=[[913,76,13],[203,23,5],[86,41,14],[401,23,5],[395,62,17],[407,29,11],[296,44,17]];
verse.forEach((w,i)=>assert(JSON.stringify(gem(w))===JSON.stringify(expected[i]),"word "+w));
assert(JSON.stringify(gem(verse.join(" ")))===JSON.stringify([2701,298,82]),"verse");
const ring=[verse[0],verse[1],verse[2],verse[4],verse[5],verse[6]],mid=verse[3];
const before=[[1517,122,23],[690,87,24],[882,126,36],[1203,114,33],[1104,96,33],[1610,143,35]];
const after=[[1523,128,29],[696,93,30],[888,132,42],[1209,120,39],[1110,102,39],[1616,149,41]];
for(let i=0;i<6;i++){
 const parts=[ring[i],ring[(i+1)%6],mid];
 assert(JSON.stringify(gem(parts.join(" ")))===JSON.stringify(before[i]),"before triangle "+i);
 assert(JSON.stringify(gem([...parts,"ו"].join(" ")))===JSON.stringify(after[i]),"after triangle "+i);
}
const sum=(a)=>[0,1,2].map(j=>a.reduce((s,r)=>s+r[j],0));
assert(JSON.stringify(sum(before))===JSON.stringify([7006,688,184]),"before totals");
assert(JSON.stringify(sum(after))===JSON.stringify([7042,724,220]),"after totals");
assert(2*(2701-401)+6*401+6*6===7042,"six edges count");
assert(3*3+6*6+9*9===126 && 8*9/2===36,"ABC tri");
const choose=(n,k)=>{let r=1;for(let i=1;i<=k;i++)r=r*(n-i+1)/i;return Math.round(r)};
const f=(n,j)=>choose(n,j)*2**(n-j);
for(let n=1;n<=17;n++){
 assert(Array.from({length:n+1},(_,j)=>f(n,j)).reduce((a,b)=>a+b,0)===3**n,"faces "+n);
 for(let j=0;j<n;j++)if(n>1) assert(f(n,j)===2*f(n-1,j)+(j===0?0:f(n-1,j-1)),"recurrence "+n+","+j);
}
assert(f(4,0)===16 && f(6,0)===64 && f(8,1)===1024 && f(8,7)===16 && f(10,0)===1024 && f(13,12)===26,"anchors");
assert(16*17/2===136 && 1024-136===888,"T16");
for(let k=1;k<=5;k++)for(let r=0;r<3;r++)assert(f(3*k+r,0)===8**k*2**r,"ladders");
assert(8*20+8*26+20*26===888 && 8*20*26===4160,"cuboid");
assert(64*65/2===2080 && 6*64*63+1===24193 && 64**2===4096 && 64*(2*64-1)===8128,"sequences");
assert(8128*8+512===65536,"hexagonal-to-Q16");
assert(1000/2===500 && 1024/2===512 && 488*2+24===1000,"complements");
const c4=[...Array(10).keys()].filter(x=>15-x>=0&&15-x<=9);
assert(c4.length===4,"4-bit closed 4 states =2 pairs");
console.log("PASS entire conversation: genesis, six edge-ו triangles, three geometric ladders, 1024/136/888, 64 sequences, complement models");
