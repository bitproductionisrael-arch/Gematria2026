#!/usr/bin/env node
"use strict";
/* 2026-11-18: independent audit of six images and 37x73 site against RovGrid.
 * Source: https://sites.google.com/site/3d37x73/ and
 * https://sites.google.com/site/37genesis73/dimitry
 * Compare: 3168 square ring / 1024 pair cube frames, Mike ordinal52 cube,
 * 644 tetrahedral edge counts, 7770 surface37 minus corners / tetrahedral35,
 * 23088=26x888, 17280 after removing frame of26.
 */
const assert=require("node:assert/strict");
const greek=require("../greek-letter-milui.js");
const cube=n=>n**3;
const shell=n=>cube(n)-cube(n-2);
const cubeFrame=n=>8+12*(n-2);
const tetraFrame=n=>4+6*(n-2);
const tetrNumber=n=>n*(n+1)*(n+2)/6;
const triangle=n=>n*(n+1)/2;
const ps=(t,mode)=>greek.score(t,mode);
const heOrder="אבגדהוזחטיכלמנסעפצקרשת";
const heValues=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400];
const HR=Object.fromEntries([...heOrder].map((ch,i)=>[ch,heValues[i]]));
const HO=Object.fromEntries([...heOrder].map((ch,i)=>[ch,i+1]));
for(const [final,basic] of Object.entries({ך:"כ",ם:"מ",ן:"נ",ף:"פ",ץ:"צ"})){HR[final]=HR[basic];HO[final]=HO[basic]}
const heb=(s,table=HR)=>[...s].reduce((acc,ch)=>acc+(table[ch]||0),0);

// Explicit Greek readings from the images and standard/ordinal map:
assert.equal(ps("ΚΥΡΙΟΣ","standard"),800);
assert.equal(ps("ΙΗΣΟΥΣ","standard"),888);
assert.equal(ps("ΧΡΙΣΤΟΣ","standard"),1480);
assert.equal(ps("ΚΥΡΙΟΣ ΙΗΣΟΥΣ ΧΡΙΣΤΟΣ","standard"),3168);
assert.equal(ps("ΛΟΓΟΣ","ordinal"),62);
assert.equal(ps("ΛΟΓΟΣ","standard"),373);
assert.equal(ps("ΕΜΜΑΝΟΥΗΛ","standard"),644);
assert.equal(heb("עמנואל",HO),62);
assert.equal(heb("יהוה"),26);
assert.equal(heb("מייק",HO),52);
assert.equal(heb("רוב"),208);
assert.equal(heb("עמית"),520);
assert.equal(heb("הארץ"),296);
assert.equal(heb("משל יהוה"),396);
assert.equal(heb("בראשית ברא אלהים את השמים ואת הארץ"),2701);
assert.equal(heb("בראשית ברא אלהים את השמים ואת הארץ",HO),298);

// Both numbers are produced from the SAME exact side lengths 62 and 26,
// no hidden extra numbers and unique inverse under two specified rules.
const a=62,b=26;
assert.equal(a*a-b*b,3168);
assert.equal((a-b)*(a+b),3168);
assert.equal(a+b,88);
assert.equal(a-b,36);
assert.equal(cubeFrame(a),728);
assert.equal(cubeFrame(b),296);
assert.equal(cubeFrame(a)+cubeFrame(b),1024);
assert.equal(shell(12),728);
assert.equal(shell(8),296);
assert.equal(728,520+208);
assert.equal(296,160+136);
assert.equal(3168,8*396);
assert.equal(3168,11*288);
const inverseSum=(1024+32)/12; const inverseDiff=3168/inverseSum;
assert.equal(inverseSum,88);
assert.equal(inverseDiff,36);
assert.deepEqual([(inverseSum+inverseDiff)/2,(inverseSum-inverseDiff)/2],[62,26]);
for(let x=2;x<90;x++)for(let y=2;y<x;y++){
 const matches=(cubeFrame(x)+cubeFrame(y)===1024&&x*x-y*y===3168);
 assert.equal(matches,x===62&&y===26);
}

// Other cube family: 26^3 = shell frame + face-only + core.
assert.equal(cube(26),17576);
assert.equal(cubeFrame(26),296);
const faceOnly26=6*(26-2)**2;
assert.equal(faceOnly26,3456);
assert.equal((26-2)**3,13824);
assert.equal(296+3456+13824,17576);
assert.equal(cube(26)-cubeFrame(26),17280);
assert.equal(3456+13824,17280);
assert.equal(17280,54*320);
assert.equal(17280,5*3456);
assert.equal(3456,64*54);
assert.equal(320,4480-4160);
assert.equal(320,2*160);
assert.equal(54,8+20+26);
assert.equal(54,3*(3+6+9));

