"use strict";
// RovGrid: 48-path 72-name scanner, 15 letter maps and 7+ structural methods.
// No dependencies. Run: node research/rovgrid-agrippa-ibn-ezra-48-path-integral-2026-11-12.js
// Sources: Exodus 14:19-21; Ibn Ezra to Ex.14:19; Agrippa OP III.25.
const VERSES=["ויסעמלאכהאלהימההלכלפנימחנהישראלוילכמאחריהמויסעעמודהעננמפניהמויעמדמאחריהמ","ויבאבינמחנהמצרימובינמחנהישראלויהיהעננוהחשכויאראתהלילהולאקרבזהאלזהכלהלילה","ויטמשהאתידועלהימויולכיהוהאתהימברוחקדימעזהכלהלילהוישמאתהימלחרבהויבקעוהמימ"];
const ABC="אבגדהוזחטיכלמנסעפצקרשת";
const REG_VALUES=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const PI_DIGITS="1415926535897932384626";
const FINALS=["כ","מ","נ","פ","צ"];
const FULL_FINALS=[500,600,700,800,900];
const SMALL_FINALS=[5,6,7,8,9];
const PERMUTATIONS=[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
function assert(ok,label){if(!ok) throw Error("FAIL: "+label);}
function scoreLetter(letter,which){
 const i=ABC.indexOf(letter), g=REG_VALUES[i];
 assert(i>=0,"Unknown letter "+letter);
 switch(which){
  case "regular": return g;
  case "ordinal": return i+1;
  case "small": return i%9+1; // match calculator HE_KATAN
  case "zero_step": return g>=10&&g%10===0?g/10:g;
  case "atbash_regular": return REG_VALUES[21-i];
  case "atbash_ordinal": return 22-i;
  case "albam_regular": return REG_VALUES[(i+11)%22];
  case "albam_ordinal": return (i+11)%22+1; // experimental extension
  case "avgad_regular": return REG_VALUES[(i+1)%22];
  case "kidmi": return REG_VALUES.slice(0,i+1).reduce((a,b)=>a+b,0);
  case "perati_regular": return g*g;
  case "perati_ordinal": return (i+1)*(i+1);
  case "pi_alphabet": return Number(PI_DIGITS[i]); // engine research map
  case "ayak_regular": {
   const j=i<9?i:i<18?i-9:i<22?i-18:i;
   let row=i<9?0:i<18?1:2;
   // AIQ-BKR chambers: (letter j, letter j+9, letter j+18 or final);
   // for 22 regular letters, third tier starts only at indices 18..21.
   if(row===0)return REG_VALUES[j+9];
   if(row===1)return j<4?REG_VALUES[j+18]:FULL_FINALS[j-4];
   return REG_VALUES[j];
  }
  default:throw Error("Unknown method: "+which);
 }
}
const LETTER_METHODS=[
 "regular","ordinal","small","zero_step","atbash_regular",
 "atbash_ordinal","albam_regular","albam_ordinal","avgad_regular",
 "kidmi","perati_regular","perati_ordinal","pi_alphabet","ayak_regular"
];
function sum(a){return a.reduce((x,y)=>x+y,0)}
function reverse(s){return [...s].reverse().join("")}
function tripletValue(name,method){return sum([...name].map(c=>scoreLetter(c,method)))}
function finalBig(char){const j=FINALS.indexOf(char);return j<0?scoreLetter(char,"regular"):FULL_FINALS[j]}
function finalSmall(char){const j=FINALS.indexOf(char);return j<0?scoreLetter(char,"small"):SMALL_FINALS[j]}
function digitalRoot(n){return n===0?0:1+(n-1)%9}
function structural(name){
 const [a,b,c]=[...name].map(ch=>scoreLetter(ch,"regular"));
 const prefix=3*a+2*b+c;
 const positional=a+2*b+3*c;
 return {
  prefix_building:prefix,
  positional,
  ratzo_return:5*a+3*b+c, // prefix sums + return
  addsub_ladder:4*(a+b+c), // sum prefixes and suffixes
  balanced:2*(a+b+c), // calc's equal multiplier (len+1)/2
  final_regular:a+b+finalBig(name[2]),
  final_small:scoreLetter(name[0],"small")+scoreLetter(name[1],"small")+finalSmall(name[2]),
  word_reduced:digitalRoot(tripletValue(name,"small")),
  word_position_regular:3*(a+b+c),
  word_position_ordinal:3*tripletValue(name,"ordinal"),
  letter_product:a*b*c,
  letter_pair_products:a*b+a*c+b*c
 };
}
function paths(){
 assert(VERSES.length===3 && VERSES.every(x=>[...x].length===72),"input 3x72");
 const result=[];
 for(let mask=0;mask<8;mask++){
  const rows=VERSES.map((text,j)=>mask&(1<<j)?reverse(text):text);
  for(const p of PERMUTATIONS){
   const names=Array.from({length:72},(_,i)=>p.map(j=>rows[j][i]).join(""));
   const additive=Object.fromEntries(LETTER_METHODS.map(m=>[m,sum(names.map(n=>tripletValue(n,m)))]));
   const nonadditive=Object.fromEntries(Object.keys(structural(names[0])).map(k=>[k,sum(names.map(n=>structural(n)[k]))]));
   const namesRegular=names.map(n=>tripletValue(n,"regular"));
   let pair888=0,pair1024=0,triple888=0,triple1024=0;
   for(let i=0;i<72;i++) for(let j=i+1;j<72;j++){
    const two=namesRegular[i]+namesRegular[j];
    if(two===888)pair888++;
    if(two===1024)pair1024++;
    for(let k=j+1;k<72;k++){
     if(two+namesRegular[k]===888)triple888++;
     if(two+namesRegular[k]===1024)triple1024++;
    }
   }
   const pair=nonadditive.letter_pair_products, product=nonadditive.letter_product;
   result.push({
    orientation_mask:mask, orientations:VERSES.map((_,j)=>mask&(1<<j)?"reverse":"forward"),
    layer_order:p.map(i=>i+19), permutation:p.join(""),
    traditional:mask===2&&p.join("")==="012",
    agrippa_all_forward:mask===0&&p.join("")==="012",
    names, additive, structural:nonadditive,
    polynomial:[72,additive.regular,pair,product],
    pair_hits:{888:pair888,1024:pair1024},
    triple_hits:{888:triple888,1024:triple1024}
   });
  }
 }
 return result;
}
function audit(){
 const states=paths();
 assert(states.length===48,"48 paths");
 const conventional=states.find(s=>s.traditional);
 const straight=states.find(s=>s.agrippa_all_forward);
 assert(conventional.names[0]==="והו" && conventional.names[36]==="אני","traditional names");
 assert(straight.names[0]==="ווו","same-direction opening name");
 const additiveBase=conventional.additive;
 assert(additiveBase.regular===9143 && additiveBase.ordinal===2159,"global totals");
 assert(additiveBase.atbash_ordinal===2809 && additiveBase.small===818,"more totals");
 assert(states.every(s=>LETTER_METHODS.every(m=>s.additive[m]===additiveBase[m])),"all letter maps invariant");
 assert(states.every(s=>s.structural.prefix_building+s.structural.positional===4*9143),"prefix+positional complement");
 assert(states.every(s=>s.structural.addsub_ladder===4*9143),"prefix+suffix ladder");
 const sixOrders={};
 for(const s of states) {
  const id=s.permutation;
  (sixOrders[id]??={prefix:s.structural.prefix_building,positional:s.structural.positional,ratzo:s.structural.ratzo_return,count:0}).count++;
  assert(sixOrders[id].prefix===s.structural.prefix_building,"prefix depends only on layer permutation");
 }
 assert(Object.keys(sixOrders).length===6 && Object.values(sixOrders).every(x=>x.count===8),"6x8 decomposition");
 const polynomials={};
 for(const s of states){
  const key=s.polynomial.join(",");
  (polynomials[key]??={polynomial:s.polynomial,count:0,orientation_masks:[]}).count++;
  if(!polynomials[key].orientation_masks.includes(s.orientation_mask))polynomials[key].orientation_masks.push(s.orientation_mask);
 }
 assert(Object.keys(polynomials).length===4,"4 orientation polynomial classes");
 assert(Object.values(polynomials).every(x=>x.count===12),"each class has 12 paths");
 const polySums=[0,0,0,0];
 for(const s of states)s.polynomial.forEach((v,i)=>polySums[i]+=v);
 const meanPoly=polySums.map(x=>x/48);
 assert(JSON.stringify(meanPoly)==="[72,9143,371563.5,5125273]","finite integral");
 const methodRange={};
 for(const key of Object.keys(conventional.structural)){
  const a=states.map(x=>x.structural[key]);
  methodRange[key]={min:Math.min(...a),max:Math.max(...a),standard:conventional.structural[key],straight:straight.structural[key],unique:new Set(a).size};
 }
 const sampleHits={};
 for(const key of [888,1024]){
  for(const category of ["pair_hits","triple_hits"]){
   const arr=states.map(s=>s[category][key]);
   sampleHits[category+"_"+key]={min:Math.min(...arr),max:Math.max(...arr),mean:sum(arr)/48,
    standard:conventional[category][key],straight:straight[category][key]};
  }
 }
 // Pre-defined middle third of 72 names: positions 25..48, 24 triplets =72 letters.
 // Reversing any 72-letter source row maps [25..48] onto itself as a SET.
 const center=states.map(s=>s.names.slice(24,48));
 const centerValues=center.map(names=>Object.fromEntries(
   LETTER_METHODS.map(m=>[m,sum(names.map(n=>tripletValue(n,m)))])));
 assert(centerValues.every(a=>a.regular===3969 && a.ordinal===756 &&
   a.atbash_ordinal===900 && a.albam_ordinal===888),"central 24-block signature");
 assert(centerValues.every(a=>LETTER_METHODS.every(m=>a[m]===centerValues[0][m])),
  "middle-block invariant in all 14 letter-value methods and 48 paths");
 assert(LETTER_METHODS.filter(m=>centerValues[0][m]===888).join(",")==="albam_ordinal",
  "ALBaM ordinal is the only exact 888 among 14 central additive methods");
 const centralThirdBlocks=[0,24,48].map(start=>({
  indices:[start+1,start+24],regular:sum(conventional.names.slice(start,start+24).map(n=>tripletValue(n,"regular"))),
  albam_ordinal:sum(conventional.names.slice(start,start+24).map(n=>tripletValue(n,"albam_ordinal"))) }));
 assert(JSON.stringify(centralThirdBlocks.map(x=>x.albam_ordinal))==="[872,888,817]",
  "three 24-name blocks in standard reading");
 const windows888={};
 for(const state of states){
  const scores=state.names.map(n=>tripletValue(n,"albam_ordinal"));
  let total=sum(scores.slice(0,24));
  for(let start=0;start<=48;start++){
   if(start>0) total+=scores[start+23]-scores[start-1];
   if(total===888) windows888[start+1]=(windows888[start+1]||0)+1;
  }
 }
 assert(JSON.stringify(windows888)==='{"9":6,"14":6,"25":48,"36":6,"41":6}',
  "all 48x49 window controls");
 const verseTotals=VERSES.map(x=>tripletValue(x,"regular"));
 const verseOrdinal=VERSES.map(x=>tripletValue(x,"ordinal"));
 const verseAtbash=VERSES.map(x=>tripletValue(x,"atbash_ordinal"));
 assert(JSON.stringify(verseTotals)==="[2672,3043,3428]","verse sums");
 assert(verseTotals[0]-2*verseTotals[1]+verseTotals[2]===14,"reg second difference 14");
 assert(verseOrdinal[0]-2*verseOrdinal[1]+verseOrdinal[2]===77,"ord second diff +77");
 assert(verseAtbash[0]-2*verseAtbash[1]+verseAtbash[2]===-77,"atbash second diff -77");
 const externalMilui=[20,26,48,54];
 assert(sum(externalMilui)===148 && 6*148===888,"external milui numeric bridge");
 const completed={description:"Computational exhaustive structural study: 48 paths, 72 triples per path",
  date:"2026-11-12",note:"Meaning of variants is a research model, not historically proven revelation.",
  source:"Exodus 14:19-21", method_count:{additive:LETTER_METHODS.length,structural:Object.keys(conventional.structural).length},
  paths_count:48,triplets_count:3456,
  verse_regular:verseTotals,verse_ordinal:verseOrdinal,verse_atbash_ordinal:verseAtbash,
  finite_second_differences:{regular:14,ordinal:77,atbash_ordinal:-77},
  additive_global:conventional.additive, six_layer_orders:sixOrders,
  four_orientation_classes:Object.values(polynomials),
  uniform_integral_polynomial:meanPoly, structural_method_ranges:methodRange,
  hit_counts_per_path:sampleHits,external_milui_bridge:{
   four_prefix_values:externalMilui,signature:148,six_permutations_total:888,
   interpretation:"external weighting; 888 is NOT forced by source text alone"},
  central_24_name_blocks:centralThirdBlocks,central_25_48_signature:centerValues[0],
  sliding_24_name_888_hits_across_48_paths:windows888,
  center_888_albam_ordinal_invariant:true,
  path_records:states};
 return completed;
}
const RESULT=audit();
if (typeof module!=="undefined"&&module.exports) module.exports={audit,paths,scoreLetter,structural};
if (typeof require!=="undefined"&&require.main===module)
 console.log(JSON.stringify(RESULT,null,2));
