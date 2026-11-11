#!/usr/bin/env python3
"""Verify Agrippa Jupiter triple names with exact methods from Gematria2026 calculator.html."""
from math import isqrt
ABC="אבגדהוזחטיכלמנסעפצקרשת"
NUM=(1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400)
R=dict(zip(ABC,NUM))
O=dict(zip(ABC,range(1,23)))
A={c:ABC[21-i] for i,c in enumerate(ABC)}
K={}
t=0
for c in ABC:
    t+=R[c]
    K[c]=t
LAT={'א':'Alf','ב':'Bet','ג':'Gml','ד':'Dlt','ה':'Hey','ו':'Vav','ז':'Zin','ח':'Het','ט':'Tet','י':'Yod','כ':'Kaf','ל':'Lmd','מ':'Mem','נ':'Nun','ס':'Smk','ע':'Ayn','פ':'Peh','צ':'Zdk','ק':'Kuf','ר':'Res','ש':'Sin','ת':'Tav'}
def total(s,mp):
    return sum(mp[ch] for ch in s.replace(" ",""))
def atbash(s,mp):
    return sum(mp[A[ch]] for ch in s.replace(" ",""))
def small(s):
    return sum(int(str(R[ch]).strip('0')) for ch in s.replace(' ',''))
def weight(s,mp):
    return sum(len(w)*total(w,mp) for w in s.split())
def ladder(s):
    # prefix sums + suffix sums across each word; coefficient (n+1) per letter.
    return sum((len(w)+1)*total(w,R) for w in s.split())
def latin(s,reduced=False):
    vals=[ord(ch.upper())-64 for c in s.replace(" ","") for ch in LAT[c]]
    return sum(((v-1)%9+1) if reduced else v for v in vals)
def kidmi(s):return total(s,K)
EXPECTED={
"צדקיאל":(235,64,74,569,19,1410,384,1645,1261,207,72),
"יהפיאל":(136,55,83,596,19,816,330,952,636,203,95),
"הסמאל":(136,46,69,528,19,680,230,816,521,160,61),
"עמית":(520,61,31,58,16,2080,244,2600,2020,158,50),
"יהפיאל עמית":(656,116,114,654,35,2896,574,3552,2656,361,145),
"הסמאל עמית":(656,107,100,586,35,2760,474,3416,2541,318,111),
"ישראל":(541,64,51,465,10,2705,320,3246,2051,176,68),
}
for s,expected in EXPECTED.items():
    got=(total(s,R),total(s,O),atbash(s,O),atbash(s,R),small(s),weight(s,R),weight(s,O),ladder(s),kidmi(s),latin(s),latin(s,True))
    assert got==expected,(s,got,expected)
assert total('יהפיאל',R)+total('הסמאל',R)-total('צדקיאל',R)==37
assert total('יהפיאל',O)+total('הסמאל',O)-total('צדקיאל',O)==37
assert (136-55)+(136-46)==235-64
assert total('דגל',R)==37 and total('דגל',O)==19
assert 55+46==101==total('מיכאל',R)
assert 55+46-64==37
assert 55==sum(ord(c)-64 for c in 'ROV')
assert 46==sum(ord(c)-64 for c in 'BLAZE')
assert total('צדקיאל',O)==total('ישראל',O)==64
assert weight('יהפיאל',R)+weight('הסמאל',R)==816+680==1496
assert 1496==sum(i*i for i in range(1,17))==11*136
assert total('הסמאל',R)==16*17//2
assert atbash('הסמאל',R)==32*33//2==528
assert 528+31*32//2==1024
assert total('יהפיאל עמית',R)==total('הסמאל עמית',R)==656
assert 656+368==1024 and 368==160+208
assert weight('יהפיאל עמית',R)==816+2080==2896
assert ladder('יהפיאל עמית')==3552==4*888
assert ladder('יהפיאל עמית')-weight('יהפיאל עמית',R)==656
assert 656-654==116-114==2
assert 361==19**2 and 111*8==888
assert latin('הסמאל')==160 and latin('הסמאל',True)==61
assert latin('הסמאל עמית',True)==111
assert atbash('יהפיאל',R)-atbash('הסמאל',R)==68
print('PASS: all user-supplied Jupiter values plus dual 37, 1496, 528, 3552, 160 and 111.')
