#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Independent RovGrid verification of 136 spelled out, קדמ קול, and Genesis bridge."""
HEBREW="אבגדהוזחטיכלמנסעפצקרשת"
STANDARD={c:(i+1 if i<9 else (i-8)*10 if i<18 else (i-17)*100) for i,c in enumerate(HEBREW)}
BASE_FINALS={"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"}
for c,b in BASE_FINALS.items(): STANDARD[c]=STANDARD[b]
ORD={c:i+1 for i,c in enumerate(HEBREW)}
for c,b in BASE_FINALS.items(): ORD[c]=ORD[b]
SMALL={c:1+(v-1)%9 for c,v in STANDARD.items()}
ZERO1={c:(v//10 if v>=10 and v%10==0 else v) for c,v in STANDARD.items()}
ATBASH_ORD={c:23-ORD[c] for c in STANDARD}
def value(t,mapping): return sum(mapping[c] for c in t.replace(" ","") if c in mapping)
def word_position_small(text): return sum(len(w)*value(w,SMALL) for w in text.split())
p="מאה שלשים ושש"
assert [len(w) for w in p.split()] == [3,5,3]
assert sum(map(len,p.split())) == 11
assert [value(w,SMALL) for w in p.split()] == [10,14,12]
assert [value(p, m) for m in (STANDARD,ORD,SMALL,ZERO1)] == [1332,144,36,144]
assert word_position_small(p) == 3*10+5*14+3*12 == 136
assert value(p,STANDARD) == 1332 == 2*666 == 3*444 == 444+888
assert value(p,STANDARD) == 37*36 == 9*148
assert value(p,ORD) == 144 == 12**2 == 4*36
assert value(p,SMALL) == 36 == 6**2
assert value(p,ORD)-word_position_small(p)==8
assert value("קדם",STANDARD)==144 and value("קול",STANDARD)==136
assert value("קדם קול",STANDARD)==280==2*140
assert [value("קדם קול",m) for m in (ORD,ZERO1,ATBASH_ORD)]==[73,37,65]
assert value("קדם קול",ORD)-value("קדם קול",ATBASH_ORD)==8
assert value("קדם קול",ORD)-value("קדם קול",ZERO1)==36
assert value("קדם קול",ORD)+value("קדם קול",ATBASH_ORD)==6*23==138
assert value("בראשית ברא אלהים את השמים ואת הארץ",STANDARD)==2701==37*73
assert value("ורוח אלהים מרחפת על פני המים",STANDARD)==1369==37**2
assert 2701-1369==1332
assert 37*(73-37)==1332
assert (73-65)*37==296==value("הארץ",STANDARD)
assert (73-37)*37 == value(p,STANDARD)
assert 144+136==280
# Site's Agrippa-type mapping gives Amit = A1+M30+I9+T100 = 140.
assert 1+30+9+100==140
print("PASS: 1332/144/36/136, Kadam Kol 73/37/65, Genesis difference and midpoint.")
