"use strict";
const assert=require("node:assert/strict");
const alpha=[..."אבגדהוזחטיכלמנסעפצקרשת"],finals=[..."ךםןףץ"],reg={},ord={},small={},zero={},at={},atord={};
alpha.forEach((c,i)=>{reg[c]=i<9?i+1:i<18?(i-8)*10:(i-17)*100;ord[c]=i+1;small[c]=i%9+1});
alpha.forEach((c,i)=>{zero[c]=reg[c]>=10&&reg[c]%10===0?reg[c]/10:reg[c];at[c]=reg[alpha[21-i]];atord[c]=ord[alpha[21-i]]});
const sof={...reg};finals.forEach((c,i)=>sof[c]=(i+5)*100);
const ayak={};for(let d=0;d<9;d++){const triad=[alpha[d],alpha[d+9],d<4?alpha[d+18]:finals[d-4]];triad.forEach((c,i)=>ayak[c]=sof[triad[(i+1)%3]]);}
const sum=(s,m)=>[...s.replace(/\s/g,"")].reduce((n,c)=>n+m[c],0);
let checks=0;const eq=(a,b,name)=>{assert.equal(a,b,name);checks++};
for(const [phrase,map,value] of [
["מערכת",reg,730],["מערכת",small,19],["מערכת",ord,82],["מערכת",zero,73],["מערכת",at,51],["מערכת",atord,33],["מערכת",ayak,1306],
["חכמה",reg,73],["חכמה",small,19],["חכמה",ord,37],
["מי אתה",reg,456],["מי אתה",small,15],["מי אתה",ord,51],["מי אתה",at,541],["מי אתה",atord,64],
["ישראל",reg,541],["ישראל",ord,64],["ישראל",small,10],["ישראל",at,465],["ישראל",atord,51],
["שמש",reg,640],["שמש",ord,55],["שמש",small,10],
["אל",reg,31],["אחד",reg,13],["חי",reg,18],
["בראשית ברא אלהים את השמים ואת הארץ",reg,2701],
["בראשית ברא אלהים את השמים ואת הארץ",small,82]
])eq(sum(phrase,map),value,phrase+":"+value);
eq([..."מערכת"].reduce((n,c)=>n+ord[c]**2,0),1430,"ordinal perati");
eq([..."מערכת"].reduce((n,c,i,a)=>n+a.slice(0,i+1).reduce((v,ch)=>v+reg[ch],0),0),1520,"prefix sums");
eq(sum("מערכת",reg)*5,3650,"letter length weighting");
eq(sum("חכמה",reg)*10,730,"wisdom tenfold");
eq(sum("חכמה",reg)*sum("חכמה",ord),2701,"wisdom genesis");
eq(82+33,115,"system atbash pair");
eq(51+64,115,"who atbash pair");
eq(82-64,18,"right outer step");
eq(64-51,13,"central step");
eq(51-33,18,"left outer step");
eq(82-51,31,"el delta 1");
eq(64-33,31,"el delta 2");
eq(sum("מערכת",at),sum("מי אתה",ord),"system atbash to who ordinal");
eq(sum("מי אתה",at),sum("ישראל",reg),"who atbash to israel regular");
eq(sum("מי אתה",atord),sum("ישראל",ord),"who atbash to israel ordinal");
eq(sum("ישראל",ord)*10,sum("שמש",reg),"israel sun scale");
eq(sum("ישראל",small),sum("שמש",small),"israel sun small");
console.log("PASS",checks,"checks");
