(function(){
  'use strict';
  const KEY='gematria2026.lang';
  const SUPPORTED=['he','en'];
  const get=()=>{const v=localStorage.getItem(KEY);return SUPPORTED.includes(v)?v:'he'};

  const RU_LABEL_FIXES=[
    [/Русская стандартная\s*\/\s*Russian Standard\s*·\s*Decimal Tier \(D\)/g,'Russian Gematria'],
    [/Russian Standard\s*·\s*Decimal Tier \(D\)/g,'Russian Gematria'],
    [/Russian Standard\s*·\s*Decimal Tier/g,'Russian Gematria'],
    [/Полное сокращение\s*\/\s*Russian Full Reduction \(R\)/g,'Russian Reduced'],
    [/Russian Full Reduction \(R\)/g,'Russian Reduced'],
    [/Russian Full Reduction/g,'Russian Reduced'],
    [/Russian Prefix Building\s*·\s*Ordinal/g,'Building Ordinal'],
    [/Russian Building\s*\/\s*Achorayim\s*—\s*Ordinal/g,'Building Ordinal'],
    [/Russian Prefix Building\s*\/\s*Ordinal/g,'Building Ordinal']
  ];
  function fixRuLabels(s){
    let out=String(s==null?'':s);
    for(const [re,rep] of RU_LABEL_FIXES)out=out.replace(re,rep);
    return out;
  }
  function patchRuLabels(root){
    root=root||document.body;
    if(!root)return;
    try{
      if(root.nodeType===Node.TEXT_NODE){
        const v=fixRuLabels(root.nodeValue);
        if(v!==root.nodeValue)root.nodeValue=v;
        return;
      }
      const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
        const p=node.parentElement;
        if(!p)return NodeFilter.FILTER_REJECT;
        if(/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT)$/i.test(p.tagName))return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }});
      const nodes=[];
      while(walker.nextNode())nodes.push(walker.currentNode);
      for(const node of nodes){const v=fixRuLabels(node.nodeValue);if(v!==node.nodeValue)node.nodeValue=v;}
      root.querySelectorAll&&root.querySelectorAll('option,[title],[aria-label]').forEach(el=>{
        if(el.tagName==='OPTION'){const v=fixRuLabels(el.textContent);if(v!==el.textContent)el.textContent=v;}
        for(const attr of ['title','aria-label'])if(el.hasAttribute&&el.hasAttribute(attr)){const v=fixRuLabels(el.getAttribute(attr));if(v!==el.getAttribute(attr))el.setAttribute(attr,v);}
      });
    }catch(e){console.warn('Russian label patch failed',e)}
  }
  let ruLabelObserver=null;
  function ensureRuLabelPatch(){
    patchRuLabels(document.body);
    if(ruLabelObserver||!document.body||!window.MutationObserver)return;
    ruLabelObserver=new MutationObserver(muts=>{
      for(const m of muts){
        if(m.type==='characterData')patchRuLabels(m.target);
        else m.addedNodes&&m.addedNodes.forEach(n=>patchRuLabels(n));
      }
    });
    ruLabelObserver.observe(document.body,{subtree:true,childList:true,characterData:true});
  }
  let clipboardPatched=false;
  function ensureClipboardPatch(){
    if(clipboardPatched)return;
    clipboardPatched=true;
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        const orig=navigator.clipboard.writeText.bind(navigator.clipboard);
        navigator.clipboard.writeText=function(text){return orig(fixRuLabels(text));};
      }
    }catch(e){console.warn('Clipboard patch failed',e)}
    document.addEventListener('copy',e=>{
      try{
        const txt=String(window.getSelection&&window.getSelection()||'');
        const fixed=fixRuLabels(txt);
        if(txt&&fixed!==txt&&e.clipboardData){e.preventDefault();e.clipboardData.setData('text/plain',fixed);}
      }catch(_){ }
    },true);
  }

  function ensureStyle(){
    if(document.getElementById('siteLangStyle'))return;
    const st=document.createElement('style');st.id='siteLangStyle';
    st.textContent='.site-lang-toggle{flex:0 0 auto;min-width:38px;height:28px;padding:0 8px;border:1px solid #3a4654;border-radius:999px;background:#0b1219;color:#dce6ef;font:900 10px/1 system-ui,-apple-system,Segoe UI,Arial,sans-serif;letter-spacing:.06em;cursor:pointer}.site-lang-toggle:hover{border-color:#d8ad55;color:#ffe2a0}.site-speak-btn{position:relative}.site-speak-btn.speaking{border-color:#d8ad55!important;color:#ffe2a0!important;box-shadow:0 0 0 1px rgba(216,173,85,.22),0 0 18px rgba(216,173,85,.12)}.site-speak-btn.speaking:after{content:"";position:absolute;inset:6px;border:1px solid rgba(216,173,85,.45);border-radius:999px;animation:siteSpeakPulse 1s ease-in-out infinite}@keyframes siteSpeakPulse{0%,100%{opacity:.25;transform:scale(.92)}50%{opacity:1;transform:scale(1.08)}}[data-preserve-script]{unicode-bidi:plaintext}.lang-en .hebrew-expression,.lang-en .greek-expression{unicode-bidi:isolate;font-weight:700}';
    document.head.appendChild(st);
  }
  function ensureToggle(){
    let b=document.getElementById('siteLangToggle');if(b)return b;
    b=document.createElement('button');b.id='siteLangToggle';b.type='button';b.className='site-lang-toggle';b.setAttribute('aria-label','Language');
    const target=document.querySelector('.nav')||document.querySelector('.top-actions')||document.querySelector('header')||document.body;
    if(target.firstElementChild&&target.classList.contains('nav'))target.appendChild(b);else target.appendChild(b);
    b.addEventListener('click',()=>set(get()==='he'?'en':'he'));
    return b;
  }
  function speechLangFor(text){
    const s=String(text||'');
    if(/[\u0590-\u05FF]/.test(s))return 'he-IL';
    if(/[\u0370-\u03FF\u1F00-\u1FFF]/.test(s))return 'el-GR';
    if(/[\u0400-\u04FF]/.test(s))return 'ru-RU';
    if(/[\u0600-\u06FF]/.test(s))return 'ar-SA';
    if(/[\u0900-\u097F]/.test(s))return 'hi-IN';
    if(/[\u0E00-\u0E7F]/.test(s))return 'th-TH';
    if(/[\u0530-\u058F]/.test(s))return 'hy-AM';
    if(/[\u10A0-\u10FF]/.test(s))return 'ka-GE';
    if(/[\u3040-\u30FF]/.test(s))return 'ja-JP';
    if(/[\u4E00-\u9FFF]/.test(s))return 'zh-CN';
    if(/[\uAC00-\uD7AF]/.test(s))return 'ko-KR';
    if(/[A-Za-z]/.test(s))return 'en-US';
    return (document.documentElement.lang==='en')?'en-US':'he-IL';
  }
  function bestVoiceFor(lang){
    const synth=window.speechSynthesis;if(!synth)return null;
    const voices=synth.getVoices? synth.getVoices():[];
    if(!voices.length)return null;
    const low=String(lang||'').toLowerCase(),base=low.split('-')[0];
    return voices.find(v=>String(v.lang||'').toLowerCase()===low)||voices.find(v=>String(v.lang||'').toLowerCase().startsWith(base+'-'))||voices.find(v=>String(v.lang||'').toLowerCase().startsWith(base))||null;
  }
  function currentSpeechText(){
    const q=document.getElementById('q');
    if(!q)return '';
    const value=String(q.value||'');
    if(Number.isInteger(q.selectionStart)&&Number.isInteger(q.selectionEnd)&&q.selectionEnd>q.selectionStart){
      return value.slice(q.selectionStart,q.selectionEnd).trim();
    }
    return value.trim();
  }
  function speakCurrentText(btn){
    const synth=window.speechSynthesis;
    if(!synth){alert('Speech is not supported in this browser.');return;}
    if(synth.speaking||synth.pending){synth.cancel();if(btn)btn.classList.remove('speaking');return;}
    const text=currentSpeechText();
    if(!text){try{window.toast&&window.toast('אין טקסט להקראה')}catch(_){}return;}
    const lang=speechLangFor(text),u=new SpeechSynthesisUtterance(text),voice=bestVoiceFor(lang);
    u.lang=lang;u.rate=.88;u.pitch=1;u.volume=1;
    if(voice)u.voice=voice;
    if(btn)btn.classList.add('speaking');
    const done=()=>{if(btn)btn.classList.remove('speaking')};
    u.onend=done;u.onerror=done;
    synth.cancel();
    setTimeout(()=>synth.speak(u),30);
  }
  function ensureSpeakButton(){
    if(!document.getElementById('q'))return null;
    let b=document.getElementById('siteSpeakQuery');if(b)return b;
    const target=document.querySelector('.top-actions')||document.querySelector('header')||document.body;
    b=document.createElement('button');
    b.id='siteSpeakQuery';b.type='button';b.className='iconbtn site-speak-btn';
    b.textContent='▶';
    b.title='השמע את הביטוי';
    b.setAttribute('aria-label','השמע את הביטוי');
    const home=target.querySelector&&target.querySelector('.home-link-btn');
    if(home&&home.parentNode===target)home.insertAdjacentElement('afterend',b);else target.insertBefore(b,target.firstChild||null);
    b.addEventListener('click',()=>speakCurrentText(b));
    if(window.speechSynthesis&&speechSynthesis.onvoiceschanged!==undefined){
      speechSynthesis.onvoiceschanged=()=>bestVoiceFor(speechLangFor(currentSpeechText()));
    }
    return b;
  }
  function applyStatic(lang){
    const dict=window.PAGE_I18N||{};
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.getAttribute('data-i18n'),entry=dict[key];
      if(!entry)return;
      const value=entry[lang]??entry.he??'';
      if(el.hasAttribute('data-i18n-text'))el.textContent=value;else el.innerHTML=value;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el=>{
      const key=el.getAttribute('data-i18n-title'),entry=dict[key];if(!entry)return;
      el.title=entry[lang]??entry.he??'';
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key=el.getAttribute('data-i18n-placeholder'),entry=dict[key];if(!entry)return;
      el.placeholder=entry[lang]??entry.he??'';
    });
  }
  function set(lang){
    if(!SUPPORTED.includes(lang))lang='he';
    localStorage.setItem(KEY,lang);
    const html=document.documentElement;
    html.lang=lang;html.dir=lang==='he'?'rtl':'ltr';
    html.classList.toggle('lang-en',lang==='en');html.classList.toggle('lang-he',lang==='he');
    const b=ensureToggle();b.textContent=lang==='he'?'EN':'HE';
    b.title=lang==='he'?'Switch to English':'עבור לעברית';
    ensureSpeakButton();
    ensureClipboardPatch();
    applyStatic(lang);
    if(typeof window.onSiteLanguageChange==='function')window.onSiteLanguageChange(lang);
    ensureRuLabelPatch();
    window.dispatchEvent(new CustomEvent('site-language-change',{detail:{lang}}));
  }
  function init(){ensureStyle();ensureToggle();ensureSpeakButton();ensureClipboardPatch();set(get())}
  window.SiteI18n={get,set,apply:()=>set(get()),supported:SUPPORTED,fixLabels:fixRuLabels,patchLabels:ensureRuLabelPatch};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();