// RovGrid × Gematrix 1024 check. Run with: node research/gematrix-1024-2026-11-15-verify.js
const assert = require('node:assert/strict');
const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const jvals=[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500];
const j=Object.fromEntries([...letters].map((c,i)=>[c,jvals[i]]));
const s=Object.fromEntries([...letters].map((c,i)=>[c,i+1]));
const calc=(t,m)=>[...t.toUpperCase()].reduce((a,c)=>a+(m[c]||0),0);
const J=t=>calc(t,j), S=t=>calc(t,s);
const probes=[
['AMIT MIKE ROV',1024,136],['AMIT MIIK ROV',1028,140],['IESOUS',444,88],
['CHRISTUS',580,117],['IESOUS CHRISTUS',1024,205],['IM JESUS',1024,96],
['THE YESHUA OF THE BIBLE',1024,196],['AS YESHUA HEIR I DECLARE',1024,196],
['DEVEKUT',1024,88],['HEXAGRAM SYMBOL',1024,163],['MAURI YESHUA',1024,141],
['I AM THAT I AM ALIVE',1024,144]];
for(const [phrase,jv,sv] of probes){assert.equal(J(phrase),jv,phrase+' Jewish');assert.equal(S(phrase),sv,phrase+' Simple');}
const h=[['עמית',520],['מייק',160],['רוב',208]];
const hm=Object.fromEntries([...'אבגדהוזחטיכלמנסעפצקרשת'].map((c,i)=>[c,[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400][i]]));
const H=t=>[...t].reduce((a,c)=>a+(hm[c]||0),0);
for(const [word,value] of h) assert.equal(H(word),value);
assert.equal(H('עמית מייק רוב'),888);
const n=32, seen=new Set(), idx=(r,c)=>r*n+c;
const actions=(r,c)=>[[r,c],[c,n-1-r],[n-1-r,n-1-c],[n-1-c,r],[r,n-1-c],[n-1-r,c],[c,r],[n-1-c,n-1-r]];
let orbits=0;
for(let r=0;r<n;r++) for(let c=0;c<n;c++){
if(seen.has(idx(r,c)))continue;orbits++;for(const [i,k] of actions(r,c))seen.add(idx(i,k));}
assert.equal(orbits,136);assert.equal(1024-orbits,888);
assert.equal(2**10,1024);assert.equal(16*17/2,136);assert.equal(6*136+208,1024);
const g={Α:1,Β:2,Γ:3,Δ:4,Ε:5,Ζ:7,Η:8,Θ:9,Ι:10,Κ:20,Λ:30,Μ:40,Ν:50,Ξ:60,Ο:70,Π:80,Ρ:100,Σ:200,Τ:300,Υ:400,Φ:500,Χ:600,Ψ:700,Ω:800};
const G=t=>[...t].reduce((a,c)=>a+(g[c]||0),0);
assert.equal(G('ΙΗΣΟΥΣ'),888);assert.equal(G('ΧΡΙΣΤΟΣ'),1480);
assert.equal(G('ΑΜΙΘ ΜΑΙΧΕ ΡΟΒ'),888);
console.log('PASS: Gematrix / RovGrid 1024 audit');
