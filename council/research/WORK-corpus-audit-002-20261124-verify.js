const assert=require('node:assert/strict');
const F=([z,y])=>[5n*z+24n*y,z+5n*y];
const inv=([z,y])=>[5n*z-24n*y,5n*y-z];
let hits=[];
for(const seed of [[3n,1n],[9n,2n]]){let p=seed;for(let k=0;k<24;k++){let [z,y]=p;assert.equal(z*z-24n*y*y,-15n);assert.deepEqual(inv(F(p)),p);if(z%18n===3n){let n=(z+15n)/18n;assert.equal(1n+3n*(3n*n-2n)*(3n*n-3n)/2n,y*y);hits.push(n)}p=F(p)}}
hits.sort((a,b)=>a<b?-1:a>b?1:0);assert.deepEqual(hits.slice(0,8),[1n,3n,6n,52n,206449n,2043627n,4863414n,48142828n]);
let p=[1n,0n];for(let k=0;k<6;k++)p=F(p);assert.deepEqual(p,[470449n,96030n]);
const gcd=(a,b)=>b?gcd(b,a%b):a,lcm=(a,b)=>a*b/gcd(a,b);assert.equal(lcm(lcm(22,42),72),5544);assert.equal(22*42*72/5544,12);
const fact=n=>n<=1?1:n*fact(n-1);assert.equal(fact(11)/12,3326400);assert.equal(fact(11)/4,9979200);assert.equal(3326400%999,729);assert.equal(9979200%999,189);
const A='אבגדהוזחטיכלמנסעפצקרשת',V=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400],N={'ם':'מ','ץ':'צ'};const g=s=>[...s.replaceAll(' ','')].reduce((a,c)=>a+V[A.indexOf(N[c]??c)],0);assert.equal(g('את'),401);assert.equal(g('ואת'),407);assert.equal(g('בראשית ברא אלהים'),1202);assert.equal(g('את השמים ואת הארץ'),1499);for(let d=2;d*d<=1499;d++)assert.notEqual(1499%d,0);console.log('PASS',hits.slice(0,8).map(String));