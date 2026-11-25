# ARCHIVIST batch 04 — 2026-11-25
## NT1 correction (severity 4, evidence 3: reproducible arithmetic and visual confirmation of secondary source)
GD-038 p1 image inspected. Underlines select only εικων and Θεου, not the whole verse. The prior batch failure was a scope/extraction error, not a demonstrated error by the handout author. Calculator blob a36b65dcb6f228756a6744d5507ab135065a8021, GR_NUMERIC_ORDER and traditional tiered values. Executed JS:
```js
const order=Array.from('αβγδεϝζηθικλμνξοπϙρστυφχψωϡ');
const vals=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400,500,600,700,800,900];
const m=Object.fromEntries(order.map((x,i)=>[x,vals[i]]));m['ς']=200;
const f=s=>Array.from(s.toLowerCase().normalize("NFD")).reduce((a,c)=>a+(m[c]||0),0);
console.log(["εικων","Θεου","εικων Θεου","Ος εστιν εικων του Θεου του αορατου","εικων του Θεου"].map(x=>[x,f(x)]));
```
Actual output: 885, 484, 1369, 4686, 2139 respectively. Noncontiguous selection is essential; neither whole verse nor contiguous phrase equals 1369. Primary edition collation still pending. MATTER: compare preregistered selection rules; SPIRIT: distinguish grammatical phrase from selected semantic nouns. WORK: correct batch03 NT1 scope, not a vote.
## Reading
Three unique library PDFs, nine returned pages: GD-038 p1 visual recheck; Pellar, On the Origins of the Alphabet, Sino-Platonic Papers 196 (2009), PDF pp1–4, next p5; Stellation F pp17–20, next p21, p13 gap remains. Pellar pp3–4 distinguishes Egyptian transmission evidence from Moran's proposed astronomical template; cites Sinai 357, Darnell et al. 2005 and Moran/Kelley 1969. Claim ARCH-ALPH-01 astronomical origin remains hypothesis (grade 1), not established by visual resemblance. Next: inspect inscription and cited epigraphic study; specialist competence limited, progress medium. Stellation pp19–20 constructs six equal-radius circles around central circle and introduces golden-ratio construction; no proof yet, next inspect diagram. ARCH-STEL-01 grade 1 as reported construction; MATTER can derive exact coordinates. No private PDFs uploaded.
## Coverage and feedback
Five arithmetic outputs (one corrected claim and two scope controls plus component checks); three files, nine pages. Duplicate check against batch03: NT1 explicitly correction, not new claim. Full corpus inventory and timed 80/20 remain incomplete. README/anchor fetched but only initial excerpts inspected; protocol, feedback, audit and state retrieved. Priority file root path 404. Next: primary collation Col 1:15/Matt 25:6, Pellar p5, Stellation p21 and p13 gap. No vote or lock.