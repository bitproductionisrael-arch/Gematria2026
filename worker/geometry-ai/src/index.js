/* Server-side AI assistant for Gematria2026 Geometry Chat.
   Cloudflare Worker. OPENAI_API_KEY is a Cloudflare Secret, never a browser variable.
   Public clients cannot select the model, system instructions, or execute code.
*/
const MAX_BODY=12500;
const CHAT_SCHEMA={
 type:"object",
 additionalProperties:false,
 required:["reply","proposal"],
 properties:{
  reply:{type:"string"},
  proposal:{type:"object",additionalProperties:false,required:["family","n","rows","cols"],
   properties:{
    family:{type:"string",enum:["NONE","T","CT","TET","STAR","SQ","CUBE","PYR","RECT","CIRCLE","SPIRAL"]},
    n:{type:"integer"},rows:{type:"integer"},cols:{type:"integer"}
   }
  }
 }
};
const INSTRUCTIONS=[
 "אתה עוזר חקר גיאומטרי של Gematria2026. ענה בעברית בשפה פשוטה, ללא LaTeX.",
 "המטרה לעזור לחקור מספר שלם N ולמצוא בנייה הנדסית בעלת N נקודות מדויקות.",
 "לעולם אל תציע משולש חלקי, נקודות חסרות או צורה שנוספה אליה כמות שרירותית.",
 "הפרד בין התאמה מתמטית מוכחת (למשל Tn או מלבן r×c) לבין סידור נקודות שרירותי על מעגל/ספירלה.",
 "אפשר לדון באופן חופשי גם בתיבות, גרפים, היפרקוביות, שריגים משושים, פירוקים והרכבות.",
 "האתר מצייר רק משפחות שנתמכות: T, CT, TET, STAR, SQ, CUBE, PYR, RECT, CIRCLE, SPIRAL.",
 "בחר proposal.family=NONE כאשר אין בנייה מאומתת במשפחות הנתמכות, גם אם יש רעיון מעניין להמשך.",
 "בניית T דורשת n(n+1)/2=N. CT דורשת 1+3n(n-1)/2=N.",
 "STAR דורשת n(n+1)=N (שני משולשי Tn). SQ דורש n²=N. CUBE דורש n³=N.",
 "TET דורש n(n+1)(n+2)/6=N. PYR דורש n(n+1)(2n+1)/6=N.",
 "RECT דורש rows*cols=N כאשר rows,cols>=2. CIRCLE ו-SPIRAL שומרות על N אבל הן פריסות לבקשת המשתמש.",
 "אל תציע DODEC, גרף או כל צורה שהאתר לא יודע לצייר מתוך סכמת ההצעות.",
 "אם המשתמש מבקש מחקר ללא ציור, כתוב רעיונות ותן proposal.family=NONE.",
 "כל הערכים n,rows,cols הם מספרים שלמים. כשאין בהם שימוש החזר 0.",
 "יש להציע רק מספר קואורדינטות התואם לערך N שבקלט.",
 "החזר תשובה שימושית וקצרה (עד 650 תווים בעברית). אין להשתמש במילים המציגות השערה כהוכחה."
].join(" ");
function makeHeaders(origin){
 return {
  "content-type":"application/json; charset=utf-8",
  "access-control-allow-origin":origin,
  "access-control-allow-methods":"GET, POST, OPTIONS",
  "access-control-allow-headers":"Content-Type",
  "access-control-max-age":"86400",
  "vary":"Origin",
  "cache-control":"no-store",
  "x-content-type-options":"nosniff"
 };
}
function json(payload,status,origin){
 return new Response(JSON.stringify(payload),{status:status,headers:makeHeaders(origin)});
}
function validHistory(history){
 if(!Array.isArray(history))return [];
 return history.slice(-8).filter(x=>x&&["user","assistant"].includes(x.role)&&typeof x.content==="string")
  .map(x=>({role:x.role,content:x.content.slice(0,1200)}));
}
function parseResponse(data){
 const text=typeof data.output_text==="string"?data.output_text:
  (Array.isArray(data.output)?data.output:[]).flatMap(x=>Array.isArray(x.content)?x.content:[])
   .filter(x=>x.type==="output_text"&&typeof x.text==="string").map(x=>x.text).join("");
 return JSON.parse(text);
}
export default {
 async fetch(request,env){
  const url=new URL(request.url);
  const origin=request.headers.get("Origin")||"";
  const allowed=(env.ALLOWED_ORIGINS||"https://bitproductionisrael-arch.github.io").split(",").map(x=>x.trim());
  if(!origin||!allowed.includes(origin))return new Response("Origin not allowed",{status:403});
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:makeHeaders(origin)});
  if(request.method==="GET"&&url.pathname==="/health")
   return json({ok:true,ai:Boolean(env.OPENAI_API_KEY)},200,origin);
  if(request.method!=="POST"||url.pathname!=="/chat")return json({error:"Not found"},404,origin);
  if(!env.OPENAI_API_KEY)return json({error:"שרת AI עדיין לא הוגדר"},503,origin);
  if(!env.GEOMETRY_RATE_LIMIT)return json({error:"Rate limit not configured"},503,origin);
  // Also set project budget limits in the OpenAI Platform: rate limiting alone is not a spending cap.
  const actor=request.headers.get("CF-Connecting-IP")||"unknown";
  const cap=await env.GEOMETRY_RATE_LIMIT.limit({key:actor+"|geometry-chat"});
  if(!cap.success)return json({error:"כמות בקשות גבוהה מדי. נסה שוב בעוד דקה."},429,origin);
  const length=Number(request.headers.get("Content-Length")||0);
  if(length>MAX_BODY)return json({error:"הודעה גדולה מדי"},413,origin);
  let input;
  try{
   const body=await request.text();
   if(body.length>MAX_BODY)return json({error:"הודעה גדולה מדי"},413,origin);
   input=JSON.parse(body);
  }catch(_){return json({error:"Invalid JSON"},400,origin);}
  const message=input&&typeof input.message==="string"?input.message.trim():"";
  const context=input&&input.context||{};
  const value=context.value;
  if(message.length<1||message.length>600||!Number.isSafeInteger(value)||value<1||value>20100)
   return json({error:"יש לשלוח הודעה קצרה ומספר נקודות חוקי"},400,origin);
  if(typeof context.text!=="string"||context.text.length>650||typeof context.method!=="string"||context.method.length>100)
   return json({error:"הקשר לא תקין"},400,origin);
  const prior=validHistory(input.history);
  const userData={message:message,numberOfPoints:value,text:context.text,method:context.method,
   placement:context.placement==="letters"?"letters":"gematria",priorConversation:prior};
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),22000);
  try{
   const result=await fetch("https://api.openai.com/v1/responses",{
    method:"POST",signal:controller.signal,
    headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},
    body:JSON.stringify({
     model:env.OPENAI_MODEL||"gpt-5-mini",
     store:false,
     instructions:INSTRUCTIONS,
     input:[{role:"user",content:JSON.stringify(userData)}],
     text:{format:{type:"json_schema",name:"geometry_chat_reply",strict:true,schema:CHAT_SCHEMA}},
     max_output_tokens:650
    })
   });
   if(!result.ok){
    console.error("OpenAI Responses error:",result.status);
    return json({error:"שירות AI לא זמין כעת"},502,origin);
   }
   const data=await result.json();
   let answer;
   try{answer=parseResponse(data);}catch(_){return json({error:"AI returned invalid output"},502,origin);}
   if(!answer||typeof answer.reply!=="string"||!answer.proposal)return json({error:"Invalid AI reply"},502,origin);
   const family=String(answer.proposal.family||"NONE");
   const approved=CHAT_SCHEMA.properties.proposal.properties.family.enum;
   const proposal=approved.includes(family)?{
    family:family,n:Number(answer.proposal.n)||0,
    rows:Number(answer.proposal.rows)||0,cols:Number(answer.proposal.cols)||0
   }:{family:"NONE",n:0,rows:0,cols:0};
   return json({reply:answer.reply.slice(0,1400),proposal:proposal},200,origin);
  }catch(e){
   console.error("Geometry AI request failed:",e.name||"error");
   return json({error:"בקשת AI נכשלה, נסה שוב"},502,origin);
  }finally{clearTimeout(timeout);}
 }
};