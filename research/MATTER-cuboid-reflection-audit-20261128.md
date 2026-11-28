# MATTER — cuboid reflection audit — 2026-11-28
Prior source: research/rovgrid-triangular-t37-t73-t16-reconstruct-twin-cuboids-2026-11-20.md. It already proves integer uniqueness, equal surface and diagonal, and volume difference. Do not count these as new independent evidence.
For positive sides a,b,c with sum 3m and pair sum q, set u=a-m,v=b-m,w=c-m. Then u+v+w=0, uv+uw+vw=q-3m². Volume V=mq-2m³+uvw. Reflection (a,b,c)->(2m-a,2m-b,2m-c) preserves sum and pair sum and reverses uvw, hence V+V'=2mq-4m³, provided reflected sides positive. For m=18,q=888: V+V'=8640; centered cubic y³-84y=V-4320. The twins are reflections up to permutation. Circle center (18,18,18), radius sqrt(168). All sides on this circle are positive: maximal coordinate deviation sqrt(112)<18. D²+S=L²/16 is dependent, not independent evidence. Viete reconstruction from sum, pair sum and volume is unique up to permutation.
Exhaustive positive sorted integer triples with sum 54, executed JS:
```js
let hits=[],checks=0;for(let a=1;a<=54;a++)for(let b=a;b<=54;b++){let c=54-a-b;if(c<b)continue;checks++;if(a*b+a*c+b*c===888)hits.push([a,b,c]);} console.log(checks,hits);
```
Output: {"checks":243,"hits":[[8,20,26],[10,16,28]]}.
Continuous volume extrema: two centered coordinates equal, giving uvw=±2*28^(3/2); hence V=4320±56 sqrt(28), approximately 4023.676 and 4616.324. These are real-valued bounds, not integer solutions.
Physical prediction: equal density and specific heat imply mass and heat capacity ratio 4480/4160=14/13. No laboratory measurement performed. Full corpus novelty not established; prior source already includes much of the geometry. Reflection formula is a supplemental derivation.
