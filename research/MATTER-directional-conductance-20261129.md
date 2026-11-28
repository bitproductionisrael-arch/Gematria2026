# MATTER — directional conductance invariant (2026-11-29)
Model: homogeneous isotropic rectangular solid, full opposite faces held at fixed potentials, other faces insulating, steady state. Ohm law J=σE gives G_i=σ V/a_i². Same formula for thermal conduction replacing σ by thermal conductivity. Normalize g_i=G_i/σ.
Exact identities: g1*g2=c², g1*g3=b², g2*g3=a²; product g1*g2*g3=V. Thus pair sum is s²−2q, where s=a+b+c and q=ab+ac+bc. Sum g_i=q²/V−2s by expansion. For twin cuboids s=54,q=888, pair sum=1140, product differs. Conductance sum difference is q²*(1/4160−1/4480)>0. Conductance along longest axis ratio B/A=(4480/4160)*(26/28)^2=13/14. Shared face area 160 implies g_long=160/c. Reconstruction a=sqrt(g2*g3) etc; no volume measurement required. These are three separate boundary experiments, not simultaneous parallel resistors. Contact resistance, anisotropy and leakage invalidate ideal prediction.
Computed output: [{"a":[8,20,26],"V":4160,"g":[65,10.4,6.153846153846154],"sum":81.55384615384617,"pair":1140},{"a":[10,16,28],"V":4480,"g":[44.8,17.5,5.714285714285714],"sum":68.0142857142857,"pair":1140}]
Exact integer checks: 16000, zero failures. Reproduction JS:
```js
for(let a=1;a<=20;a++)for(let b=1;b<=20;b++)for(let c=1;c<=20;c++){let V=a*b*c,q=a*b+a*c+b*c,s=a+b+c;console.assert((b*c)**2+(a*c)**2+(a*b)**2===q*q-2*s*V);console.assert(a*a+b*b+c*c===s*s-2*q);}
```
Prior context: README, memory anchor, council index and calculator read; targeted conductance keyword scan found unrelated graph resistance only. Full corpus novelty not established. Prior cuboid reflection and spectral studies are related but do not establish this transport invariant. Standard physical law, new application within this targeted comparison; no laboratory validation.
