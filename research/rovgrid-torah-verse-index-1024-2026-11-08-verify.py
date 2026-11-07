#!/usr/bin/env python3
"""Reproduce verse index #1024 and Genesis 35:12 edge-phrase identity."""
from math import isqrt
letters="אבגדהוזחטיכלמנסעפצקרשת"
finals=dict(zip("ךםןףץ","כמנפצ"))
regular={}
for i,c in enumerate(letters):
    regular[c]=i+1 if i<9 else 10*(i-8) if i<18 else 100*(i-17)
ordinal={c:i+1 for i,c in enumerate(letters)}
for f,c in finals.items():
    regular[f]=regular[c]
    ordinal[f]=ordinal[c]
small={c:(v-1)%9+1 for c,v in regular.items()}
def v(s,m): return sum(m.get(c,0) for c in s)
verse="ואת־הארץ אשר נתתי לאברהם וליצחק לך אתננה ולזרעך אחריך אתן את־הארץ"
tokens=verse.split()
lexical=verse.replace("־"," ").split()
opening=tokens[0].replace("־","")
ending=tokens[-1].replace("־","")
assert len(tokens)==11 and len(lexical)==13
assert len("".join(lexical))==53
assert len(opening)==7 and len(ending)==6
assert (v(opening,ordinal),v(ending,ordinal))==(73,67)
assert (v(opening,regular),v(ending,regular))==(703,697)
assert 7*73+6*67==913==v("בראשית",regular)
assert v("וליצחק",ordinal)==v(opening,ordinal)==73
assert v("וליצחק",small)==v(opening,small)==28
assert v("וליצחק",regular)==244
assert v(verse,regular)==4862==11*26*17==13*22*17
assert v(verse,small)==191
assert 191==[n for n in range(2,192) if all(n%d for d in range(2,isqrt(n)+1))][42]
assert sum(len(t.replace("־",""))*v(t,small) for t in tokens)==1044
assert sum(len(t)*v(t,small) for t in lexical)==895
verse_counts=[31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31]
assert len(verse_counts)==34 and sum(verse_counts)==1012
assert sum(verse_counts)+12==1024
print("PASS: Genesis 35:12 = Torah verse #1024")
print("PASS: first and last maqaf phrases: 7×73+6×67=913")
print("PASS: regular 4862 = 11×26×17 = 13×22×17")
print("PASS: small 191 = 43rd prime")
print("PASS: 13 lexical words, 11 maqaf units, 53 letters")
