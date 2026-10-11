/* Gematria2026: optional server-backed geometry chat. Never put API credentials in this file. */
(function(){
'use strict';
var bridge=window.TextGeometryBridge, anchor=document.getElementById('matches');
if(!bridge||!anchor)return;
var legacy=document.getElementById('geometryGuide');
if(legacy)legacy.style.display='none';
var endpoint=String(window.GEMATRIA_GEOMETRY_AI_ENDPOINT||'').trim();
var configured=/^https:\/\/[^\s]+\/chat$/i.test(endpoint);
var link=document.createElement('link');link.rel='stylesheet';link.href='geometry-ai-chat.css';document.head.append(link);
var panel=document.createElement('section');panel.id='geometryAiChat';panel.className='geometry-ai-chat';
panel.innerHTML='<div class="ga-head"><strong>✧ עוזר גיאומטריה · שיחה בתוך האתר</strong><span id="gaStatus" role="status"></span></div>'+
'<div class="ga-log" id="gaLog" role="log" aria-live="polite"></div>'+
'<div class="ga-examples" id="gaExamples"></div>'+
'<label class="ga-label" for="gaInput">מה תרצה לחקור או לצייר?</label>'+
'<textarea id="gaInput" rows="2" maxlength="600" placeholder="חפש פירוקים צורניים, בדוק מגן דוד או בקש ריצוף מדויק"></textarea>'+
'<div class="ga-controls"><button id="gaSend" type="button">שלח</button><button id="gaReset" type="button">נקה שיחה</button></div>'+
'<div id="gaHelp" class="ga-help"></div>';
anchor.insertAdjacentElement('afterend',panel);
var log=document.getElementById('gaLog'),status=document.getElementById('gaStatus'),input=document.getElementById('gaInput'),send=document.getElementById('gaSend'),hints=document.getElementById('gaExamples'),history=[],key='',busy=false;
document.getElementById('gaHelp').textContent=configured
?'השאלות והטקסט הנוכחי נשלחים לשרת AI מאובטח; כל הצעת שרטוט נבדקת לפני ציור.'
:'מצב מקומי: אפשר לצייר מלבן, מגן דוד מדויק, משולש שלם, מעגל וספירלה. שיחה חופשית עם AI דורשת חיבור שרת מאובטח.';
status.textContent=configured?'בודק חיבור AI...':'מקומי · AI לא מחובר';
function say(t,user){var el=document.createElement('div');el.className='ga-bubble '+(user?'ga-user':'ga-bot');el.textContent=String(t);log.append(el);log.scrollTop=log.scrollHeight;}
function ctx(){var r=bridge.getReading(),letters=bridge.getPlacement()==='letters';return {text:r.text||'',method:r.method||'',value:Number(letters?r.letters:r.total)||0,placement:letters?'letters':'gematria'};}
function exact(value){if(!Number.isSafeInteger(value)||value<1||value>20100)return [];return bridge.exactMatches(value).filter(function(s){try{return bridge.pointsForShape(s).length===value;}catch(_){return false;}});}
function factors(n){for(var d=Math.floor(Math.sqrt(n));d>=2;d--)if(n%d===0)return [d,n/d];return null;}
function refresh(){
 var c=ctx(),newKey=[c.text,c.value,c.method,c.placement].join('|');if(newKey===key)return;
 key=newKey;history=[];log.replaceChildren();hints.replaceChildren();
 var matches=exact(c.value);
 if(!c.value)say('הקלד טקסט למעלה. נחקור את המספר ביחד.');
 else if(matches.length)say('נמצאו צורות שלמות למספר '+c.value.toLocaleString('en-US')+': '+matches.map(function(s){return s.family+s.n;}).join(' · ')+'. אפשר לבקש ייצוגים נוספים.');
 else say('לא נמצאה צורה מדויקת במשפחות שנבדקו למספר '+c.value.toLocaleString('en-US')+'. אין משולשים חלקיים. איך תרצה להמשיך?');
 if(c.value>0&&c.value<=20100){
  var options=[],f=factors(c.value);
  if(f)options.push('מלבן '+f[0]+'×'+f[1]);
  if(matches.some(function(x){return x.family==='STAR';}))options.push('מגן דוד');
  options.push('מעגל','ספירלה');
  options.forEach(function(t){var b=document.createElement('button');b.type='button';b.textContent=t;b.addEventListener('click',function(){ask(t);});hints.append(b);});
 }
}
function proposal(x,total){
 if(!x||typeof x!=='object'||!Number.isSafeInteger(total)||total<1||total>20100)return null;
 var f=String(x.family||'').toUpperCase(),n=Number(x.n),shape=null;
 if(f==='RECT'){
  var rows=Number(x.rows),cols=Number(x.cols);
  if(!Number.isSafeInteger(rows)||!Number.isSafeInteger(cols)||rows<2||cols<2||rows*cols!==total)return null;
  shape={family:'RECT',n:rows,rows:rows,cols:cols,count:total,custom:true,description:'מלבן '+rows+'×'+cols};
 }else if(f==='CIRCLE'||f==='SPIRAL'){
  shape={family:f,n:total,count:total,custom:true,description:f==='CIRCLE'?'מעגל':'ספירלה'};
 }else if(['T','CT','TET','STAR','SQ','CUBE','PYR'].includes(f)){
  shape=exact(total).find(function(s){return s.family===f&&s.n===n;})||null;
 }
 if(!shape)return null;
 try{if(bridge.pointsForShape(shape).length!==total)return null;}catch(_){return null;}
 return shape;
}
function draw(x,c){
 var current=ctx();
 if(current.value!==c.value||current.method!==c.method||current.text!==c.text||current.placement!==c.placement){say('המספר השתנה. לא ציירתי לפי הקשר ישן.');return;}
 var s=proposal(x,c.value);if(!s){say('ההצעה אינה נתמכת או אינה שומרת בדיוק על מספר הנקודות. לא ציירתי אותה.');return;}
 bridge.select(s);var name=s.description||(s.family+s.n);
 say('צויר: '+name+' · '+c.value.toLocaleString('en-US')+' נקודות מאומתות.');
 var statusBox=document.getElementById('status');if(statusBox){statusBox.textContent='ייצוג מאומת: '+name+' = '+c.value.toLocaleString('en-US')+' נקודות.';statusBox.className='status';}
}
function local(t,c){
 var v=c.value,q=t.toLowerCase();
 if(!Number.isSafeInteger(v)||v<1||v>20100)return {reply:'אין אפשרות לצייר ערך מחוץ לטווח 1–20,100.'};
 var pair=q.match(/(\d{1,5})\s*(?:×|x|\*|על|by)\s*(\d{1,5})/i);
 if(pair){var a=+pair[1],b=+pair[2];return a*b===v?{reply:'מלבן '+a+'×'+b+' = '+v+'.',proposal:{family:'RECT',rows:a,cols:b}}:{reply:a+'×'+b+' אינו שווה '+v+'. לא אצייר מספר נקודות שגוי.'};}
 if(/מגן דוד|כוכב|hexagram|2×t/.test(q)){var star=exact(v).find(function(s){return s.family==='STAR';});return star?{reply:'2×T'+star.n+' = '+v,proposal:{family:'STAR',n:star.n}}:{reply:'לא נמצאה התאמה מלאה של 2×Tn.'};}
 if(/משולש|triangle|^t\d+/.test(q)){var tri=exact(v).find(function(s){return s.family==='T';});return tri?{reply:'T'+tri.n+' = '+v,proposal:{family:'T',n:tri.n}}:{reply:'אין משולש Tn מלא; משולש חלקי אינו מצויר.'};}
 if(/מעגל|עיגול|circle|ring/.test(q))return {reply:'אפשר להציג '+v+' נקודות במעגל. זהו סידור שנבחר, ולא תכונה צורנית של המספר.',proposal:{family:'CIRCLE'}};
 if(/ספירלה|spiral|חמניה/.test(q))return {reply:'אפשר לייצג '+v+' נקודות בספירלה.',proposal:{family:'SPIRAL'}};
 if(/מלבן|רשת|rectangle|grid/.test(q)){var f=factors(v);return f?{reply:'מלבן '+f[0]+'×'+f[1]+' = '+v,proposal:{family:'RECT',rows:f[0],cols:f[1]}}:{reply:'אין שני גורמים שלמים מעל 1. נסה מעגל או ספירלה.'};}
 return {reply:'הצ\'אט החופשי יחובר לאחר הפעלת שרת AI. במצב המקומי אני יכול לבצע רק הוראות ציור מוגדרות, ללא המצאת צורות.'};
}
async function check(){
 if(!configured)return;
 try{
  var r=await fetch(endpoint.replace(/\/chat$/,'/health'),{cache:'no-store',signal:AbortSignal.timeout(8000)});
  var x=await r.json();
  status.textContent=r.ok&&x.ai===true?'AI מחובר · שאל חופשי':'שרת AI לא הופעל עדיין';
  status.classList.toggle('ga-online',r.ok&&x.ai===true);
 }catch(_){status.textContent='שרת AI לא נגיש · מצב מקומי';status.classList.remove('ga-online');}
}
async function ask(message){
 if(busy)return;
 var t=String(message||'').trim();if(!t)return;
 var c=ctx(),requestKey=key;say(t,true);input.value='';
 if(!configured){var fallback=local(t,c);say(fallback.reply);if(fallback.proposal)draw(fallback.proposal,c);return;}
 busy=true;send.disabled=true;send.textContent='חושב...';
 var controller=new AbortController(),timer=setTimeout(function(){controller.abort();},26000);
 try{
  var r=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({message:t,context:c,history:history.slice(-8)})});
  var data=await r.json().catch(function(){return {};});
  if(!r.ok)throw Error(data.error||'AI unavailable');
  if(requestKey!==key)return;
  if(typeof data.reply!=='string'||!data.reply.trim())throw Error('empty AI reply');
  say(data.reply.slice(0,1400));
  history.push({role:'user',content:t},{role:'assistant',content:data.reply.slice(0,1400)});history=history.slice(-10);
  if(data.proposal&&data.proposal.family!=='NONE')draw(data.proposal,c);
  status.textContent='AI מחובר · שיחה פעילה';status.classList.add('ga-online');
 }catch(e){
  if(requestKey===key){status.textContent='AI לא זמין כרגע · מצב מקומי';status.classList.remove('ga-online');say('לא התקבלה תשובה משרת ה־AI. אפשר לנסות שוב או לבקש ייצוג מקומי כמו "מלבן" או "מעגל".');}
 }finally{clearTimeout(timer);busy=false;send.disabled=false;send.textContent='שלח';}
}
send.addEventListener('click',function(){ask(input.value);});
input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing){e.preventDefault();ask(input.value);}});
document.getElementById('gaReset').addEventListener('click',function(){key='';refresh();});
['phrase','method','placementMode'].forEach(function(id){var e=document.getElementById(id);if(e)e.addEventListener(id==='phrase'?'input':'change',refresh);});
refresh();check();
window.GeometryAIChat={inspect:function(){return {configured:configured,value:ctx().value,messages:history.length};},validateProposal:function(x){return proposal(x,ctx().value);}};
})();