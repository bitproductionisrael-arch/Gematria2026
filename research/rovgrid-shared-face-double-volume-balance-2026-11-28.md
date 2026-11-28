# RG-002 — Shared-face double-volume balance
2026-11-28. Supplemental exact mathematics. No formal council lock or physical inference.
## Prior evidence
research/rovgrid-ronald-exposure-twin-cuboids-8-20-26-10-16-28-2026-11-18.md already documents shared face 160, transfer 72, volume difference 320, and uniqueness given S=54 and Q=888.
research/MATTER-cuboid-reflection-audit-20261128.md independently audits that fixed S,Q classification.
## New result
Fix S=54 ONLY. Consider all distinct unordered positive integer triples with equal sum of pair products Q. Require a shared face area p and absolute volume difference 2p. Exactly one unordered pair of triples passes: (8,20,26) and (10,16,28); p=160, Q=888 and volumes 4160,4480. Q was not an input. These are retrospective mathematical constraints, not statistical population controls.
## General theorem
Let distinct boxes (a,b,c),(d,e,f) share ab=de=p>0, sum S and pair sum Q. Write x=a+b,y=d+e. Then c=S-x, f=S-y and Q=p+x(S-x)=p+y(S-y). Thus (x-y)(S-x-y)=0. If x=y, the two base rectangles are roots of the same quadratic and the boxes are identical up to order. Otherwise x+y=S, c=y, f=x. Consequently |V-V'|=p|x-y|. This is a necessary and sufficient construction (exclude identical boxes).
For integer rectangles sharing product p, write a=gr,d=gs where g=gcd(a,d) and gcd(r,s)=1. The equality ab=de gives b=hs,e=hr for positive integer h. The construction is
A=(gr,hs,gs+hr), B=(gs,hr,gr+hs).
S=(g+h)(r+s), p=ghrs, |V-V'|=p|g-h||r-s|.
The double-volume condition forces the two absolute gaps to be 1 and 2 in either order. For S=54, the positive factor-sum pairs with required parity and positivity are (even,odd)=(6,9),(18,3); (2,27) cannot have positive distinct integer entries with gap 2. The first gives the pairs (2,4),(4,5); the second (8,10),(1,2). Both generate the same two boxes up to order (some representations fail coprimality but still construct valid boxes). Thus this classification is also analytic, not just an enumeration. Q=160+26*28=888.
## Reproducible executed JavaScript
```js
let groups=new Map(), checks=0;
for(let a=1;a<=54;a++)for(let b=a;b<=54;b++){
 let c=54-a-b;if(c<b)continue;
 let q=a*b+a*c+b*c;
 let o={s:[a,b,c],faces:[a*b,a*c,b*c],v:a*b*c};
 if(!groups.has(q))groups.set(q,[]);groups.get(q).push(o);checks++;
}
let pairs=[];
for(let [q,boxes] of groups)for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
 let A=boxes[i],B=boxes[j];
 let shared=[...new Set(A.faces.filter(x=>B.faces.includes(x)))];
 pairs.push({q,A:A.s,B:B.s,shared,delta:Math.abs(A.v-B.v)});
}
let tests=0,fail=0;
for(let g=1;g<=12;g++)for(let h=g+1;h<=12;h++)
for(let r=1;r<=12;r++)for(let s=r+1;s<=12;s++){
 let a=g*r,b=h*s,c=g*s+h*r,d=g*s,e=h*r,f=g*r+h*s,p=g*h*r*s;
 tests++;
 if(a+b+c!==d+e+f||a*b+a*c+b*c!==d*e+d*f+e*f||a*b!==d*e||Math.abs(a*b*c-d*e*f)!==p*(h-g)*(s-r))fail++;
}
console.log({checks,distinctQ:groups.size,pairs:pairs.length,sharedPairs:pairs.filter(x=>x.shared.length).length,target:pairs.filter(x=>x.q===888),ratioTwo:pairs.filter(x=>x.shared.some(p=>x.delta===2*p)),paramTests:tests,fail});
```
Actual result: 243 triples; 159 distinct Q values; 102 equal-Q unordered pairs; 11 with a shared face; exactly one double-volume match, {q:888,A:[8,20,26],B:[10,16,28],shared:[160],delta:320}. 4356 parameter tests, zero failures. The parameter tests verify algebraic identities, not distinctness in every case or independent experimental evidence.
## Scope / next
Accept theorem and finite classification on this evidence. The factor 2 and S=54 were chosen retrospectively; no claim of independent probability, personal identity, or universal physical balance. Next: classify S admitting double-volume pairs and derive a count in terms of divisors, explicitly excluding identical boxes. Independent review of the new theorem welcome. No operational changes.
