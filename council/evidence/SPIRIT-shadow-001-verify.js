'use strict';
const assert=require('node:assert/strict');
const A=[...'אבגדהוזחטיכלמנסעפצקרשת'], M=['אלף','בית','גימל','דלת','הא','ויו','זין','חית','טית','יוד','כף','למד','מם','נון','סמך','עין','פא','צדי','קוף','ריש','שין','תיו'], V=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const norm=s=>s.replace(/[ךםןףץ]/g,c=>'כמנפצ'['ךםןףץ'.indexOf(c)]).replace(/[^א-ת]/g,'');
const sum=s=>[...norm(s)].reduce((a,c)=>{const i=A.indexOf(c),x=V[i];return [a[0]+x,a[1]+i+1,a[2]+i%9+1,a[3]+(x>=10?x/10:x)];},[0,0,0,0]);
const blocks=(s,over={})=>[...norm(s)].map(c=>(over[c]||M[A.indexOf(c)]).slice(1));
const name='עמית מייק רוב', sh=s=>blocks(s).join('');
assert.deepEqual(sum(name),[888,141,33,96]);assert.deepEqual(sum(sh(name)),[1008,198,81,144]);assert.equal(sum('צל')[0],120);assert.equal(136^888,1008);
for(const [over,expected] of [[{},1008],[{ת:'תו'},998],[{ו:'ואו'},999],[{ו:'ואו',ת:'תו'},989],[{מ:'מים'},1028],[{ר:'רש'},998],[{ה:'האי'},1008]])assert.equal(sum(blocks(name,over).join(''))[0],expected);
let n=0,hit=[];for(const e of 'זעש')for(const t of 'ות')for(const w of 'ות')for(const b of 'בחט'){const s=e+'מי'+t+' מייק ר'+w+b;n++;assert.deepEqual(blocks(s),blocks(name));if(sum(s)[0]===888)hit.push(s);}
assert.equal(n,36);assert.deepEqual(hit,['עמיו מייק רתב',name]);
const scores=A.map(c=>sum(sh(c)).slice(2));let count=0,sets=new Set();function walk(s,k,x,y){if(k===0){if(x===37&&y===73){count++;sets.add([...s].sort().join(''));}return;}for(let i=0;i<A.length;i++)walk(s+A[i],k-1,x+scores[i][0],y+scores[i][1]);}walk('',5,0,0);assert.equal(count,85545);assert.equal(sets.size,955);console.log({preimages:n,regularHits:hit,bezalelPair:count,multisets:sets.size});
