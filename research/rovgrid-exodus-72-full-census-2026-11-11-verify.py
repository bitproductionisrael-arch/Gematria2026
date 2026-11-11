#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Exact Exodus 14:19-21 reconstruction of the 72 names; no web request needed.
Run: python3 research/rovgrid-exodus-72-full-census-2026-11-11-verify.py
"""
import json
from collections import Counter
from itertools import combinations
VERSE19="ויסעמלאכהאלהימההלכלפנימחנהישראלוילכמאחריהמויסעעמודהעננמפניהמויעמדמאחריהמ"
VERSE20="ויבאבינמחנהמצרימובינמחנהישראלויהיהעננוהחשכויאראתהלילהולאקרבזהאלזהכלהלילה"
VERSE21="ויטמשהאתידועלהימויולכיהוהאתהימברוחקדימעזהכלהלילהוישמאתהימלחרבהויבקעוהמימ"
ALPHABET="אבגדהוזחטיכלמנסעפצקרשת"
REG=dict(zip(ALPHABET,[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
ORD={c:i+1 for i,c in enumerate(ALPHABET)}
ATB={c:22-i for i,c in enumerate(ALPHABET)}
FINAL=str.maketrans('ךםןףץ','כמנפצ')
def value(s,mapping): return sum(mapping[c] for c in s.translate(FINAL))
def names():
    assert all(len(s)==72 for s in (VERSE19,VERSE20,VERSE21))
    return [VERSE19[i]+VERSE20[71-i]+VERSE21[i] for i in range(72)]
def main():
    n=names()
    assert len(n)==72 and len(set(n))==69
    assert [n[i-1] for i in (1,37,39,49,72)]==['והו','אני','רהע','והו','מומ']
    ords=[value(s,ORD) for s in n]
    regs=[value(s,REG) for s in n]
    atbs=[value(s,ATB) for s in n]
    assert all(a+b==69 for a,b in zip(ords,atbs))
    assert (sum(regs),sum(ords),sum(atbs))==(9143,2159,2809)
    assert 2809==53**2 and 2159+2809==216*23
    assert [[sum(v[j:j+12]) for j in range(0,72,12)] for v in (regs,ords,atbs)]==[
        [1317,932,2490,1479,1971,954],
        [327,347,375,381,405,324],
        [501,481,453,447,423,504]]
    duplicates={k:[j+1 for j,w in enumerate(n) if w==k] for k,c in Counter(n).items() if c>1}
    assert duplicates=={'והו':[1,49],'לאו':[11,17],'מבה':[14,55]}
    assert [j+1 for j,s in enumerate(n) if s[0]==s[2]]==[1,2,7,22,41,49,72]
    assert (regs[71],ords[71],atbs[71])==(86,32,37)
    assert (regs[1],ords[1],atbs[1])==(50,32,37)
    assert regs[70]+regs[71]==111 and ords[70]+ords[71]==57
    assert sum(regs[i]+regs[i+1]==111 for i in range(71))==1
    assert (regs[44], ords[44], atbs[44])==(91,28,41)
    assert regs[0]+regs[36]+regs[48]==95
    assert ords[0]+ords[36]+ords[48]==59
    assert atbs[0]+atbs[36]+atbs[48]==148
    assert [i+1 for i,x in enumerate(regs) if x==i+1]==[]
    assert [i+1 for i,x in enumerate(ords) if x==i+1]==[46]
    assert [i+1 for i,x in enumerate(atbs) if x==i+1]==[29]
    for target,want in ((136,8),(888,0),(1024,0)):
        count=sum(a+b==target for a,b in combinations(regs,2))
        assert count==want,(target,count)
    for target,want in ((888,13),(1024,3)):
        count=sum(a+b+c==target for a,b,c in combinations(regs,3))
        assert count==want,(target,count)
    assert [n[i] for i in range(0,72,12)]==['והו','יזל','נתה','אני','והו','ומב']
    for i,w in enumerate(n):
        assert w==VERSE19[i]+VERSE20[71-i]+VERSE21[i]
        assert Counter(''.join(n))==Counter(VERSE19+VERSE20+VERSE21)
    from itertools import combinations as _choose
    used=set(''.join(n))
    assert len(used)==21 and set(ALPHABET)-used=={'ג'}
    all_pairs=[tuple(sorted((a,b))) for w in n for a,b in _choose(w,2)]
    distinct_slots=[p for p in all_pairs if p[0]!=p[1]]
    gates=set(distinct_slots)
    assert len(all_pairs)==216 and len(distinct_slots)==192
    assert len(gates)==93
    assert 22*21//2==231 and 21*20//2==210
    assert 210-93==117 and 231-93==138
    print("PASS: 72 triads reconstructed from 3x72 Exodus letters; complete values, 6x12 sums, duplications, 888/1024 controls")
if __name__=="__main__": main()
