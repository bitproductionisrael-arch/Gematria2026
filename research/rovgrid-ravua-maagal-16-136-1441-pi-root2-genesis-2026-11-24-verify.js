"use strict";
const he=[..."אבגדהוזחטיכלמנסעפצקרשת"],v={},p={};
he.forEach((c,i)=>{p[c]=i;v[c]=i<9?i+1:i<18?(i-8)*10:(i-17)*100});
Object.entries({ך:"כ",ם:"מ",ן:"נ",ף:"פ",ץ:"צ"}).forEach(([c,b])=>v[c]=v[b]);
const fill={ר:"ריש",ב:"בית",ו:"ויו",ע:"עין",מ:"מם",ג:"גימל",ל:"למד"};
const pi="1415926535897932384626",rt="4142135623730950488016";
const s=a=>a.reduce((a,b)=>a+b,0);
const reg=w=>s([...w].map(c=>v[c]));
const ord=w=>s([...w].map(c=>p[c]+1));
const small=w=>s([...w].map(c=>p[c]%9+1));
const zero=w=>s([...w].map(c=>v[c]>=10&&v[c]%10===0?v[c]/10:v[c]));
const milui=w=>s([...w].map(c=>reg(fill[c])));
const hp=(w,d)=>s([...w].map(c=>Number(d[p[c]])));
const root=w=>1+(reg(w)-1)%9;
const words=["רבוע","מעגל"],w=words.join("");let t=0;
function eq(a,b,k){if(a!==b)throw Error(k+": "+a+" != "+b);t++}
for(const [f,expected] of [[reg,[278,143]],[ord,[44,44]],[small,[17,17]],[zero,[35,17]],[milui,[1074,367]],[root,[8,8]],[x=>hp(x,pi),[14,19]],[x=>hp(x,rt),[4,7]]])words.forEach((x,i)=>eq(f(x),expected[i],"word "+x));
for(const [a,b,k] of [[reg(w),421,"regular"],[ord(w),88,"ordinal"],[zero(w),52,"zero"],[milui(w),1441,"milui"],[s(words.map(root)),16,"word reduction"],[s(words.map(x=>4*small(x))),136,"weighted small"],[hp(w,pi),33,"pi"],[hp(w,rt),11,"root2"],[zero(w)-small(w),18,"חי"],[16*17/2,136,"T16"],[6*16*15+1,1441,"S16"],[6*15*14+1,1261,"S15"],[1261+1441-1,2701,"S15+S16-S1"],[37*73,2701,"Genesis factors"],[55**2-18**2,2701,"difference squares"],[1441-10*136,81,"bridge"]])eq(a,b,k);
console.log("PASS: "+t+" checks");
