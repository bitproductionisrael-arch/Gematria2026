const assert = require('node:assert/strict');
const simple = Object.fromEntries([... 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((c,i)=>[c,i+1]));
const jewish = Object.fromEntries([... 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((c,i)=>[c,[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500][i]]));
const he = [...'אבגדהוזחטיכלמנסעפצקרשת'];
const reg = Object.fromEntries(he.map((c,i)=>[c,i<9?i+1:i<18?(i-8)*10:(i-17)*100]));
const ord = Object.fromEntries(he.map((c,i)=>[c,i+1]));
const norm = s=>s.replace(/[ךםןףץ]/g,c=>({'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'})[c]);
const sum=(s,m)=>[...norm(s.toUpperCase())].reduce((v,c)=>v+(m[c]||0),0);
const small=Object.fromEntries(he.map(c=>[c,1+(reg[c]-1)%9]));
for(const [s,m,n] of [
['GOD',jewish,61],['GOD',simple,26],['ABBA',jewish,6],['THE HIDDEN KEY CODE OF GOD',jewish,777],['CODE',jewish,62],
['אבא',reg,4],['אני',reg,61],['יהוה',reg,26],['אני יהוה',reg,87],['יהודי',reg,35],['אחד',reg,13],['אהיה',reg,21],['הוא',reg,12],['יחידה',reg,37],['חכמה',reg,73],['חכמה',ord,37],['אני הוא',reg,73],['אני הוא',ord,37],['עמית מייק רוב',reg,888],['עמית מייק רוב',small,33],['AMIT MIKE ROV',jewish,1024],['AMIT MIKE ROV',simple,136],['בראשית ברא אלהים את השמים ואת הארץ',reg,2701]])assert.equal(sum(s,m),n,s);
const p=[];for(let n=2;p.length<33;n++)if(!p.some(d=>d*d<=n&&n%d===0))p.push(n);
assert.equal(p[11],37);assert.equal(p[20],73);assert.equal(p[32],137);
const S=n=>6*n*(n-1)+1,H=n=>3*n*(n-1)+1,T=n=>n*(n+1)/2;
assert.equal(S(2),13);assert.equal(S(3),37);assert.equal(S(4),73);assert.equal(H(4)+6*T(3),73);
assert.equal((61+13)/2,37);assert.equal((61-13)/2,24);assert.equal(37*24,888);assert.equal(61**2-13**2,4*888);assert.equal(1024-136,888);
assert.equal(5**3-4**3,61);assert.equal(4**3-3**3,37);assert.equal(61-37,24);
assert.equal(37*73,2701);assert.equal(1+2+3+4+5+6,21);assert.equal(1+6,7);assert.equal(2+5,7);assert.equal(3+4,7);
console.log('All GOD / hexagram / RovGrid arithmetic checks passed.');
