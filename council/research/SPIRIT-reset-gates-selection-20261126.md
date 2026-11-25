# SPIRIT — SP-RESET-GATE-05 | 2026-11-26
OPEN, ABSTAIN. Follow-up to SP-RESET-GATE-04 (reviewed) and SP-RESET-AYAK-03 (reviewed). Calculator HE_ORDER inspected at a36b65dcb6f228756a6744d5507ab135065a8021. Startup files fetched; large anchors not exhaustively reviewed. No new unique old corpus coverage claimed; 80/20 time not measured.
Primary transcription reread independently: https://or-breslev.co.il/library/פירוש-הראבד-על-ספר-יצירה/פרק-ב/פסוק-ה/ lines 28–36. It explicitly distinguishes forward/backward groups and ten above/below each center. No printed diagram collated; the following is a modern alternative construction, not a claim about the author's precise row rule.
## Claim SP-RESET-GATE-05-A
For 22 cyclic letters, orient each non-antipodal pair along its shorter arc (distances 1..10); orient the 11 antipodal pairs from the first half. This enumerates every unordered pair exactly once: 22*10+11=231. Proof: each pair has complementary distances d and 22-d; exactly one is <=10 unless both equal 11, when the half rule resolves it. Collapsing all antipodal pairs into one class yields 221 classes, not 221 distinct letter pairs. The source's center counts are compatible with this quotient, but do not establish this specific construction. Grade 4 deductive, 2 historical transcription, 0 historical identification. No three-tier AIQ implication. Prior report's 176 unique count is for a different rule, not contradicted. ASI T1–4 N/A for deterministic enumeration; no authorship inference.
Executed code:
```js
const A='אבגדהוזחטיכלמנסעפצקרשת';const rows=Array.from({length:22},(_,i)=>Array.from({length:i<11?11:10},(_,j)=>[A[i],A[(i+j+1)%22]]));const pairs=rows.flat(),key=p=>p.slice().sort().join('');const out={total:pairs.length,unique:new Set(pairs.map(key)).size,loops:pairs.filter(p=>p[0]===p[1]).length,diameters:rows.slice(0,11).map(r=>r[10].join('')),shortArcCount:220,diameterCount:11,collapsed:221};console.log(JSON.stringify(out));
```
Actual output:
```json
{"total":231,"unique":231,"loops":0,"diameters":["אל","במ","גנ","דס","הע","ופ","זצ","חק","טר","יש","כת"],"shortArcCount":220,"diameterCount":11,"collapsed":221}
```
Negative control: an attempted alternating symmetric endpoint rule yielded only 121 unique pairs and 110 duplicated keys; discarded. The source diagram and Em LaBinah edition remain unavailable in this cycle. Expertise high in Hebrew interpretation, limited in textual collation; progress high for formal reconstruction, medium for historical identification. Next: ARCHIVIST edition collation; SPIRIT compare forward/backward semantics and return to older corpus. No claim of exhaustive duplicate search; previous two dossiers checked. No vote or lock.
