/* Gematria2026 Prime Clock: shared presence and distributed segmented-sieve queue.
   This Cloudflare Durable Object is NOT a proof of 100-million-digit primality.
   Anonymous reports require independent matching clients for "cross-checked" status. */
const ORIGIN="https://bitproductionisrael-arch.github.io";
const RANGE=30000,MAX=100000000000000,LEASE_MS=90000,PRESENCE_MS=40000;
function json(obj,status=200,origin=ORIGIN){
 return new Response(JSON.stringify(obj),{status,headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":origin,"Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type","Cache-Control":"no-store"}});
}
function validClient(c){return typeof c==="string"&&/^[0-9a-zA-Z-]{10,64}$/.test(c);}
function dayNow(){return new Date().toISOString().slice(0,10);}
async function readBody(req){
 const len=Number(req.headers.get("content-length")||0);if(len>2048)throw Error("Payload too large");
 const raw=await req.text();if(raw.length>2048)throw Error("Payload too large");return JSON.parse(raw||"{}");
}
export class PrimeHub{
 constructor(ctx,env){this.ctx=ctx;this.env=env;this.presence=new Map();}
 async meta(){
  return await this.ctx.storage.get("meta")||{next:2,frontier:2,reportedChunks:0,confirmedChunks:0,scannedReported:0,scannedConfirmed:0,daily:{}};
 }
 cleanup(){const now=Date.now();for(const [id,p] of this.presence)if(now-p.last>PRESENCE_MS)this.presence.delete(id);}
 async fetch(req){
  const origin=req.headers.get("Origin")||ORIGIN;
  if(origin!==ORIGIN&&origin!=="http://localhost:8080"&&origin!=="http://127.0.0.1:8080")return json({error:"origin denied"},403,ORIGIN);
  if(req.method==="OPTIONS")return json({},200,origin);
  const url=new URL(req.url),route=url.pathname;
  try{
   if(req.method==="GET"&&route==="/api/state")return await this.state(origin);
   if(req.method==="POST"&&route==="/api/heartbeat")return await this.heartbeat(req,origin);
   if(req.method==="POST"&&route==="/api/claim")return await this.claim(req,origin);
   if(req.method==="POST"&&route==="/api/report")return await this.report(req,origin);
   return json({error:"not found"},404,origin);
  }catch(err){return json({error:String(err&&err.message||err)},400,origin);}
 }
 async state(origin){
  this.cleanup();const m=await this.meta();
  const online=this.presence.size,scanners=[...this.presence.values()].filter(p=>p.scanning).length;
  const dates=Array.from({length:30},(_,i)=>{const d=new Date();d.setUTCHours(12,0,0,0);d.setUTCDate(d.getUTCDate()-(29-i));return d.toISOString().slice(0,10);});
  const daily={};for(const d of dates)daily[d]=Number(m.daily[d]||0);
  return json({online,scanners,reportedChunks:m.reportedChunks,confirmedChunks:m.confirmedChunks,confirmedThrough:m.frontier>2?m.frontier-1:0,scannedReported:m.scannedReported,scannedConfirmed:m.scannedConfirmed,last30Scanned:dates.reduce((a,d)=>a+daily[d],0),daily},200,origin);
 }
 async heartbeat(req,origin){
  const b=await readBody(req);if(!validClient(b.clientId))throw Error("invalid client id");
  this.presence.set(b.clientId,{last:Date.now(),scanning:b.scanning===true});this.cleanup();
  return json({ok:true},200,origin);
 }
 async claim(req,origin){
  const b=await readBody(req);if(!validClient(b.clientId))throw Error("invalid client id");
  const now=Date.now(),m=await this.meta();
  const jobs=await this.ctx.storage.list({prefix:"job:"});
  let selected=null;
  for(const job of jobs.values()){
   if(job.done||job.disputed||job.leaseUntil>now)continue;
   if(Array.isArray(job.reports)&&job.reports.some(r=>r.clientId===b.clientId))continue;
   if(!selected||job.start<selected.start)selected=job;
  }
  if(!selected){
   if(m.next>=MAX)return json({error:"scan horizon reached"},409,origin);
   const start=m.next,end=Math.min(MAX+1,start+RANGE);
   selected={id:"job-"+start,start,end,reports:[],done:false,disputed:false};
   m.next=end;
   await this.ctx.storage.put("meta",m);
  }
  selected.leaseOwner=b.clientId;selected.leaseUntil=now+LEASE_MS;
  await this.ctx.storage.put("job:"+selected.start,selected);
  return json({id:selected.id,start:selected.start,end:selected.end,leaseSeconds:90},200,origin);
 }
 async report(req,origin){
  const b=await readBody(req);
  if(!validClient(b.clientId)||!Number.isSafeInteger(b.start)||!Number.isSafeInteger(b.end)||!Number.isInteger(b.count)||!/^[0-9a-f]{8}$/.test(b.hash||""))throw Error("invalid report");
  const job=await this.ctx.storage.get("job:"+b.start);
  if(!job||job.id!==b.id||job.end!==b.end||job.leaseOwner!==b.clientId||job.done)throw Error("no active claim for report");
  if(b.count<0||b.count>job.end-job.start)throw Error("invalid count");
  if(job.reports.some(r=>r.clientId===b.clientId))return json({ok:true,duplicate:true},200,origin);
  job.reports.push({clientId:b.clientId,count:b.count,hash:b.hash});
  job.leaseUntil=0;job.leaseOwner=null;
  const m=await this.meta();
  if(job.reports.length===1){
   m.reportedChunks++;m.scannedReported+=job.end-job.start;
   const day=dayNow();m.daily[day]=(m.daily[day]||0)+(job.end-job.start);
   for(const d of Object.keys(m.daily))if(Date.now()-Date.parse(d+"T00:00:00Z")>40*86400000)delete m.daily[d];
  }
  // Count as cross-checked only when two different anonymous sessions agree.
  if(job.reports.length>=2){
   const agreement=job.reports.some((a,i)=>job.reports.some((c,j)=>i!==j&&a.clientId!==c.clientId&&a.count===c.count&&a.hash===c.hash));
   if(agreement){job.done=true;m.confirmedChunks++;m.scannedConfirmed+=job.end-job.start;}
   else if(job.reports.length>=4)job.disputed=true;
  }
  await this.ctx.storage.put("job:"+job.start,job);
  if(job.done){
   // Highest CONTIGUOUS independently cross-checked prefix, not largest isolated task.
   for(let i=0;i<2000;i++){
    const next=await this.ctx.storage.get("job:"+m.frontier);
    if(!next||!next.done)break;
    m.frontier=next.end;
   }
  }
  await this.ctx.storage.put("meta",m);
  return json({ok:true,crossChecked:job.done,disputed:job.disputed},200,origin);
 }
}
export default {
 async fetch(req,env){const id=env.PRIME_HUB.idFromName("shared-gematria-primeclock");return env.PRIME_HUB.get(id).fetch(req);}
};
