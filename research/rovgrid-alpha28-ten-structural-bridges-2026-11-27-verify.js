// Alpha28 — ten cross-corpus results. Reproducible, no dependencies.
const names=["והו","ילי","סיט","עלם","מהש","ללה","אכא","כהת","הזי","אלד","לאו","ההע","יזל","מבה","הרי","הקם","לאו","כלי","לוו","פהל","נלך","ייי","מלה","חהו","נתה","האא","ירת","שאה","ריי","אום","לכב","ושר","יחו","להח","כוק","מנד","אני","חעם","רהע","ייז","ההה","מיך","וול","ילה","סאל","ערי","עשל","מיה","והו","דני","החש","עמם","ננא","נית","מבה","פוי","נמם","ייל","הרח","מצר","ומב","יהה","ענו","מחי","דמב","מנק","איע","חבו","ראה","יבם","היי","מום"];
const H="אבגדהוזחטיכלמנסעפצקרשת",E="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const norm=s=>s.replace(/[ךםןףץ]/g,c=>"כמנפצ"["ךםןףץ".indexOf(c)]);
const ar=s=>[...norm(s)].filter(c=>H.includes(c)).map(c=>H.indexOf(c)+1);
const sum=a=>a.reduce((a,b)=>a+b,0);
const reg=s=>sum(ar(s).map(x=>x<10?x:x<19?10*(x-9):100*(x-18)));
const sig=ns=>{const a=ns.flatMap(ar);return [sum(a.map(x=>(x-1)%11+1)),a.filter(x=>x<=11).length,a.filter(x=>x>11).length]};
let checks=0;const eq=(a,b,t)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(t+": "+JSON.stringify([a,b]));checks++};
const edges=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)edges.push([i,j]);
const key=e=>e.join(",");
const directions=Array.from({length:7},(_,i)=>edges.filter(([a,b])=>(a^b)===i+1));
eq(directions.map(a=>a.length),[4,4,4,4,4,4,4],"XOR matchings");for(const d of directions)eq(new Set(d.flat()).size,8,"disjoint");eq(new Set(directions.flat().map(key)).size,28,"partition");
const planes=[];for(let m=0;m<256;m++){const v=Array.from({length:8},(_,i)=>i).filter(i=>m>>i&1);if(v.length===4&&v.reduce((a,b)=>a^b,0)===0)planes.push(v)}
eq(planes.length,14,"affine planes");for(const e of edges)eq(planes.filter(v=>e.every(x=>v.includes(x))).length,3,"three planes per edge");
const pairs=[[[0,1],[2,3]],[[0,2],[1,3]],[[0,3],[1,2]]],perms=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
const paths=perms.flatMap(p=>Array.from({length:8},(_,m)=>p.flatMap((i,j)=>m>>j&1?[pairs[i][1],pairs[i][0]]:pairs[i])));
eq(new Set(paths.map(JSON.stringify)).size,48,"oriented pair schedules");
function cliqueCounts(deleted){const removed=new Set(deleted.map(key)),c=Array(9).fill(0);for(let m=0;m<256;m++){const v=Array.from({length:8},(_,i)=>i).filter(i=>m>>i&1);if(v.every((x,i)=>v.slice(i+1).every(y=>!removed.has(key([x,y])))))c[v.length]++}return c;}
const sizes=[0,1,2,4,6],expected=[[1,8,28,56,70,56,28,8,1],[1,8,27,50,55,36,13,2,0],[1,8,26,44,41,20,4,0,0],[1,8,24,36,29,12,2,0,0],[1,8,22,28,17,4,0,0,0]];
for(const p of paths)for(let i=0;i<sizes.length;i++)eq(cliqueCounts(p.slice(0,sizes[i])),expected[i],"all 48 orders");
const q=Array.from({length:9},(_,i)=>sum(expected.map(a=>a[i])));
eq(q,[5,40,127,214,212,128,47,10,1],"clique sum polynomial");eq(expected.map(sum),[256,192,144,112,80],"all clique totals");eq(sum(q),28**2,"28 squared");eq(sum(q),16*49,"16 times 49");eq(q[2]+1,q[5],"edges vs 5 cliques");eq(q[5],2**7,"128");eq(q[3],reg("רוח"),"ruach");eq(q[4],reg("דבור"),"dibur");
eq(names.length,72,"names");const thirds=[0,24,48].map(i=>sig(names.slice(i,i+24)));eq(thirds,[[377,45,27],[426,42,30],[377,40,32]],"thirds");eq(q[3]+q[4],thirds[1][0],"central J");eq(sig(["קול רוח פה"])[0],49,"voice J");eq(thirds[1][0]-thirds[0][0],49,"voice gap");
const all=sig(names);eq(all,[1180,127,89],"all JLR");eq(q[2],all[1],"edge sum vs L");eq(all[0]+11*all[2],expected[4][4]*q[2],"ordinal equals core 4-cliques times summed edges");eq(all[0]+11*all[2],2159,"ordinal");eq(all[1]-all[2],sum([...("MIKE")].map(c=>E.indexOf(c)+1)),"MIKE half imbalance");eq(reg("חפא"),89,"kol albam");
for(let k=11;k<=14;k++){eq((thirds[2][0]+k*thirds[2][2])-(thirds[0][0]+k*thirds[0][2]),5*k,"outer S difference");eq((thirds[0][0]+k*thirds[0][1])-(thirds[2][0]+k*thirds[2][1]),5*k,"outer A difference");}
eq(5*11,sum([...("ROV")].map(c=>E.indexOf(c)+1)),"ROV");eq(5*13,reg("אדני"),"Adonai");
const hits=[];for(let n=1;n<=35;n++){let a=sig(names.slice(0,n))[0],b=sig(names.slice(-n))[0];if(a===b)hits.push([n,a,72-2*n,sig(names.slice(n,72-n))[0]])}
eq(hits,[[18,280,36,620],[21,320,30,540],[24,377,24,426]],"all nonempty symmetric cuts");eq(620,reg("חקוקות"),"engraved");eq(620,reg("כתר"),"crown");eq(540,10*54,"ten times box sum");
console.log(checks+" assertions passed");