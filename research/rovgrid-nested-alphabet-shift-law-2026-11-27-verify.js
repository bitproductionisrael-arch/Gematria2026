const assert = (condition,msg)=>{if(!condition)throw Error(msg)};
const H="אבגדהוזחטיכלמנסעפצקרשת", G="ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ", E="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const names=["והו","ילי","סיט","עלם","מהש","ללה","אכא","כהת","הזי","אלד","לאו","ההע","יזל","מבה","הרי","הקם","לאו","כלי","לוו","פהל","נלך","ייי","מלה","חהו","נתה","האא","ירת","שאה","ריי","אום","לכב","ושר","יחו","להח","כוק","מנד","אני","חעם","רהע","ייז","ההה","מיך","וול","ילה","סאל","ערי","עשל","מיה","והו","דני","החש","עמם","ננא","נית","מבה","פוי","נמם","ייל","הרח","מצר","ומב","יהה","ענו","מחי","דמב","מנק","איע","חבו","ראה","יבם","היי","מום"];
const norm=s=>s.replace(/[ךםןףץ]/g,c=>"כמנפצ"["ךםןףץ".indexOf(c)]);
const ord=(s,a=H)=>[...norm(s)].filter(c=>a.includes(c)).map(c=>a.indexOf(c)+1);
const rot=(x,k)=>1+(x-1+k)%(2*k);
const mir=(x,k)=>2*k+1-x;
const lift=(x,k,l,j=Array.from({length:k},(_,i)=>i+1))=>j[(x-1)%k]+(x>k?l:0);
function stat(a,k){const L=a.filter(x=>x<=k).length,R=a.length-L,S=a.reduce((t,x)=>t+x,0),A=a.reduce((t,x)=>t+rot(x,k),0);assert(A-S===k*(L-R),"half balance");return [S,A,L,R]}
function combos(n,k,start=1,p=[]){if(!k)return [p];let a=[];for(let i=start;i<=n-k+1;i++)a.push(...combos(n,k-1,i+1,[...p,i]));return a}
assert(names.length===72 && names.every(x=>x.length===3),"source");
const center=ord(names.slice(24,48).join(""));
const cases=[["בראשית ברא אלהים את השמים ואת הארץ",[[298,320],[311,335],[324,350],[337,365]]],["אאלהיםאתהשמי",[[114,136],[119,143],[124,150],[129,157]]],["קול רוח פה",[[93,93],[97,97],[101,101],[105,105]]],["בקול ברוח בפה",[[99,132],[103,139],[107,146],[111,153]]],["עמית מייק רוב",[[141,130],[147,135],[153,140],[159,145]]],[names.join(""),[[2159,2577],[2248,2704],[2337,2831],[2426,2958]]],[names.slice(24,48).join(""),[[756,888],[786,930],[816,972],[846,1014]]]];
let tests=0;
for(let k=11;k<=14;k++)for(const j of combos(k,11))for(let x=1;x<=22;x++){assert(lift(rot(x,11),11,k,j)===rot(lift(x,11,k,j),k),"commutation");tests++}
for(const [s,expected] of cases)for(let k=11;k<=14;k++){assert(JSON.stringify(stat(ord(s).map(x=>lift(x,11,k)),k).slice(0,2))===JSON.stringify(expected[k-11]),s);tests++}
const ranges=[[888,888],[930,1002],[972,1116],[1014,1230]];
const expectedHits=[[[9,32,888],[14,63,1776],[23,72,1776],[25,48,888]],[[4,27,888],[17,39,888],[32,55,888]],[[4,26,888],[9,52,1776]],[[28,48,888]]];
for(let k=11;k<=14;k++){const vals=combos(k,11).map(j=>stat(center.map(x=>lift(x,11,k,j)),k)[1]);assert(JSON.stringify([Math.min(...vals),Math.max(...vals)])===JSON.stringify(ranges[k-11]),"range");tests++;let hits=[];const a=names.map(s=>stat(ord(s).map(x=>lift(x,11,k)),k)[1]);for(let i=0;i<72;i++){let s=0;for(let j=i;j<72;j++){s+=a[j];if(s%888===0)hits.push([i+1,j+1,s]);tests++}}assert(JSON.stringify(hits)===JSON.stringify(expectedHits[k-11]),"windows")}
for(const [s,a,v] of [["ΚΟΛ ΡΟΥΧ ΠΗ",G,[133,97,3,6]],["ΒΚΟΛ ΒΡΟΥΧ ΒΠΗ",G,[139,139,6,6]],["QOL RWH PH",E,[117,91,3,5]],["BQOL BRWH BPH",E,[123,136,6,5]],["VOICE WIND MOUTH",E,[181,181,7,7]],["BY VOICE BY WIND BY MOUTH",E,[262,262,10,10]],["AMIT MIKE ROV",E,[136,175,7,4]],["AMIT MIIK ROV",E,[140,179,7,4]],["NEH YISRAEL VAYELEKH MEACHAREIHEM VAYISA AM YISRAEL VAYEHI HEANAN VEHACHOSHEKH VAYAER ET H ET HAYAM BERUACH KADIM AZAH KOL HALAILAH",E,[1100,1776,82,30]]]){assert(JSON.stringify(stat(ord(s,a),a.length/2))===JSON.stringify(v),s);tests++}
for(let k=11;k<=13;k++){let count=0;for(const j of combos(k+1,k)){if(Array.from({length:2*k},(_,i)=>i+1).every(x=>lift(mir(x,k),k,k+1,j)===mir(lift(x,k,k+1,j),k+1)))count++;}assert(count===(k%2?0:1),"simultaneous mirror");tests++}
console.log(tests+" checks passed");