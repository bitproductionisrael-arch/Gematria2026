// Independent arithmetic and D4 verification, RovGrid 13 Nov 2026
// Run: node research/rovgrid-32-grid-cube-shell-37-43-888-136-2026-11-13-verify.js
const assert=require('node:assert/strict');
const cube=n=>n**3, T=n=>n*(n+1)/2;
const star=n=>6*n*(n-1)+1, centered=(p,n)=>1+p*n*(n-1)/2;
assert.equal(10+8+10+4+5,37);
assert.equal(1+13+9+20,43);
assert.equal(centered(6,4),37);assert.equal(centered(7,4),43);
assert.equal(centered(7,4)-centered(6,4),6);
for(let n=1;n<1000;n++) assert.equal(star(n)===(cube(n+1)-cube(n)),n===3);
assert.equal(cube(8)-cube(6),296);
assert.equal(296,8*(cube(4)-cube(3)));
assert.equal(64+48+36,148);assert.equal(2*148,296);
assert.equal(3*296,888);assert.equal(6*148,888);
assert.equal(3*cube(6)-cube(8),136);
assert.equal(3*(cube(8)-cube(6))+136,1024);
assert.equal(32*32-30*30+12,136);
assert.equal(30*30-12,888);
assert.equal(26+28+26*30+28+26,888);
assert.equal(888/8,111);assert.equal(136/8,17);
assert.equal(888&136,8);assert.equal(888|136,1016);
assert.equal(888^136,1008);
assert.equal(4096/(512/111),888);
assert.ok(Math.abs(4096/4.612611999-888)<0.001);
for(let m=3;m<1000;m++) assert.equal(8*(m+1)===T(m),m===16);
const guard=(x,y)=>{
 const a=Math.min(x,31-x),b=Math.min(y,31-y);
 return a===0||b===0||(a===1&&b===1)||(a===1&&b===2)||(a===2&&b===1);
};
let sums={core:0,guard:0};
const seen=new Set(),orbits={core:{4:0,8:0},guard:{4:0,8:0}};
for(let y=0;y<32;y++)for(let x=0;x<32;x++){
 const k=x+','+y;if(seen.has(k))continue;
 const pairs=[[x,y],[31-y,x],[31-x,31-y],[y,31-x],[31-x,y],[x,31-y],[y,x],[31-y,31-x]];
 const set=new Set(pairs.map(([u,v])=>u+','+v));
 const category=guard(x,y)?'guard':'core';
 for(const key of set) { const [u,v]=key.split(',').map(Number);assert.equal(guard(u,v),guard(x,y));seen.add(key);}
 assert.ok(set.size===4||set.size===8);
 orbits[category][set.size]++;sums[category]+=set.size;
}
assert.deepEqual(sums,{core:888,guard:136});
assert.deepEqual(orbits,{core:{4:14,8:104},guard:{4:2,8:16}});
console.log('PASS — grid, D4, 37/43, cubes, ratios and bitwise checks');
