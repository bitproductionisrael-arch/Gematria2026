'use strict';
/* Source-linked four-letter YHWH Milui cards.
 * Traditional sources are distinguished from RovGrid-defined and newly derived spellings.
 * Add entries to this array; cards automatically wrap into rows of three on desktop. */
const YHVH_MILUI_BOOK_SOURCE='https://wiki.jewishbooks.org.il/mediawiki/wiki/מפתחי_חכמת_אמת/כג';
const YHVH_MILUI_PELIA_SOURCE='https://he.wikisource.org/wiki/ספר_הפליאה/ט';
const YHVH_MILUI_RESEARCH_SOURCE='https://github.com/bitproductionisrael-arch/Gematria2026/blob/main/research/milui-correction-2026-11-01.md';
const YHVH_MILUI_GALLERY=[
 {id:'ab72',name:'ע״ב · מילוי יודין',parts:['יוד','הי','ויו','הי'],source:'מפתחי חכמת אמת, כג',url:YHVH_MILUI_BOOK_SOURCE,kind:'traditional'},
 {id:'sag63',name:'ס״ג · מילוי מעורב',parts:['יוד','הי','ואו','הי'],source:'מפתחי חכמת אמת, כג',url:YHVH_MILUI_BOOK_SOURCE,kind:'traditional'},
 {id:'mah45',name:'מ״ה · מילוי אלפין',parts:['יוד','הא','ואו','הא'],source:'מפתחי חכמת אמת, כג',url:YHVH_MILUI_BOOK_SOURCE,kind:'traditional'},
 {id:'ban52',name:'ב״ן · מילוי ההין',parts:['יוד','הה','וו','הה'],source:'מפתחי חכמת אמת, כג',url:YHVH_MILUI_BOOK_SOURCE,kind:'traditional'},
 {id:'rov54',name:'נ״ד · מילוי רגיל',parts:['יוד','הא','ויו','הא'],source:'RovGrid · מילוי רגיל',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'site'},
 {id:'rov45',name:'מילוי אלפין (ואו)',parts:['יוד','הא','ואו','הא'],source:'RovGrid · מיפוי אלפין',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'site'},
 {id:'rov54t',name:'מילוי תלמודי',parts:['יוד','הא','ויו','הא'],source:'RovGrid · נוסח תו',url:YHVH_MILUI_RESEARCH_SOURCE,kind:'site'},
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
function renderYhvhMiluiTab(){
 const root=document.getElementById('yhvhMiluiGrid');
 if(!root)return;
 const baseLetters=Array.from('יהוה');
 root.innerHTML=YHVH_MILUI_GALLERY.map(def=>{
  const vals=yhvhMiluiValues(def);
  const columns=def.parts.map((part,i)=>'<div class="yhvh-milui-letter"><span class="base">'+esc(baseLetters[i])+'</span><span class="arrow" aria-hidden="true">↓</span><strong class="expanded">'+esc(part)+'</strong><span class="value">'+fmt(vals[i])+'</span></div>').join('');
  const addition=vals.map((v,i)=>'<span>'+fmt(v)+'</span>'+(i<3?'<span class="plus" aria-hidden="true">+</span>':'')).join('');
  return '<article class="yhvh-milui-card" data-milui-id="'+esc(def.id)+'" data-milui-kind="'+esc(def.kind)+'"><h3>'+esc(def.name)+'</h3><div class="yhvh-milui-source" title="מקור: '+esc(def.source)+'">מקור: <a href="'+esc(def.url)+'" target="_blank" rel="noopener noreferrer">'+esc(def.source)+'</a></div><div class="yhvh-milui-origin" aria-label="שם המקור: יהוה">יהוה</div><div class="yhvh-milui-letters">'+columns+'</div><div class="yhvh-milui-math" aria-label="סכום ערכי המילוי">'+addition+'</div><div class="yhvh-milui-equals">=</div><div class="yhvh-milui-total" aria-label="התוצאה">'+fmt(sum(vals))+'</div></article>';
 }).join('');
 const count=document.getElementById('yhvhGuideCount');
 if(count)count.textContent=YHVH_MILUI_GALLERY.length+' מילויים';
}
(function verifyYhvhMiluiGallery(){
 const expected=[72,63,45,52,54,45,54,54,45,63,63,54,54,53,53];
 const found=YHVH_MILUI_GALLERY.map(x=>sum(yhvhMiluiValues(x)));
 if(expected.join(',')!==found.join(',')||new Set(YHVH_MILUI_GALLERY.map(x=>x.id)).size!==15)throw new Error('YHWH gallery values/count mismatch: '+found);
 if(YHVH_MILUI_GALLERY.some(x=>!x.url||!x.source||x.parts.length!==4))throw new Error('YHWH gallery source/four-letter invariant');
 const byId=id=>sum(yhvhMiluiValues(YHVH_MILUI_GALLERY.find(x=>x.id===id)));
 for(const [id,profile] of [['rov54','standard'],['rov45','alfin'],['rov54t','talmudic'],['rov54m','mayim'],['peliah45','pelia']]){
  if(byId(id)!==calculateMilui('יהוה',profile).total)throw new Error('Calculator/profile mismatch: '+id);
 }
})();
renderYhvhMiluiTab();
