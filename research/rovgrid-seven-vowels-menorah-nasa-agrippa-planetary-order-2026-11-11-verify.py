#!/usr/bin/env python3
"""Reproducible arithmetic for seven-vowel menorah (Greek isopsephy and planetary Kamea)."""
letters={'Ε':5,'Υ':400,'Α':1,'Ι':10,'Η':8,'Ο':70,'Ω':800}
names={'Ε':'Mercury','Υ':'Jupiter','Α':'Moon','Ι':'Sun','Η':'Venus','Ο':'Mars','Ω':'Saturn'}
orders={'Mercury':8,'Jupiter':4,'Moon':9,'Sun':6,'Venus':7,'Mars':5,'Saturn':3}
seq='ΕΥΑΙΗΟΩ'
total=lambda s:sum(letters[a] for a in s)
assert total('ΕΥΑ')==406
assert total('ΗΟΩ')==878
assert total('ΙΗΟΩ')==888
assert total(seq)==1294
assert total('ΕΥΑΙ')==416
assert letters['Ω']//letters['Ε']==160 and letters['Ω']%letters['Ε']==0
n=[orders[names[c]] for c in seq]
assert n==[8,4,9,6,7,5,3]
assert [v*v*(v*v+1)//2 for v in n]==[2080,136,3321,666,1225,325,45]
assert sum(n[:3])==21 and n[3]==6 and sum(n[4:])==15
assert 21-15==6 and 21+15==36 and sum(n)==42
from itertools import permutations
dist={'Η':0.72,'Ο':1.52,'Ω':9.5}
ascending=[p for p in permutations('ΗΟΩ') if list(map(dist.get,p))==sorted(dist.values())]
assert ascending==[('Η','Ο','Ω')]
assert 2080==4*520==13*160==10*208
print('PASS: Greek isopsephy, Kamea sums, 3+1+3, unique ascending tail.')


# Fixed planetary Kamea orders: Mercury=8, Sun=6, Saturn=3.
mercury,sun,saturn=8,6,3
assert 8**2+3**2==73
assert 8**2-3**2==55
assert 8**2+3**2-6**2==37
assert (37+73)//2==55 and 55-37==73-55==18
assert sun*(sun*sun+1)//2==111==3*37
assert mercury*111==888==mercury*saturn*(mercury**2+saturn**2-sun**2)
assert 888-666==222
from itertools import combinations
other=[3,4,5,7,8,9]
pairs=list(combinations(other,2))
assert len(pairs)==15
match=[(a,b) for a,b in pairs if a*a+b*b==73 and abs(a*a-b*b)==55 and a*a+b*b-sun*sun==37]
assert match==[(3,8)]
print('PASS: 37,55,73,888 solar-Mercury-Saturn identities; unique {3,8} out of 15 pairs.')
