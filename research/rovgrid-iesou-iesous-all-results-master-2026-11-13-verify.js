#!/usr/bin/env node
'use strict';
const assert = require('node:assert/strict');
const scales=[4,16,32,64];
const data=[["English Simple",[256,1024,2048,4096],64],["English Gematria",[1536,6144,12288,24576],384],["Jewish Gematria",[1396,5584,11168,22336],349],["English One-step Zero",[220,880,1760,3520],55],["English Cumulative Alphabet",[7960,31840,63680,127360],1990],["English Building",[576,2304,4608,9216],144],["Simple Word Position ×",[1024,4096,8192,16384],256],["English ALBaM analogue",[1664,6656,13312,26624],416],["English Atbash Ordinal",[176,704,1408,2816],44],["אלפבית כוח בית · φ",[null,288,576,1152],18],["אלפבית כוח בית · √2",[null,256,512,1024],16],["אלפבית כוח בית · √3",[null,416,832,1664],26],["אלפבית כוח בית · √37",[null,432,864,1728],27],["אלפבית כוח בית · זווית הזהב במעגל 9",[null,256,512,1024],16],["אלפבית כוח בית · e",[null,256,512,1024],16],["אלפבית כוח בית · 1",[null,288,576,1152],18],["English Atbash → Regular",[null,null,4288,8576],134],["English Small",[null,null,null,1216],19]];
let checked=0;
for(const [label,values,base] of data){
 for(let i=0;i<scales.length;i++){
  if(values[i]===null)continue;
  assert.equal(values[i],base*scales[i],label+' ×'+scales[i]);checked++;
 }
}
assert.equal(checked,60);
const ord = Object.fromEntries([...Array(26)].map((_,i)=>[String.fromCharCode(65+i),i+1]));
const simple = w=>[...w].reduce((s,c)=>s+ord[c],0);
const atbash = w=>[...w].reduce((s,c)=>s+27-ord[c],0);
const atbashWord = w=>[...w].map(c=>String.fromCharCode(64+27-ord[c])).join('');
const small = w=>[...w].reduce((s,c)=>s+1+(ord[c]-1)%9,0);
const jew={I:9,E:5,S:90,O:50,U:200,Y:400,H:8};
const jewish = w=>[...w].reduce((s,c)=>s+jew[c],0);
const eq=(x,y)=>assert.equal(x,y);
eq(simple('ISOU'),64);eq(simple('IESOU'),69);eq(simple('IESOUS'),88);
eq(atbash('IESOUS'),74);eq(atbashWord('IESOUS'),'RVHLFH');
eq(simple('RVHLFH'),74);eq(atbash('RVHLFH'),88);
eq(simple('JESUS'),74);eq(atbash('JESUS'),61);
eq(jewish('YESHU'),703);eq(jewish('IESOU'),354);eq(jewish('IESOUS'),444);
eq(small('YESHU'),24);eq(small('IESOU'),24);eq(small('IESOUS'),25);
eq(simple('IESOUS')*6,528);eq(simple('IESOUS')*6,528);
eq(simple('JESUS')*6,444);eq(simple('RVHLFH')*6,444);
eq(simple('RVHLFH')*'RVHLFH'.length,444);
eq(444,12*37);eq(703,19*37);eq(74,2*37);eq(888,24*37);
eq(1216+1152,888+1480);eq(888+1480,2368);eq(2368,64*37);
eq(64,8**2);eq(144,12**2);eq(256,16**2);
eq(416,2*(64+144));eq(13312,2*(2048+4608));eq(26624,2*(4096+9216));
eq(703+444,31*37);eq(703-444,7*37);
eq(simple('CHRISTOS'),111);eq(simple('CHRISTUS'),117);eq(simple('IESUS'),73);
eq(simple('IESOUSCHRISTOS'),199);eq(simple('IESUSCHRISTUS'),190);eq(simple('IESOUSCHRISTUS'),205);
console.log('PASS: '+checked+' scaled observations and all cross-name arithmetic checks');