// Scale map cube 13 -> 26 -> 52, preserving 100% of volume.
assert.equal(cube(13),2197);
assert.equal(cube(26),8*cube(13));
assert.equal(cube(52),8*cube(26));
assert.equal(cube(52),64*cube(13));
assert.equal(cube(52),140608);
assert.equal(52,2*26);
assert.equal(52,4*13);
assert.equal(cube(52),8*(cubeFrame(26)+17280));
assert.equal(8*cubeFrame(26),2368);
assert.equal(8*17280,138240);
assert.equal(cube(52),2368+138240);
// Coordinate-enumerated frame, face-only, core for all 8 subcubes within 52^3.
let frames=0,faces=0,cores=0;
for(let x=0;x<52;x++)for(let y=0;y<52;y++)for(let z=0;z<52;z++){
 const loc=[x%26,y%26,z%26];
 const exposure=loc.filter(t=>t===0||t===25).length;
 if(exposure>=2)frames++;
 else if(exposure===1)faces++;
 else cores++;
}
assert.deepEqual([frames,faces,cores],[2368,27648,110592]);
assert.equal(frames+faces+cores,140608);

// Greek 644 and 37/73 tetrahedron frame midpoint 55.
assert.equal(tetraFrame(37),214);
assert.equal(tetraFrame(73),430);
assert.equal(214+430,644);
assert.equal((37+73)/2,55);
assert.equal(cubeFrame(55),644);
assert.equal(tetraFrame(55),322);
for(let n=2;n<=150;n++)assert.equal(cubeFrame(n),2*tetraFrame(n));
assert.equal(heb("רוב",HO),28);
assert.equal(55,18+15+22); // ROV simple

// Genesis 7770 manifold: non-corner surface37, tetrahedral35, and 2 Genesis+Christ.
assert.equal(cube(37),50653);
assert.equal(cube(35),42875);
assert.equal(shell(37),7778);
assert.equal(shell(37)-8,7770);
assert.equal(tetrNumber(35),7770);
assert.equal(6*37*35,7770);
assert.equal(74*triangle(14),7770);
assert.equal(2*2701+2368,7770);
assert.equal(2368,37*64);
assert.equal(2701,37*73);
assert.equal(7770,37*(73+73+64));
for(let n=3;n<=200;n++){
 const eq=shell(n)-8===tetrNumber(n-2);
 assert.equal(eq,n===37);
}
// Two language standard + three language ordinal numbers from last image.
assert.equal(ps(greek.PRESETS.genesisLxx,"standard"),3167);
assert.equal(ps(greek.PRESETS.genesisLxx,"ordinal"),446);
const latin="In principio creavit Deus caelum et terram";
const latinOrd=[...latin.toUpperCase()].reduce((sum,c)=>sum+(c>="A"&&c<="Z"?c.charCodeAt(0)-64:0),0);
assert.equal(latinOrd,414);
assert.equal(3167+2701+446+298+414+298+446,7770);
assert.equal(3167+2701+2*(446+298)+414,7770);
assert.equal(414+298+446,1158);

// Nested eight cube frames: 12,16,...,40 and 26 midpoint.
const sideList=[12,16,20,24,28,32,36,40];
assert.deepEqual(sideList.map(cubeFrame),[128,176,224,272,320,368,416,464]);
assert.equal(sideList.reduce((s,n)=>s+n,0),208);
assert.equal(sideList.reduce((s,n)=>s+cubeFrame(n),0),2368);
assert.equal(8*cubeFrame(26),2368);
assert.equal(3168,800+2368);

// Four verses John 1:2-5 value from user/source: arithmetic of factorization.
assert.equal(23088,26*888);
assert.equal(23088,24*26*37);
assert.equal(26*888,26*24*37);

// Explicit typo comparison without making inferred identity assertions:
assert.equal(3186-3168,18);
assert.equal(3186,54*59);

console.log("PASS: source Greek 3168/644/62 and Hebrew 52/296/26; unique (62,26) gives square ring3168 and frame sum1024; cube52 built from eight cube26 with frame totals2368; 17280=54×320; tetra37+tetra73=CubeFrame55=644; 7770 is unique tetrahedral(n−2) vs 37-shell-minus-corners and 2×2701+2368; 23088=26×888; full voxel audit.");
