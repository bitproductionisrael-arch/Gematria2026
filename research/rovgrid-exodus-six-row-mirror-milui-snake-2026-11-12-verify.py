#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Independent 6x72 mirror and cumulative milui snake audit.
Usage: python3 research/rovgrid-exodus-six-row-mirror-milui-snake-2026-11-12-verify.py
No dependencies; source rows are fixed exactly as in the previous 72-name census.
"""
from collections import Counter
V = [
    "ויסעמלאכהאלהימההלכלפנימחנהישראלוילכמאחריהמויסעעמודהעננמפניהמויעמדמאחריהמ",
    "ויבאבינמחנהמצרימובינמחנהישראלויהיהעננוהחשכויאראתהלילהולאקרבזהאלזהכלהלילה",
    "ויטמשהאתידועלהימויולכיהוהאתהימברוחקדימעזהכלהלילהוישמאתהימלחרבהויבקעוהמימ",
]
ABC = "אבגדהוזחטיכלמנסעפצקרשת"
REG = dict(zip(ABC,[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
ORD = {c:i+1 for i,c in enumerate(ABC)}
ATB = {c:22-i for i,c in enumerate(ABC)}
def val(s,d): return sum(d[c] for c in s)
def run():
    assert [len(v) for v in V]==[72,72,72]
    original=[V[0],V[1][::-1],V[2]]
    mirror=[row[::-1] for row in original[::-1]]
    six=original+mirror
    assert [len(row) for row in six]==[72]*6
    assert six==[V[0],V[1][::-1],V[2],V[2][::-1],V[1],V[0][::-1]]
    assert all(six[r][c]==six[5-r][71-c] for r in range(6) for c in range(72))
    assert len("".join(six))==432
    assert [val("".join(six),m) for m in [REG,ORD,ATB]] == [18286,4318,5618]
    names=[V[0][i]+V[1][71-i]+V[2][i] for i in range(72)]
    # Mirrored lower triplets equal reversed upper triplets at the opposite column.
    for i in range(72):
        bottom="".join(six[r][i] for r in (3,4,5))
        assert bottom==names[71-i][::-1]
    assert len(set(names))==69
    pairs=[(i+1,72-i,names[i],names[71-i],val(names[i]+names[71-i],REG)) for i in range(36)]
    assert len(pairs)==36 and len({tuple(sorted((a,b))) for a,b,*_ in pairs})==36
    minimum=min(row[4] for row in pairs)
    assert minimum==36
    assert [p for p in pairs if p[4]==minimum]==[(24,49,"חהו","והו",36)]
    assert 24+49==73 and 49-24==25
    assert val(names[23],REG)==19 and val(names[48],REG)==17
    assert 73-36==37 and names[36]=="אני"
    assert val("אניהוא",REG)==73 and val("אניהוא",ORD)==37
    assert val("אני",ORD)==25
    assert [(p[0],p[1]) for p in pairs if p[4]==216]==[(20,53)]
    assert val(names[19],REG)==115 and val(names[52],REG)==101
    milui=["יוד","הא","ויו","הא"]
    prefixes=["".join(milui[:i]) for i in range(1,5)]
    prefix_values=[val(p,REG) for p in prefixes]
    assert prefix_values==[20,26,48,54]
    assert [val(p,ORD) for p in prefixes]==prefix_values
    assert [len(p) for p in prefixes]==[3,5,8,10]
    assert sum(prefix_values)==148 and sum(map(len,prefixes))==26
    assert prefix_values[0]+prefix_values[3]==prefix_values[1]+prefix_values[2]==74
    assert 148==4*37 and 37==26+22//2
    assert 6*148==888==24*37
    assert 3*148==444 and 444+444==888
    assert 6*(20+54)==6*(26+48)==444
    assert 444==4*val("מיאני",REG)==4*111
    snake="".join(prefixes)
    assert (len(snake),val(snake,REG),val(snake,ORD),val(snake,ATB))==(26,148,148,450)
    assert (len(snake*6),val(snake*6,REG),val(snake*6,ATB))==(156,888,2700)
    assert 2700+1==2701==37*73 # conditional added +1, not intrinsic
    assert val("מיאתה",REG)==456 and val("איפהאנחנו",ORD)==76
    assert 148==72+76 and 432==6*72 and 456==6*76 and 432+456==888
    # Distinguish source letters (432) from the six decorative prefix strings (156).
    assert 432!=156
    print("PASS: six-row 180° mirror, 216 letter pairs, 36 column pairs, minimum #24+#49, prefix snake 6x148=888")
if __name__=="__main__": run()
