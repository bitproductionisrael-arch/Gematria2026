(function(){
  'use strict';
  const KEY='gematria2026.lang';
  const SUPPORTED=['he','en'];
  const get=()=>{const v=localStorage.getItem(KEY);return SUPPORTED.includes(v)?v:'he'};
  const esc=s=>String(s==null?'':s);

  function ensureStyle(){
    if(document.getElementById('siteLangStyle'))return;
    const st=document.createElement('style');st.id='siteLangStyle';
    st.textContent='.site-lang-toggle{flex:0 0 auto;min-width:38px;height:28px;padding:0 8px;border:1px solid #3a4654;border-radius:999px;background:#0b1219;color:#dce6ef;font:900 10px/1 system-ui,-apple-system,Segoe UI,Arial,sans-serif;letter-spacing:.06em;cursor:pointer}.site-lang-toggle:hover{border-color:#d8ad55;color:#ffe2a0}[data-preserve-script]{unicode-bidi:plaintext}.lang-en .hebrew-expression,.lang-en .greek-expression{unicode-bidi:isolate;font-weight:700}';
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
    applyStatic(lang);
    if(typeof window.onSiteLanguageChange==='function')window.onSiteLanguageChange(lang);
    window.dispatchEvent(new CustomEvent('site-language-change',{detail:{lang}}));
  }
  function init(){ensureStyle();ensureToggle();set(get())}
  window.SiteI18n={get,set,apply:()=>set(get()),supported:SUPPORTED};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();