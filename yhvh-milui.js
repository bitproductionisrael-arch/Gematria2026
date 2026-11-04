'use strict';
/* Source-linked four-letter YHWH Milui cards.
 * Traditional sources are distinguished from RovGrid-defined and newly derived spellings.
 * Add entries to this array; cards automatically wrap into rows of three on desktop. */
const YHVH_MILUI_BOOK_SOURCE='https://he.wikisource.org/wiki/היכל_הברכה/דברים';
const YHVH_MILUI_PELIA_SOURCE='https://he.wikisource.org/wiki/ספר_הפליאה/ט';
const YHVH_MILUI_RESEARCH_SOURCE='https://github.com/bitproductionisrael-arch/Gematria2026/blob/main/research/yhvh-milui-gallery-2026-11-04.md';
const YHVH_MILUI_GALLERY=[
 {id:'rov54',name:'מילוי רגיל · נ״ד',parts:['יוד','הא','ויו','הא'],source:'RovGrid · מילוי רגיל',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'site',note:'בסיס רוב מחקרינו. לתפיסתנו, זהו המילוי המודרני שהאל מבקש להפיץ בעולם; הוא נפוץ בכלי גימטריה.'},
 {id:'rov54t',name:'מילוי תלמודי',parts:['יוד','הא','ויו','הא'],source:'RovGrid · נוסח תו',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'site',note:'בראשית א׳:א = 5476 = (37+37)² = 74²; עד = 74 (נצח). באנגלית פשוטה: Gematria, Jewish, English, Simple, Messiah, Jesus, Netzah = 74.'},
 {id:'ab72',name:'ע״ב · מילוי יודין',parts:['יוד','הי','ויו','הי'],source:'היכל הברכה, דברים',url:YHVH_MILUI_BOOK_SOURCE,kind:'traditional'},
 {id:'sag63',name:'ס״ג · מילוי מעורב',parts:['יוד','הי','ואו','הי'],source:'היכל הברכה, דברים',url:YHVH_MILUI_BOOK_SOURCE,kind:'traditional'},
 {id:'mah45',name:'מ״ה · מילוי אלפין',parts:['יוד','הא','ואו','הא'],source:'היכל הברכה, דברים',url:YHVH_MILUI_BOOK_SOURCE,kind:'traditional'},
 {id:'ban52',name:'ב״ן · מילוי ההין',parts:['יוד','הה','וו','הה'],source:'היכל הברכה, דברים',url:YHVH_MILUI_BOOK_SOURCE,kind:'traditional'},
 {id:'rov45',name:'מילוי אלפין (ואו)',parts:['יוד','הא','ואו','הא'],source:'RovGrid · מיפוי אלפין',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'site'},
 {id:'rov54m',name:'מילוי מים',parts:['יוד','הא','ויו','הא'],source:'RovGrid · מ→מים',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'site'},
 {id:'peliah45',name:'מילוי פליאה',parts:['יוד','הא','ואו','הא'],source:'ספר הפליאה, פרק ט׳',url:YHVH_MILUI_PELIA_SOURCE,kind:'traditional'},
 {id:'mix01',name:'צירוף מחקרי · הי/ויו/הא',parts:['יוד','הי','ויו','הא'],source:'RovGrid · צירוף נגזר, לא שם מסורתי',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'derived'},
 {id:'mix02',name:'צירוף מחקרי · הא/ויו/הי',parts:['יוד','הא','ויו','הי'],source:'RovGrid · צירוף נגזר, לא שם מסורתי',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'derived'},
 {id:'mix03',name:'צירוף מחקרי · הי/ואו/הא',parts:['יוד','הי','ואו','הא'],source:'RovGrid · צירוף נגזר, לא שם מסורתי',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'derived'},
 {id:'mix04',name:'צירוף מחקרי · הא/ואו/הי',parts:['יוד','הא','ואו','הי'],source:'RovGrid · צירוף נגזר, לא שם מסורתי',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'derived'},
 {id:'mix05',name:'צירוף מחקרי · הי/וו/הא',parts:['יוד','הי','וו','הא'],source:'RovGrid · צירוף נגזר, לא שם מסורתי',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'derived'},
 {id:'mix06',name:'צירוף מחקרי · הא/וו/הי',parts:['יוד','הא','וו','הי'],source:'RovGrid · צירוף נגזר, לא שם מסורתי',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'derived'}
];
function yhvhMiluiLetterValue(name){
 const letters=Array.from(name);
 if(!letters.length||letters.some(c=>!Object.prototype.hasOwnProperty.call(HE_VAL,c)))throw new Error('Invalid YHWH Milui letter name: '+name);
 return letters.reduce((n,c)=>n+HE_VAL[c],0);
}
function yhvhMiluiValues(def){
 const letters=Array.from('יהוה');
 if(!def||def.parts.length!==4||def.parts.some((p,i)=>!p.startsWith(letters[i])))throw new Error('YHWH Milui must expand four source letters: '+(def?.id||''));
 return def.parts.map(yhvhMiluiLetterValue);
}

