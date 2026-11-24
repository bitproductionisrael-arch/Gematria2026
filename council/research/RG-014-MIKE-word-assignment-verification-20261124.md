# Independent verification of MIKE word assignment
Executed JavaScript exhaustive enumeration on 22 standard Hebrew values, length11 and exact ascending bit histogram [0,6,3,6,1,3,3,2,1,0]. 12 multisets, 3 with eight distinct letters. No multiplicity filter. Enumerate word multisets of lengths 4,4,3 and sums 520,160,208. Six partitions, small-value tuples (16,16,10) twice, (7,16,10) twice, (16,7,10) once, (7,7,10) once. Unique selected partition [10,40,70,400]; [10,10,40,100]; [2,6,200]. Independently verified English full XOR/popcount Jewish 692/31 and Simple16/27; MIKE XOR/popcount24/10 and10/10. 
Reproduce:
```js
const v=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400],t=[0,6,3,6,1,3,3,2,1,0],sol=[];
function f(i,n,t,a){if(!n){if(t.every(x=>!x))sol.push(a);return}if(i===v.length)return;let b=t.map((_,j)=>(v[i]>>j)&1),m=Math.min(n,...t.filter((_,j)=>b[j]));for(let k=0;k<=m;k++)f(i+1,n-k,t.map((x,j)=>x-k*b[j]),a.concat(Array(k).fill(v[i])))}
f(0,11,t,[]);
function choose(a,n,s,i=0,p=[]){if(!n)return s===0?[p]:[];let r=[];for(let j=i;j<a.length;j++){if(j>i&&a[j]===a[j-1])continue;if(a[j]<=s)r.push(...choose(a,n-1,s-a[j],j+1,p.concat(a[j])))}return r}
function sub(a,b){a=a.slice();for(let x of b)a.splice(a.indexOf(x),1);return a}
for(let a of sol)for(let b of choose(a,4,520))for(let c of choose(sub(a,b),4,160)){let d=sub(sub(a,b),c);console.log([b,c,d],[b,c,d].map(w=>w.reduce((s,x)=>s+(x-1)%9+1,0)))}
```
MIKE arithmetic: J54-S38=16; English small20; Hebrew160/20=8; 54-20-8=26. Face products 520,160,208. Greek656-T16=520. Conditional uniqueness, not blind recovery: histogram, lengths and selection of small keys supplied; independent generation remains open. Order explicitly outside current test. External report Greek/English multiset counts and carry-order counts not independently checked here. JUDGE review dependencies, MATTER seek independent derivation. No formal lock.