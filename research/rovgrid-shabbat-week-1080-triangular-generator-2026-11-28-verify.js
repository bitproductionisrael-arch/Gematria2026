// ROVGRID — exact word equation and triangular generator, 2026-11-28
'use strict';
const T=n=>n*(n+1n)/2n;
const reg=Object.fromEntries([... 'אבגדהוזחטיכלמנסעפצקרשת'].map((c,i)=>[c,BigInt(i<9?i+1:i<18?(i-8)*10:(i-17)*100)]));
const ord=Object.fromEntries(Object.keys(reg).map((c,i)=>[c,BigInt(i+1)]));
for(const [f,b] of Object.entries({'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'})){reg[f]=reg[b];ord[f]=ord[b]}
const small=Object.fromEntries(Object.entries(reg).map(([c,v])=>[c,1n+(v-1n)%9n]));
const g=(s,m=reg)=>[...s].reduce((a,c)=>a+(m[c]||0n),0n);
let count=0;
function eq(a,b,label){if(a!==b)throw Error(label+': '+a+' != '+b);count++}
const A=g('שבת'),B=g('שבוע'),D=g('יום'),C=g('ואת הארץ'),F=B-1n;
eq(A,702n,'Shabbat');eq(B,378n,'week');eq(D,56n,'day');eq(C,703n,'Genesis closing');eq(F,377n,'shifted week');
eq(g('שבת',ord),45n,'ordinal Shabbat');eq(g('שבוע',ord),45n,'ordinal week');eq(g('יום',ord),29n,'ordinal day');
eq(g('שבת',small),9n,'small Shabbat');eq(g('שבוע',small),18n,'small week');eq(g('יום',small),11n,'small day');
eq(A+B-D,1024n,'minus day');eq(A+B+D,1136n,'plus day');eq(A-B,324n,'difference');
eq(A+B,C+F,'unit shift');eq(C-F,326n,'shifted difference');
eq(T(27n),B,'T27');eq(T(37n),C,'T37');eq(T(46n),1081n,'T46');eq(T(25n),325n,'T25');
eq(C+B,T(46n),'upper triangle');eq(C-B,T(25n),'lower triangle');eq(T(25n)-1n,18n**2n,'square');
eq(A*B-C*F,325n,'product loss');eq(C*C+F*F-A*A-B*B,650n,'square sum gain');
eq(A,27n*26n,'27 x 26');eq(B,27n*14n,'27 x 14');eq(D,27n+29n,'day 27+29');
eq(C,37n*19n,'T37 factor');eq(F,13n*29n,'F14 factor');
let fib=[0n,1n];for(let i=2;i<=15;i++)fib.push(fib[i-1]+fib[i-2]);
eq(fib[14],F,'F14');eq(fib[7],13n,'F7');eq(fib[6]+fib[8],29n,'Lucas7');eq(fib[15]*fib[13]-fib[14]**2n,1n,'Cassini');
eq(g('בראשית ברא אלהים את השמים ואת הארץ'),2701n,'Genesis');eq(2701n-C,37n*54n,'Genesis prefix');eq(2701n,50n*54n+1n,'Genesis 54-grid');
eq(A,13n*54n,'Shabbat 54-grid');eq(B,7n*54n,'week 54-grid');eq(A+B,20n*54n,'sum 54-grid');
eq((A+B)/2n-A,-162n,'center displacement');eq(C-(A+B)/2n,163n,'shifted center displacement');
eq(A+B,3n*360n,'three rotations');eq(A+B,6n*180n,'octagon');eq(1024n-136n,888n,'lower bridge');eq(1136n-136n,1000n,'upper bridge');eq(1000n-888n,2n*D,'bridge width');
eq(g('שבת שבוע',ord)-g('יום',ord),61n,'ordinal minus day');eq(g('שבת שבוע',ord)+g('יום',ord),119n,'ordinal plus day');eq(g('שבת שבוע',small)-g('יום',small),16n,'small minus day');eq(g('שבת שבוע',small)+g('יום',small),38n,'small plus day');
for(let k=1n;k<=1000n;k++){
 eq(T(3n*k)+T(4n*k+1n),T(5n*k+1n),'general triangle');
 eq((3n*k)*(3n*k-1n)+1n-T(4n*k+1n),k*(k-9n),'square selector');
 eq(T(4n*k+1n)-T(3n*k)-T(3n*k-2n),k*(9n-k),'second triangle selector');
}
console.log(count+' exact checks passed');
