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


# Agrippa's reproduced 8x8 Mercury magic square, verified centrally complementary.
mercury_square = [
 [8,58,59,5,4,62,63,1],
 [49,15,14,52,53,11,10,56],
 [41,23,22,44,45,19,18,48],
 [32,34,35,29,28,38,39,25],
 [40,26,27,37,36,30,31,33],
 [17,47,46,20,21,43,42,24],
 [9,55,54,12,13,51,50,16],
 [64,2,3,61,60,6,7,57],
]
assert sorted(v for row in mercury_square for v in row)==list(range(1,65))
assert all(sum(row)==260 for row in mercury_square)
assert all(sum(mercury_square[r][c] for r in range(8))==260 for c in range(8))
assert sum(mercury_square[i][i] for i in range(8))==260
assert sum(mercury_square[i][7-i] for i in range(8))==260
assert all(mercury_square[i][j]+mercury_square[7-i][7-j]==65 for i in range(8) for j in range(8))
assert all(sum(mercury_square[i])+sum(mercury_square[7-i])==520 for i in range(4))
assert 4*520==2080==sum(map(sum,mercury_square))
assert 2*260==520==20*26==8*65
assert 2*2080==4160==8*20*26==8*520==20*208==26*160==64*65
assert 55==8**2-3**2 and 65==8**2+1 and 65-55==10
assert 8*(55+10)==520
print('PASS: 8x8 Mercury complementary 180-degree symmetry, doubling, 55-to-65 bridge.')


# Two 64-paths: Hebrew Adonai and Tzur -> Greek Iesous Christos.
assert 4*65==260 and 8*65==520 and 16*65==1040
assert 32*65==2080 and 64*65==4160==8*20*26
assert 90+6+200==296==8*37
assert 8*296==64*37==2368
assert 3*296==888 and 5*296==1480 and 8*296==2368
assert 888+1480==2368
assert (888//37,1480//37,2368//37)==(24,40,64)
assert (888//296,1480//296,2368//296)==(3,5,8)
assert 296==4*74 and 888==12*74 and 1480==20*74 and 2368==32*74
assert 8*520==4160 and 8*296==2368
assert 520-296==224==8*28 and 4160-2368==1792==64*28
assert 65-37==28
# Direct Greek isopsephy:
greek={'Ι':10,'Η':8,'Σ':200,'Ο':70,'Υ':400,'Χ':600,'Ρ':100,'Τ':300,'Ω':800}
iso=lambda word:sum(greek[c] for c in word)
assert iso('ΙΗΣΟΥΣ')==888
assert iso('ΧΡΙΣΤΟΣ')==1480
assert iso('ΙΗΣΟΥΣ')+iso('ΧΡΙΣΤΟΣ')==2368
print('PASS: 64×65 vs 64×37; Greek names 888/1480/2368; 296 ratio 3:5:8.')
