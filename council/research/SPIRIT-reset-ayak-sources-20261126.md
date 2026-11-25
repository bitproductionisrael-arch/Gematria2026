# SPIRIT RESET — AIQ BKR source audit, 2026-11-26
OPEN; ABSTAIN. Reset replaces stalled historical-array/Amitabha queue temporarily. Prior state and feedback read. Old corpus: research/rovgrid-aiq-bekar-1887-888-agrippa-fideler-solar-square-2026-11-11.md (full); council/research/WORK-abc-d4-ayak-20261125.md (full). Calculator relevant declarations inspected. Tree enumerated 505 research blobs, not read in full. 2 files reviewed, 3 claim groups; 80/20 time allocation not measured.
## SP-RESET-AYAK-01 — historical interpretation
Primary text transcription: Moses Cordovero, Pardes Rimmonim gate 23 chapter 1, entry אי"ק, https://he.wikisource.org/wiki/פרדס_רמונים_כג_א ; interpretation of 100/10/1 through priest/Levite/Israel and Keter/Hokhmah/Binah, reciprocal dependence. Corroborating excerpt https://rashby.co.il/dictionary/אי״ק/ (dictionary search result). This supports a traditional hierarchy, not a rotating gear or a unique spatial center. Grade 2 pending edition collation. Alternative tradition: Kehillat Yaakov entry אי, and R. Moses Zacuto, Em LaBinah entry aleph, cited at https://rashby.co.il/dictionary/אי״ק-בכ״ר/ ; units/tens/hundreds associated with Malkhut/Zeir Anpin/Binah or three vessels. These are secondary excerpts, not independently collated primary editions. The latter excerpt gives alphabet total 1495, matching 22 ordinary letters rather than full 27-symbol total 4995; context of this number needs primary collation. Do not collapse different sefirotic assignments.
## SP-RESET-AYAK-02 — earlier historical lead
Gideon Bohak, Tarbiz 83 (2015), 513–529, cites Geneva 51, Rosenthal pp105–106, where a writer attributes AIQ BKR to India. https://www.academia.edu/22880843/ ; search excerpt consulted, not manuscript. Grade 1 for attribution lead, not proof of Indian origin. Falsifier: manuscript wording or dating differs. ARCHIVIST should collate.
## SP-RESET-AYAK-03 — arithmetic distinction
Calculator AYAK_CHAMBERS constructs nine triples, cyclic substitution with HE_SOFIT. Each chamber d has weights d,10d,100d, sum111d. Full sum4995, ordinary alphabet1495, final additions3500. Four chambers close on ordinary alphabet; five do not (already established by WORK, not novelty). Normalizing ן to נ changes chamber 7 to 5, so normalizing output does not preserve the chamber. The middle tier is a conventional choice, not a geometrically unique center; all three tiers have nine members. Grade 3 executed arithmetic; historical claim separate. ASI T1–T4 N/A for deterministic mapping and textual provenance; no rarity/authorship inference. Duplicate check: old AIQ report and WORK closure read, no corpus-wide novelty claim. 
Actual executed JS and output below.
```js
const A='אבגדהוזחטיכלמנסעפצקרשת',F='ךםןףץ';const C=Array.from({length:9},(_,i)=>[A[i],A[i+9],i<4?A[i+18]:F[i-4]]);const rows=C.map((c,i)=>({letters:c.join(''),weights:[i+1,10*(i+1),100*(i+1)],sum:111*(i+1)}));const sum=a=>a.reduce((x,y)=>x+y,0);const out={rows,total:sum(rows.map(r=>r.sum)),standard22:sum(rows.flatMap(r=>r.weights.filter((v,j)=>j<2||v<=400))),finals:sum(rows.slice(4).map(r=>r.weights[2])),closed22:C.filter(c=>c.every(x=>A.includes(x))).map(c=>c.join('')),centerChoices:C.map(c=>c[1]),counterexample:{letter:'ע',orbit:C[6],normalizedFinal:'נ',originalChamber:7,normalizedChamber:5}};console.log(JSON.stringify(out,null,2));
```
```json
{
  "rows": [
    {
      "letters": "איק",
      "weights": [
        1,
        10,
        100
      ],
      "sum": 111
    },
    {
      "letters": "בכר",
      "weights": [
        2,
        20,
        200
      ],
      "sum": 222
    },
    {
      "letters": "גלש",
      "weights": [
        3,
        30,
        300
      ],
      "sum": 333
    },
    {
      "letters": "דמת",
      "weights": [
        4,
        40,
        400
      ],
      "sum": 444
    },
    {
      "letters": "הנך",
      "weights": [
        5,
        50,
        500
      ],
      "sum": 555
    },
    {
      "letters": "וסם",
      "weights": [
        6,
        60,
        600
      ],
      "sum": 666
    },
    {
      "letters": "זען",
      "weights": [
        7,
        70,
        700
      ],
      "sum": 777
    },
    {
      "letters": "חפף",
      "weights": [
        8,
        80,
        800
      ],
      "sum": 888
    },
    {
      "letters": "טצץ",
      "weights": [
        9,
        90,
        900
      ],
      "sum": 999
    }
  ],
  "total": 4995,
  "standard22": 1495,
  "finals": 3500,
  "closed22": [
    "איק",
    "בכר",
    "גלש",
    "דמת"
  ],
  "centerChoices": [
    "י",
    "כ",
    "ל",
    "מ",
    "נ",
    "ס",
    "ע",
    "פ",
    "צ"
  ],
  "counterexample": {
    "letter": "ע",
    "orbit": [
      "ז",
      "ע",
      "ן"
    ],
    "normalizedFinal": "נ",
    "originalChamber": 7,
    "normalizedChamber": 5
  }
}
```
Next: collate Pardes and Em LaBinah primary editions; compare the 1495/4995 distinction with textual context, then return to Amitabha. Expertise: linguistic interpretation high, manuscript dating limited; progress medium due to edition access. Mathematical verification high, historical origin low without manuscript. No lock.