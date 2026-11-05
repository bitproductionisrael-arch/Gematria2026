/* RovGrid Arabic Abjad engine. This is additive: Hebrew, English, Greek and Russian maps stay unchanged.
   Traditional: Eastern Abjad numbers. Modern research: transliterated operators, letter-name Milui.
   Normalization policy (documented): أ إ آ ٱ=ا; ؤ=و; ئ ى=ي; ة=ه; ء is not counted.
   Vowels, shadda, tatweel, Quranic annotation and punctuation have no numerical value.
   Mixed-script inputs retain the calculator's existing single-script priority. */
(function(){
'use strict';
const ABJAD=Array.from('ابجدهوزحطيكلمنسعفصقرشتثخذضظغ');
const HIJAI=Array.from('ابتثجحخدذرزسشصضطظعغفقكلمنهوي');
const VARIANTS={'أ':'ا','إ':'ا','آ':'ا','ٱ':'ا','ؤ':'و','ئ':'ي','ى':'ي','ة':'ه','ء':''};
const normal=c=>Object.prototype.hasOwnProperty.call(VARIANTS,c)?VARIANTS[c]:c;
if(ABJAD.length!==28||HIJAI.length!==28||new Set(ABJAD).size!==28||new Set(HIJAI).size!==28||ABJAD.some(c=>!HIJAI.includes(c)))throw Error('Arabic alphabets must have the same 28 unique letters');

const VAL={},ORD={},SMALL={},ZERO={},KIDMI={},SQUARE={},SQUARE_ORD={};
const MIRROR={},MIRROR_ORD={},MIRROR_LETTER={},ABJAD_MIRROR={},ABJAD_MIRROR_LETTER={};
const HALF={},HALF_LETTER={},SHIFT={},SHIFT_LETTER={};
let acc=0;
ABJAD.forEach((ch,i)=>{
 const v=tiered(i);VAL[ch]=v;SMALL[ch]=dr(v);ZERO[ch]=v>=10&&v%10===0?v/10:v;
 SQUARE[ch]=v*v;acc+=v;KIDMI[ch]=acc;
 ABJAD_MIRROR[ch]=tiered(27-i);ABJAD_MIRROR_LETTER[ch]=ABJAD[27-i];
});
HIJAI.forEach((ch,i)=>{
 const opp=HIJAI[27-i],h=HIJAI[(i+14)%28],next=HIJAI[(i+1)%28];
 ORD[ch]=i+1;SQUARE_ORD[ch]=(i+1)**2;
 MIRROR[ch]=VAL[opp];MIRROR_ORD[ch]=28-i;MIRROR_LETTER[ch]=opp;
 HALF[ch]=VAL[h];HALF_LETTER[ch]=h;
 SHIFT[ch]=VAL[next];SHIFT_LETTER[ch]=next;
});

// Every ordinary calculation still calls the same original engine.
const originalDetect=detectScript;
detectScript=function(t){return /[ء-غف-يٱ]/.test(String(t))?'ar':originalDetect(t)};
const originalTokens=tokensForWord;
const unicodeForms=/[\ufb50-\ufdff\ufe70-\ufeff]/g;
function normalizeArabicText(input){
 return Array.from(String(input).replace(unicodeForms,ch=>ch.normalize('NFKC'))).map(normal).join('');
}
tokensForWord=function(word,script,map){
 return originalTokens(script==='ar'?normalizeArabicText(word):word,script,map);
};

const NAMES={
 'ا':'ألف','ب':'باء','ج':'جيم','د':'دال','ه':'هاء','و':'واو','ز':'زاي','ح':'حاء',
 'ط':'طاء','ي':'ياء','ك':'كاف','ل':'لام','م':'ميم','ن':'نون','س':'سين',
 'ع':'عين','ف':'فاء','ص':'صاد','ق':'قاف','ر':'راء','ش':'شين','ت':'تاء',
 'ث':'ثاء','خ':'خاء','ذ':'ذال','ض':'ضاد','ظ':'ظاء','غ':'غين'
};
function nameExpansion(ch,depth){
 let expanded=NAMES[normal(ch)]||'';
 for(let d=1;d<depth;d++)expanded=Array.from(normalizeArabicText(expanded)).map(c=>NAMES[c]||'').join('');
 return expanded;
}
function arabicMilui(text,depth,key){
 const words=[];let total=0;
 for(const raw of wordsOf(text)){
  const parts=[];let subtotal=0;
  for(const ch of Array.from(normalizeArabicText(raw))){
   if(!NAMES[ch])continue;
   const name=nameExpansion(ch,depth),value=sum(tokensForWord(name,'ar',VAL).map(x=>x.value));
   parts.push({letter:ch,name,value});subtotal+=value;
  }
  if(parts.length){words.push({raw,parts,subtotal});total+=subtotal}
 }
 return {method:METHODS.ar.find(m=>m.key===key),total,words,milui:true,miluiDepth:depth,miluiProfile:'Arabic 28 written names'};
}
function arabicHalf(text,m){
 const L=reductionLadderData(text,'ar',VAL);
 const h0=L.stageTotals[Math.min(1,L.stageTotals.length-1)]||0,harmonic=[h0];
 while(harmonic.length<32){const next=harmonic[harmonic.length-1]/2;if(!Number.isInteger(next)||next<=0)break;harmonic.push(next)}
 return {method:m,total:harmonic[1]??h0,words:L.words,harmonicHalf:true,ladder:L.stageTotals,h0,harmonic};
}
const originalCalculate=calculate;
calculate=function(text,script,m){
 if(script==='ar'&&m.custom==='arabicMilui')return arabicMilui(text,1,'milui');
 if(script==='ar'&&m.custom==='arabicMilui2')return arabicMilui(text,2,'milui2');
 if(script==='ar'&&m.custom==='arabicHarmonicHalf')return arabicHalf(text,m);
 return originalCalculate(text,script,m);
};

// Explicit script-specific implementations; shared mathematical operators are NOT duplicated.
METHODS.ar=[
 {key:'regular',cat:'base',name:'حساب الجُمَّل / Arabic Abjad',map:VAL},
 {key:'ordinal',cat:'base',name:'الترتيب الهجائي / Arabic Ordinal',map:ORD,research:true},
 {key:'reduced',cat:'base',name:'الصغير / Arabic Small',map:SMALL,research:true},
 {key:'wordReduced',cat:'base',name:'اختزال الكلمات / Arabic Reduced',map:SMALL,fold:'word',research:true},
 {key:'digitReduced',cat:'base',name:'الاختزال الرقمي / Arabic Digit Reduced',map:SMALL,fold:'total',research:true},
 {key:'zeroStep',cat:'base',name:'حذف صفر واحد / Arabic One-step Zero',map:ZERO,research:true},
 {key:'kidmi',cat:'base',name:'المجموع التراكمي / Arabic Kidmi',map:KIDMI,research:true},
 {key:'perati',cat:'base',name:'مربعات الأبجد / Arabic Perati Abjad²',map:SQUARE,perati:true,research:true},
 {key:'peratiOrdinal',cat:'base',name:'مربعات الترتيب / Arabic Perati Ordinal²',map:SQUARE_ORD,perati:true,research:true},
 {key:'kolel',cat:'base',name:'مع الواحد / Arabic Kolel (+1)',map:VAL,post:(t,v)=>v+1,research:true},
 {key:'musafi',cat:'base',name:'إضافة عدد الحروف / Arabic Musafi (+letters)',map:VAL,post:(t,v,script)=>v+letterCount(t,script,VAL),research:true},
 {key:'atbash',cat:'cipher',name:'مرآة الهجاء / Arabic Atbash Abjad',map:MIRROR,sub:MIRROR_LETTER,research:true},
 {key:'atbashOrdinal',cat:'cipher',name:'مرآة الهجاء الترتيبية / Arabic Atbash Ordinal',map:MIRROR_ORD,sub:MIRROR_LETTER,research:true},
 {key:'abjadMirror',cat:'cipher',name:'مرآة الأبجد / Arabic Abjad Mirror',map:ABJAD_MIRROR,sub:ABJAD_MIRROR_LETTER,research:true},
 {key:'albam',cat:'cipher',name:'تبديل 14+14 / Arabic ALBaM Analogue',map:HALF,sub:HALF_LETTER,research:true},
 {key:'avgad',cat:'cipher',name:'إزاحة حرف واحد / Arabic AVGaD +1',map:SHIFT,sub:SHIFT_LETTER,research:true},
 {key:'milui',cat:'ops',name:'ملء أسماء الحروف / Arabic Letter Names',custom:'arabicMilui',research:true},
 {key:'milui2',cat:'ops',name:'ملء الملء / Arabic Milui of Milui',custom:'arabicMilui2',research:true},
 {key:'building',cat:'ops',name:'بناء البوادئ / Arabic Building Abjad',map:VAL,transform:cumulative,transformName:'prefix sums',research:true},
 {key:'buildingOrdinal',cat:'ops',name:'بناء البوادئ / Arabic Building Ordinal',map:ORD,transform:cumulative,transformName:'prefix sums',research:true},
 {key:'positional',cat:'ops',name:'الموقع × القيمة / Arabic Positional Abjad',map:VAL,transform:positional,transformName:'position × value',research:true},
 {key:'positionalOrdinal',cat:'ops',name:'الموقع × الترتيب / Arabic Positional Ordinal',map:ORD,transform:positional,transformName:'position × value',research:true},
 {key:'equivalence',cat:'ops',name:'الوزن المتوازن / Arabic Equivalence Abjad',map:VAL,transform:balanced,transformName:'balanced weight',research:true},
 {key:'equivalenceOrdinal',cat:'ops',name:'الوزن المتوازن / Arabic Equivalence Ordinal',map:ORD,transform:balanced,transformName:'balanced weight',research:true},
 {key:'ratzo',cat:'ops',name:'الذهاب والعودة / Arabic Running & Returning Abjad',map:VAL,transform:pyramid,transformName:'prefixes out + return',ratzo:true,research:true},
 {key:'ratzoOrdinal',cat:'ops',name:'الذهاب والعودة / Arabic Running & Returning Ordinal',map:ORD,transform:pyramid,transformName:'prefixes out + return',ratzo:true,research:true},
 {key:'addsub',cat:'ops',name:'الجمع والطرح / Arabic Addition & Subtraction Abjad',map:VAL,transform:ladder,transformName:'prefixes + suffixes',research:true},
 {key:'addsubOrdinal',cat:'ops',name:'الجمع والطرح / Arabic Addition & Subtraction Ordinal',map:ORD,transform:ladder,transformName:'prefixes + suffixes',research:true},
 {key:'harmonicHalf',cat:'ops',name:'النصف التوافقي / Arabic Harmonic Half',map:VAL,custom:'arabicHarmonicHalf',research:true},
 {key:'letterProductRegular',cat:'ops',name:'حاصل ضرب الحروف / Arabic Letter Product Abjad',map:VAL,letterProduct:true,research:true},
 {key:'letterProductOrdinal',cat:'ops',name:'حاصل ضرب الحروف / Arabic Letter Product Ordinal',map:ORD,letterProduct:true,research:true},
 {key:'letterProductSmall',cat:'ops',name:'حاصل ضرب الحروف / Arabic Letter Product Small',map:SMALL,letterProduct:true,research:true},
 {key:'letterDivisionRegular',cat:'ops',name:'قسمة الحروف / Arabic Letter Division Abjad',map:VAL,letterDivision:true,research:true},
 {key:'letterDivisionOrdinal',cat:'ops',name:'قسمة الحروف / Arabic Letter Division Ordinal',map:ORD,letterDivision:true,research:true},
 {key:'letterDivisionSmall',cat:'ops',name:'قسمة الحروف / Arabic Letter Division Small',map:SMALL,letterDivision:true,research:true},
 ...homePowerMethods(ABJAD)
];
METHODS.ar.forEach(m=>m.script='ar');
REFERENCE_BANK.ar=['الله','بسم الله الرحمن الرحيم','محمد','نور','الرحمن','الرحيم','موسى','عيسى','الحق','واحد','سلام'];

const originalName=methodUiName;
methodUiName=function(m){return m?.script==='ar'?m.name:originalName(m)};
const originalBase=baseMethodKey;
baseMethodKey=function(script){return script==='ar'?'regular':originalBase(script)};
const originalDefaults=defaultBaseKeys;
defaultBaseKeys=function(script){return script==='ar'?['regular','ordinal','reduced']:originalDefaults(script)};
const originalBookSample=methodBookSample;
methodBookSample=function(script){return script==='ar'?(detectScript(document.getElementById('q').value)==='ar'?document.getElementById('q').value:'بسم الله الرحمن الرحيم'):originalBookSample(script)};
const originalAlphabet=methodBookAlphabet;
methodBookAlphabet=function(script,m){return script==='ar'?(/[Oo]rdinal/.test(m.key)?[...HIJAI]:[...ABJAD]):originalAlphabet(script,m)};

// Documentation differentiates traditional Abjad from research ciphers.
Object.assign(METHOD_BOOK_DOCS,{
 'ar:regular':{plain:'חישוב אבג׳ד / Arabic Abjad',original:'Traditional Eastern Abjad alphabetic numerals',status:'traditional',history:'סדר מספרי מסורתי: ابجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ. 28 אותיות, ערכי 1 עד 1000. המזה והכתיבים החלופיים מנורמלים לפי מדיניות האתר.',formula:'ا=1 ب=2 ج=3 د=4 ه=5 و=6 ... غ=1000; الله=66; بسم الله الرحمن الرحيم=786.'},
 'ar:ordinal':{plain:'סדרי ערבי / Arabic Ordinal',original:'Modern Hijai alphabetic positions',status:'modern',history:'סדר האותיות המקובל כיום: ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي. נבדל מסדר אבג׳ד.',formula:'ا=1 ب=2 ت=3 ... ي=28, then sum.'},
 'ar:reduced':{plain:'קטן ערבי / Arabic Small',original:'Letterwise reduced Abjad values',status:'derived',history:'שורש ספרתי נפרד לכל אות לפי ערכה באבג׳ד; אחר כך מחברים את הספרות.',formula:'Σ DR(Abjad(letter)).'},
 'ar:wordReduced':{plain:'צמצום ערבי / Arabic Reduced',original:'Wordwise digital root · RovGrid',status:'modern',history:'שורש ספרתי לכל מילה בנפרד, ואז סכימה של כל המילים.',formula:'Σ over words DR(Arabic Small(word)).'},
 'ar:digitReduced':{plain:'צמצום דיגיטלי ערבי',original:'Whole-phrase digital root · RovGrid',status:'modern',history:'שורש ספרתי יחיד לסכום כל האותיות, ללא הפרדת מילים.',formula:'DR(Arabic Small(full text)).'},
 'ar:milui':{plain:'מילוי ערבי / Arabic Letter Names',original:'Letter-name expansion · RovGrid research',status:'modern',history:'מחליפים כל אות בשמה הערבי המלא ומסכמים את ערכי אבג׳ד של השם. המזה בודדת אינה נספרת. זה פיתוח מחקרי באתר.',formula:'ا→ألف=111; expand once and sum Abjad.'},
 'ar:milui2':{plain:'מילוי דמילוי ערבי',original:'Depth-2 Arabic letter-name expansion · research',status:'modern',history:'מפעילים את מילון שמות האותיות פעמיים ברציפות.',formula:'Expand names twice, then sum Abjad.'},
 'ar:atbash':{plain:'אתב״ש ערבי / Arabic Atbash',original:'Hijai alphabet mirror · research analogue',status:'modern',history:'אנלוג לאתב״ש לפי סדר הג׳אי, אינו מיוחס למסורת היסטורית ערבית.',formula:'Hijai index i→29−i, then evaluate in Abjad.'},
 'ar:abjadMirror':{plain:'מראת אבג׳ד / Arabic Abjad Mirror',original:'Abjad-order mirror · research analogue',status:'modern',history:'שיקוף בסדר אבג׳ד המספרי; אינו זהה לשיקוף לפי הסדר ההג׳אי.',formula:'Reverse Abjad letter order, then sum Abjad.'},
 'ar:albam':{plain:'אלב״ם ערבי / Arabic 14+14',original:'Hijai half-shift · research analogue',status:'modern',history:'תמורת 14+14 בסדר ההג׳אי, כאנלוג חישובי של האתר.',formula:'Hijai letter index i→i+14 (mod 28).'},
 'ar:avgad':{plain:'אבג״ד ערבי / Arabic +1',original:'Hijai cyclic shift · research analogue',status:'modern',history:'הזזה מחזורית של אות אחת בסדר ההג׳אי.',formula:'Hijai index i→i+1 (mod 28).'}
});

const sampleSelect=document.getElementById('sampleSelect');
for(const phrase of ['بسم الله الرحمن الرحيم','الله','محمد']){const opt=document.createElement('option');opt.value=phrase;opt.textContent=phrase;sampleSelect.appendChild(opt)}
const bookLangs=document.querySelector('.methodbook-langs');
if(bookLangs){const btn=document.createElement('button');btn.dataset.methodbookScript='ar';btn.textContent='العربية';bookLangs.appendChild(btn)}
const originalBookRender=renderMethodBook;
renderMethodBook=function(){
 originalBookRender();
 if(METHOD_BOOK_STATE.script==='ar'){
  const badges=document.querySelectorAll('.methodbook-badges .methodbook-badge');
  if(badges[1])badges[1].textContent='العربية · Arabic';
 }
};
const originalAll=renderAll;
renderAll=function(full=true){
 const result=originalAll(full);
 if(current.script==='ar')document.getElementById('scriptBadge').textContent=calcLang()==='en'?'Arabic':'ערבית · العربية';
 return result;
};
const originalForms=renderForms;
renderForms=function(){
 const result=originalForms();
 const text=document.getElementById('q').value;
 if(detectScript(text)!=='ar')return result;
 const mil=arabicMilui(text,1,'milui'),mil2=arabicMilui(text,2,'milui2');
 document.getElementById('miluiValue').textContent=fmt(mil.total);
 document.getElementById('milui2Value').textContent=fmt(mil2.total);
 for(const id of ['miluiTalmudicValue','miluiMayimValue','miluiAlfinValue','miluiPeliaValue','miluiGenesis74Value'])document.getElementById(id).textContent='—';
 document.getElementById('miluiText').innerHTML='<b>ملء أسماء الحروف:</b> '+esc(mil.words.flatMap(w=>w.parts.map(p=>p.name)).join(' '))+'<br><b>ملء الملء:</b> '+esc(mil2.words.flatMap(w=>w.parts.map(p=>p.name)).join(' '));
 document.getElementById('miluiMeta').textContent='Arabic Abjad letter names · site research';
 document.getElementById('yhvhMilui').textContent='';
 document.getElementById('boundaryTitle').textContent='עם גבול: '+text+' | בלי גבול: '+boundaryless(text);
 document.getElementById('boundaryDiffs').innerHTML=diffRows(text,boundaryless(text));
 document.getElementById('finalTitle').textContent='צורות הקשר בערבית חולקות ערך אות זהה';
 document.getElementById('finalDiffs').innerHTML='';
 return result;
};
const originalPermutations=computePermutationData;
computePermutationData=function(input){
 if(detectScript(input)!=='ar')return originalPermutations(input);
 const letters=Array.from(normalizeArabicText(input)).filter(ch=>ch in VAL);
 const n=letters.length,counts=new Map();
 for(const ch of letters)counts.set(ch,(counts.get(ch)||0)+1);
 const groups=Array.from(counts,([letter,repetitions])=>({letter,repetitions}));
 if(n>500)return {script:'ar',n,groups,error:true};
 if(!n)return {script:'ar',n,groups,total:0n,fold:0n,denominator:1n};
 const denominator=groups.reduce((acc,g)=>acc*permFactorial(g.repetitions),1n);
 const total=permFactorial(n)/denominator,fold=1n+((total-1n)%999n);
 return {script:'ar',n,groups,total,fold,denominator};
};

if(location.search.includes('selftest')){
 const m=key=>METHODS.ar.find(x=>x.key===key),T=(str,key)=>calculate(str,'ar',m(key)).total;
 const checks=[
  [ABJAD.length===28&&HIJAI.length===28,'alphabet lengths'],
  [detectScript('بِسْمِ')==='ar','language detection'],
  [T('الله','regular')===66,'Allah Abjad = 66'],
  [T('محمد','regular')===92,'Muhammad Abjad = 92'],
  [T('نور','regular')===256,'Nur Abjad = 256'],
  [T('بسم الله الرحمن الرحيم','regular')===786,'Basmala Abjad = 786'],
  [T('اللّٰه','regular')===66,'tashkeel ignored'],
  [T('أإآٱ','regular')===4,'Alif hamza normalizations'],
  [T('ة','regular')===5&&T('ى','regular')===10,'ta marbuta and alif maqsura'],
  [T('الله','ordinal')===73,'Allah ordinal = 73'],
  [T('الله','reduced')===12,'Allah Small = 12'],
  [T('الله نور','wordReduced')===7,'word reduction'],
  [T('الله نور','digitReduced')===7,'whole-text reduction'],
  [T('الله','milui')===259,'Arabic letter names Milui = 259'],
  [T('غ','regular')===1000,'ghain = 1000'],
  [T('اب','letterProductRegular')===2,'letter product'],
  [calculate('اب','ar',m('letterDivisionRegular')).exactFraction==='1/2','letter division'],
  [computePermutationData('أأب').total===3n,'normalized permutations'],
  [METHODS.ar.length===48,'Arabic 35 methods + 13 HomePower']
 ];
 const failed=checks.filter(x=>!x[0]).map(x=>x[1]);
 window.__arabicGematriaSelfTest={checks:checks.length,passed:checks.length-failed.length,failed};
 if(failed.length)console.error('Arabic gematria selftest failures:',failed);else console.info('Arabic gematria selftests passed:',checks.length);
}
renderAll(false);
})();