function run(){
const H=Array.from("אבגדהוזחטיכלמנסעפצקרשת"), E=Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
const vals=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const R=Object.fromEntries(H.map((c,i)=>[c,vals[i]]));for(const [f,b] of Object.entries({"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"}))R[f]=R[b];
const K=Object.fromEntries(Object.entries(R).map(([c,n])=>[c,(n-1)%9+1]));const Z=Object.fromEntries(Object.entries(R).map(([c,n])=>[c,n>=10?n/10:n]));
const M=Object.fromEntries(H.map((c,i)=>[c,["אלף","בית","גימל","דלת","הא","ויו","זין","חית","טית","יוד","כף","למד","מם","נון","סמך","עין","פא","צדי","קוף","ריש","שין","תיו"][i]]));
const sum=(w,m)=>Array.from(w).reduce((s,c)=>s+(m[c]||0),0),shadow=w=>Array.from(w).map(c=>M[c].slice(1)).join("");
const triple=w=>[sum(w,R),sum(w,K),sum(w,Z)];
let results=[];const check=(id,actual,expected)=>{let pass=JSON.stringify(actual)===JSON.stringify(expected);results.push({id,pass,actual,expected});};
check("SH-01",triple(shadow("בצלאל")),[622,37,73]);
const words=["עמית","מייק","רוב"];let shadows=words.map(w=>({w,shadow:shadow(w),v:triple(shadow(w)),full:triple(Array.from(w).map(c=>M[c]).join("")),original:triple(w)}));
check("SH-02",shadows.map(x=>x.full.map((n,i)=>n-x.original[i])),shadows.map(x=>x.v));
check("SH-03",H.map(c=>sum(shadow(c),Z)-sum(shadow(c),K)),H.map(c=>Array.from(shadow(c)).reduce((s,t)=>s+(R[t]>=100?9*(R[t]/100):0),0)));
const at=w=>Array.from(w).map(c=>H[21-H.indexOf(c)]).join(""),rotate=w=>w.slice(-1)+w.slice(0,-1);
check("KT-01",[at("כתיבה"),rotate(at("כתיבה")),at(rotate("כתיבה"))],["לאמשצ","צלאמש","צלאמש"]);
check("KT-02",[sum("כתיבה",R),sum("צלאמש",R),sum("צלאמש",R)-sum("כתיבה",R)],[437,461,24]);
const binom=(n,k)=>{if(n<k||k<0)return 0;let a=1;for(let i=1;i<=k;i++)a=a*(n-i+1)/i;return a;};
const sig=(a,d=4)=>{let b=a.slice(),out=[];for(let i=0;i<d;i++){out.push(b.reduce((s,v)=>s+v,0));let t=0;b=b.map(v=>t+=v);}return out;};
let census=[];for(const [alphabet,map,ws,expected] of [[H,R,words,[[232,2,1,1],[415,12,1,1],[21,1,1,1]]],[E,Object.fromEntries(E.map((c,i)=>[c,i+1])),["AMIT","MIKE","ROV"],[[9240,87,5,1],[7110,130,6,1],[300,10,1,1]]]]){
 const ord=Object.fromEntries(alphabet.map((c,i)=>[c,i+1]));for(let i=0;i<ws.length;i++){const w=ws[i], target=sig(Array.from(w).map(c=>map[c])), o=sum(w,ord),counts=[0,0,0,0];let survivors=[];function rec(a,oo){if(a.length===w.length){if(oo!==o)return;const z=sig(a.map(c=>map[c]));for(let k=0;k<4;k++){if(z[k]!==target[k])break;counts[k]++;if(k===3)survivors.push(a.join(""));}return;}for(const c of alphabet)rec([...a,c],oo+ord[c]);}rec([],0);census.push({w,target,counts,survivors});check("TE-"+w,counts,expected[i]);}
}
const mat=(n)=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>binom(n-1-j+i,i)));
function det(m){let a=m.map(r=>r.slice()),d=1;for(let i=0;i<a.length;i++){let p=i;while(p<a.length&&!a[p][i])p++;if(p===a.length)return 0;if(p!==i){[a[p],a[i]]=[a[i],a[p]];d=-d;}let q=a[i][i];d*=q;for(let j=i+1;j<a.length;j++){let r=a[j][i]/q;for(let k=i;k<a.length;k++)a[j][k]-=r*a[i][k];}}return Math.round(d);}
check("TE-INV",Array.from({length:8},(_,i)=>det(mat(i+1))),Array.from({length:8},(_,i)=>i*(i+1)/2%2?-1:1));
const T=n=>binom(n+1,2),Te=n=>binom(n+2,3),P=n=>binom(n+3,4);
check("TE-RATIO",Array.from({length:100},(_,i)=>i+1).filter(n=>Te(n)===6*T(n)),[16]);
let pairs=[];for(let i=1;i<=15;i++)for(let j=i+1;j<=15;j++)if(T(i)+T(j)===160)pairs.push([i,j]);check("AX-LAYERS",pairs,[[10,14]]);
check("AX-GATES",Array.from({length:4},(_,k)=>32-3*2**(3-k)),[8,20,26,29]);
check("PE-01",[P(16),P(17),P(17)-P(16)],[3876,4845,969]);
check("PE-02",Array.from({length:100},(_,i)=>i+1).every(n=>P(2*n-1)===P(n)+10*P(n-1)+5*P(n-2)),true);
let intersection=0;for(let a=0;a<=6;a++)for(let b=0;b<=6;b++)for(let c=0;c<=6;c++)for(let d=0;d<=6;d++){let e=15-a-b-c-d;if(e>=0&&e<=6)intersection++;}check("PE-03",intersection,1451);
const cels=[];for(const a of "01*")for(const b of "01*")for(const c of "01*")cels.push(a+b+c);const stages=[0,1,2].map(k=>cels.filter(s=>Array.from(s).filter(x=>x==="*").length<=k));check("CH-01",stages.map(x=>x.length),[8,20,26]);check("CH-02",[[0,1],[0,2],[1,2]].map(([i,j])=>stages[i].flatMap(a=>stages[j].filter(b=>b!==a)).length),[152,200,500]);
return {results,shadows,census,pass:results.filter(x=>x.pass).length,failed:results.filter(x=>!x.pass).length};
}
console.log(JSON.stringify(run(),null,2));