const YHVH_COMPARE_PROFILES={rov54:'standard',rov54t:'talmudic',rov54m:'mayim',rov45:'alfin',peliah45:'pelia'};
const YHVH_COMPARE_PRESETS=['יהוה','בראשית','בראשית ברא אלהים את השמים ואת הארץ','משיח','עמית מייק רוב','שמות'];
let yhvhCompareText='יהוה';
function yhvhCleanPhrase(value){
 return String(value||'').normalize('NFC').replace(/[\u0591-\u05c7]/g,'').replace(/[^א-תךםןףץ\s]/g,' ').replace(/\s+/g,' ').trim().slice(0,180);
}
function yhvhFlattenMilui(text,profile){
 const calc=calculateMilui(text,profile);
 return {parts:calc.words.flatMap(w=>w.parts.map(p=>({letter:p.letter,name:p.name,value:p.value}))),total:calc.total};
}
function yhvhComputeMilui(def,text){
 if(text==='יהוה'){
  const names=def.parts,letters=Array.from('יהוה');
  const parts=names.map((name,i)=>({letter:letters[i],name,value:yhvhMiluiLetterValue(name)}));
  return {parts,total:sum(parts.map(p=>p.value)),scope:''};
 }
 const profile=YHVH_COMPARE_PROFILES[def.id];
 if(profile)return {...yhvhFlattenMilui(text,profile),scope:''};
 if(def.kind==='derived')return null; // asymmetric ה spellings do not define an alphabet-wide rule
 if(def.kind==='traditional'){
  if(def.parts[1]!==def.parts[3])return null;
  // Explicit site-level extrapolation: source documents the four-letter divine name,
  // while other letters take RovGrid standard spellings. Do not claim historical source.
  const map={...MILUI_NAMES,'ה':def.parts[1],'ו':def.parts[2]};
  const parts=Array.from(text).flatMap(letter=>{
   const name=miluiNameForLetter(letter,map);
   return name?[{letter,name,value:yhvhMiluiLetterValue(name)}]:[];
  });
  return {parts,total:sum(parts.map(p=>p.value)),scope:'הרחבה מחקרית של נוסח יהוה; שאר האותיות לפי המילוי הרגיל באתר'};
 }
 return null;
}
function yhvhComparisonDetail(parts,baseline){
 const diffs=new Map();
 parts.forEach((p,i)=>{
  const base=baseline.parts[i];
  if(!base||p.name===base.name)return;
  const key=p.letter+'|'+base.name+'|'+p.name;
  const found=diffs.get(key)||{letter:p.letter,before:base.name,after:p.name,count:0,delta:0};
  found.count++;found.delta+=p.value-base.value;diffs.set(key,found);
 });
 return [...diffs.values()].map(d=>d.letter+': '+d.before+'→'+d.after+(d.count>1?' ×'+d.count:'')+' ('+(d.delta>0?'+':'')+d.delta+')').join(' · ');
}
function yhvhMiluiSourceHtml(def){
 return '<div class="yhvh-milui-source" title="מקור: '+esc(def.source)+'">מקור: <a href="'+esc(def.url)+'" target="_blank" rel="noopener noreferrer">'+esc(def.source)+'</a></div>';
}
function yhvhMiluiLettersHtml(parts,baseline,extraClass=''){
 return '<div class="yhvh-milui-letters'+(extraClass?' '+extraClass:'')+'">'+parts.map((p,i)=>{
  const changed=!!baseline?.parts[i]&&baseline.parts[i].name!==p.name;
  return '<div class="yhvh-milui-letter'+(changed?' changed':'')+'"><span class="base">'+esc(p.letter)+'</span><span class="arrow" aria-hidden="true">↓</span><strong class="expanded">'+esc(p.name)+'</strong><span class="value">'+fmt(p.value)+'</span></div>';
 }).join('')+'</div>';
}
function yhvhMiluiCardHtml(def,phrase,baseline){
 const heading='<h3>'+esc(def.name)+'</h3>'+yhvhMiluiSourceHtml(def)+(def.note?'<div class="yhvh-milui-note">'+esc(def.note)+'</div>':'');
 const computed=yhvhComputeMilui(def,phrase);
 if(!computed){
  return '<article class="yhvh-milui-card" data-milui-id="'+esc(def.id)+'" data-milui-kind="'+esc(def.kind)+'">'+heading+
    '<div class="yhvh-milui-no-result">צירוף המוגדר לשם יהוה בלבד; אין ממנו כלל מילוי מוסכם לביטוי הנבחר.</div>'+
    '<div class="yhvh-milui-scope">דוגמת המקור: יהוה = '+fmt(sum(yhvhMiluiValues(def)))+'</div></article>';
 }
 if(computed.parts.length!==baseline.parts.length)throw new Error('YHWH comparison letter count differs from standard');
 const delta=computed.total-baseline.total;
 const detail=yhvhComparisonDetail(computed.parts,baseline);
 const many=computed.parts.length>9;
 const displayParts=many?computed.parts.slice(0,8):computed.parts;
 const displayBaseline=many?{parts:baseline.parts.slice(0,8)}:baseline;
 const letters=yhvhMiluiLettersHtml(displayParts,displayBaseline,many?'yhvh-many-letters':'');
 const math=computed.parts.length<=7
  ?'<div class="yhvh-milui-math" aria-label="סכום ערכי המילוי">'+computed.parts.map((p,i)=>'<span>'+fmt(p.value)+'</span>'+(i<computed.parts.length-1?'<span class="plus" aria-hidden="true">+</span>':'')).join('')+'</div>'
  :'<div class="yhvh-milui-math yhvh-sum-short">סכום '+computed.parts.length+' מילויי אותיות</div>';
 const expanded=many?'<details class="yhvh-milui-details"><summary>הצג את כל '+computed.parts.length+' האותיות והמילויים</summary>'+
   yhvhMiluiLettersHtml(computed.parts,baseline,'yhvh-many-letters')+
   '<div class="yhvh-milui-math yhvh-sum-short">'+computed.parts.map((p,i)=>fmt(p.value)+(i<computed.parts.length-1?' + ':'')).join('')+'</div></details>':'';
 const difference=phrase==='יהוה'?'':('<div class="yhvh-milui-delta'+(delta?' different':'')+'">'+
   (delta?(detail||'שינוי לעומת רגיל: '+(delta>0?'+':'')+delta):'זהה למילוי הרגיל בביטוי זה')+'</div>');
 const total='<div class="yhvh-milui-total-row"><span class="yhvh-milui-total">'+fmt(computed.total)+'</span>'+
   (phrase!=='יהוה'?'<span class="yhvh-milui-relative'+(delta?' changed':'')+'">('+(delta>0?'+':'')+fmt(delta)+' לעומת רגיל)</span>':'')+'</div>';
 return '<article class="yhvh-milui-card" data-milui-id="'+esc(def.id)+'" data-milui-kind="'+esc(def.kind)+'">'+heading+
  (computed.scope?'<div class="yhvh-milui-scope">'+esc(computed.scope)+'</div>':'')+
  '<div class="yhvh-milui-origin" aria-label="הביטוי הנבחר">'+esc(phrase)+'</div>'+letters+expanded+
  difference+math+'<div class="yhvh-milui-equals">=</div>'+total+'</article>';
}
function renderYhvhMiluiTab(inputText=yhvhCompareText){
 const root=document.getElementById('yhvhMiluiGrid');if(!root)return;
 const phrase=yhvhCleanPhrase(inputText);
 if(!phrase){
  root.innerHTML='<p class="yhvh-milui-no-result">הקלד ביטוי בעברית כדי להשוות מילויים.</p>';
  const summary=document.getElementById('yhvhCompareSummary');
  if(summary)summary.textContent='יש להזין לפחות אות עברית אחת';
  return;
 }
 yhvhCompareText=phrase;
 const baseline=yhvhFlattenMilui(phrase,'standard');
 root.innerHTML=YHVH_MILUI_GALLERY.map(def=>yhvhMiluiCardHtml(def,phrase,baseline)).join('');
 const count=document.getElementById('yhvhGuideCount');
 if(count)count.textContent=YHVH_MILUI_GALLERY.length+' מילויים';
 const summary=document.getElementById('yhvhCompareSummary');
 if(summary){
  if(phrase==='יהוה')summary.textContent='יהוה · 15 כרטיסים · ארבעת מילויי השם הקבליים ושיטות האתר';
  else{
   const vals=['standard','talmudic','mayim','alfin','pelia'].map(profile=>calculateMilui(phrase,profile).total);
   summary.textContent=phrase+' · 5 שיטות מלאות · '+new Set(vals).size+' תוצאות מספריות שונות · 4 נוסחי יהוה בהרחבה מחקרית · 6 צירופים המוגדרים ליהוה בלבד';
  }
 }
}
function bindYhvhMiluiComparison(){
 const select=document.getElementById('yhvhComparePreset');
 const input=document.getElementById('yhvhCompareInput');
 const reset=document.getElementById('yhvhCompareReset');
 if(!select||!input||!reset)return;
 select.addEventListener('change',()=>{
  if(select.value==='__custom'){input.focus();input.select();return}
  input.value=select.value;
  renderYhvhMiluiTab(select.value);
 });
 input.addEventListener('input',()=>{
  const phrase=yhvhCleanPhrase(input.value);
  select.value=YHVH_COMPARE_PRESETS.includes(phrase)?phrase:'__custom';
  renderYhvhMiluiTab(phrase);
 });
 reset.addEventListener('click',()=>{
  select.value='יהוה';input.value='יהוה';renderYhvhMiluiTab('יהוה');
 });
}
(function verifyYhvhMiluiGallery(){
 const expected=[54,54,72,63,45,52,45,54,45,63,63,54,54,53,53];
 const found=YHVH_MILUI_GALLERY.map(x=>sum(yhvhMiluiValues(x)));
 if(expected.join(',')!==found.join(',')||new Set(YHVH_MILUI_GALLERY.map(x=>x.id)).size!==15)throw new Error('YHWH gallery values/count mismatch: '+found);
 if(YHVH_MILUI_GALLERY.some(x=>!x.url||!x.source||x.parts.length!==4))throw new Error('YHWH gallery source/four-letter invariant');
 if(YHVH_MILUI_GALLERY[0].id!=='rov54'||YHVH_MILUI_GALLERY[1].id!=='rov54t'||!YHVH_MILUI_GALLERY[0].note||!YHVH_MILUI_GALLERY[1].note)throw new Error('YHWH gallery study notes/order');
 const byId=id=>sum(yhvhMiluiValues(YHVH_MILUI_GALLERY.find(x=>x.id===id)));
 for(const [id,profile] of [['rov54','standard'],['rov45','alfin'],['rov54t','talmudic'],['rov54m','mayim'],['peliah45','pelia']]){
  if(byId(id)!==calculateMilui('יהוה',profile).total)throw new Error('Calculator/profile mismatch: '+id);
 }
})();
bindYhvhMiluiComparison();
renderYhvhMiluiTab();
