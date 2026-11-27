const eq=(a,b,label)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(label+": "+JSON.stringify([a,b]));checks++};let checks=0;
const C=(n,k)=>k<0||k>n?0:Array.from({length:k},(_,i)=>i+1).reduce((a,i)=>a*(n-i+1)/i,1);
const T=n=>n*(n+1)/2;
const H="אבגדהוזחטיכלמנסעפצקרשת",E="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const norm=s=>s.replace(/[ךםןףץ]/g,c=>"כמנפצ"["ךםןףץ".indexOf(c)]);
const ord=(s,a=H)=>[...norm(s)].filter(c=>a.includes(c)).reduce((v,c)=>v+a.indexOf(c)+1,0);
const reg=s=>[...norm(s)].filter(c=>H.includes(c)).map(c=>H.indexOf(c)+1).reduce((v,x)=>v+(x<10?x:x<19?10*(x-9):100*(x-18)),0);
const edges=[];for(let i=1;i<=8;i++)for(let j=i+1;j<=8;j++)edges.push([i,j]);eq(edges.length,28,"K8");
const extra=edges.filter(([i,j])=>j<=4),core=edges.filter(([i,j])=>j>4),cross=edges.filter(([i,j])=>i<=4&&j>4);eq([extra.length,core.length,cross.length],[6,22,16],"core");
eq([1+2+3,4+5+6+7,4+7,5+6],[6,22,11,11],"rows");
const pairs=[];for(let i=0;i<6;i++){const partner=extra.findIndex(e=>e.every(v=>!extra[i].includes(v)));eq(extra[partner].every(v=>!extra[i].includes(v)),true,"opposite");if(i<partner)pairs.push([i,partner]);}
eq(pairs.length,3,"matchings");
const alpha=0,pa=pairs.find(p=>p.includes(alpha));eq(pa.map(i=>extra[i]),[[1,2],[3,4]],"alpha matching");
let hist=Array(7).fill(0),alphaHist=Array(7).fill(0),pairedHist=Array(7).fill(0),alphaPairHist=Array(7).fill(0);
for(let mask=0;mask<64;mask++){const has=i=>Boolean(mask&(1<<i));const n=extra.filter((_,i)=>has(i)).length;hist[n]++;if(has(alpha))alphaHist[n]++;if(pairs.every(([a,b])=>has(a)===has(b))){pairedHist[n]++;if(has(alpha))alphaPairHist[n]++;}}
eq(hist,[1,6,15,20,15,6,1],"Pascal6");eq(alphaHist,[0,1,5,10,10,5,1],"alpha coeff");eq(pairedHist,[1,0,3,0,3,0,1],"pair masks");eq(alphaPairHist,[0,0,1,0,2,0,1],"alpha-first");
for(let k=0;k<=6;k++)eq(hist[k],C(5,k)+C(5,k-1),"Pascal recurrence");
const sizes=[28,27,26,24,22];eq(sizes.reduce((a,b)=>a+b,0),127,"sum");eq(22+24+26,72,"72");eq(27+28,55,"55");eq(127,2**7-1,"seven bits");
eq(sizes.map(n=>C(n,2)),[378,351,325,276,231],"gates");eq(378-231,22*6+C(6,2),"additional gates");eq(378-231,3*49,"147");
let even=0,odd=0,central=0,offcentral=0;for(let r=0;r<16;r++)for(let c=0;c<=r;c++){const e=C(r,c)%2===0;if(e)even++;else odd++;const inside=r>=8&&r<=14&&c>=r-7&&c<=7;if(inside){eq(e,true,"central hole");central++}else if(e)offcentral++;}
eq([even,odd,central,offcentral],[55,81,28,27],"Pascal16");eq(55,28+3*6+9,"old partition");eq(T(16),136,"T16");eq(Array.from({length:11},(_,k)=>C(10,k)).reduce((a,b)=>a+b,0),1024,"row10");eq(32**2-T(16),888,"complement");
eq(2**3,8,"pair choices");eq(C(6,3),20,"middle coefficient");eq(28-2,26,"one pair removed");eq([8*20,8*26,20*26,8*20*26],[160,208,520,4160],"box");eq(160+208+520,888,"box faces");eq([reg("מייק"),reg("רוב"),reg("עמית")],[160,208,520],"name parts");eq([ord("רוב"),ord("ROV",E),ord("AMITMIKEROV",E)],[28,55,136],"name ordinals");
const genesis="בראשית ברא אלהים את השמים ואת הארץ";eq([genesis.replaceAll(" ","").length,genesis.split(" ").length,reg(genesis)],[28,7,2701],"Genesis");eq(55**2-18**2,2701,"mirror");eq(37*73,2701,"37x73");
eq(2159,17*127,"72 full ordinal");eq(28+27+26+24+22+9,136,"sum with 9");eq(1024-136,24*37,"24x37");console.log(checks+" checks passed");