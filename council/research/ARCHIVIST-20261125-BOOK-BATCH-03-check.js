// Maps transcribed from calculator.html blob a36b65dcb6f228756a6744d5507ab135065a8021
console.log(JSON.stringify((()=>{const tiered=i=>(i%9+1)*10**Math.floor(i/9);
const he=Object.fromEntries([... 'אבגדהוזחטיכלמנסעפצקרשת'].map((x,i)=>[x,tiered(i)]));
for(const [f,b] of Object.entries({'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'}))he[f]=he[b];
const gr=Object.fromEntries([... 'αβγδεϝζηθικλμνξοπϙρστυφχψωϡ'].map((x,i)=>[x,tiered(i)]));gr['ς']=gr['σ'];
const sum=(s,m)=>[...s.toLowerCase().normalize('NFD').replace(/\p{M}/gu,'').replace(/\s/g,'')].reduce((a,x)=>{if(!(x in m))throw Error(x);return a+m[x]},0);
const cases=[['OT1','ורוח אלהים מרחפת על פני המים',1369,he],['OT2','והוא מחלל מפשענו מדכא מעונתינו',1369,he],['OT3','נפשי ישובב ינחני',888,he],['NT1','Ος εστιν εικων του Θεου του αορατου',1369,gr],['NT2','το αιμα Ιησου',1110,gr],['NT3','Ιδου ο νυμφιος ερχεται εξερχεσθε εις απαντησιν αυτου',5920,gr],['NT4','απεθανετε γαρ και η ζωη υμων κεκρυπται συν τω Χριστω',7400,gr],['CONTROL1','אלהים',86,he],['CONTROL2','אלוהים',92,he],['CONTROL3','Ιησους',888,gr],['CONTROL4','Ιησου',688,gr],['CONTROL5','Ιδου ο νυμφιος εξερχεσθε εις απαντησιν',0,gr]];
return cases.map(([id,s,expected,m])=>({id,actual:sum(s,m),expected:id==='CONTROL5'?null:expected,pass:id==='CONTROL5'?null:sum(s,m)===expected}));})(),null,2));
