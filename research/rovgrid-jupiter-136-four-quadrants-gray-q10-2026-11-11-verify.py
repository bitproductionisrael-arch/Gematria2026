#!/usr/bin/env python3
"""RovGrid: reproduce Jupiter's four 34-cell corners, 888/1024, Q10 Gray map.
Pure Python standard library; does not alter the calculator or site.
"""
from collections import Counter

ABC = "אבגדהוזחטיכלמנסעפצקרשת"
VALUES = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
REG = dict(zip(ABC, VALUES))
ORD = dict(zip(ABC, range(1,23)))
ATAB = {ch:ABC[21-i] for i,ch in enumerate(ABC)}

def gem(s, table=REG):
    return sum(table[ch] for ch in s.replace(" ",""))

def atbash(s, table=REG):
    return sum(table[ATAB[ch]] for ch in s.replace(" ",""))

def small(s):
    return sum(int(str(REG[ch]).replace("0", "")) for ch in s.replace(" ",""))

J = (
    (4,14,15,1),
    (9,7,6,12),
    (5,11,10,8),
    (16,2,3,13),
)
assert sorted(sum((list(r) for r in J), [])) == list(range(1,17))
assert all(sum(r)==34 for r in J)
assert all(sum(J[i][j] for i in range(4))==34 for j in range(4))
assert sum(J[i][i] for i in range(4))==34
assert sum(J[i][3-i] for i in range(4))==34
assert sum(map(sum,J))==136

def jupiter_cut(matrix):
    """Return exactly four sets of cut cells: TL, TR, BR, BL."""
    cuts = []
    for quadrant, row in enumerate(matrix):
        region = set()
        for j, length in enumerate(row):
            assert 1 <= length <= 16
            y = j if quadrant in (0,1) else 31-j
            xs = range(length) if quadrant in (0,3) else range(32-length,32)
            for x in xs:
                region.add((x,y))
        assert len(region) == 34
        cuts.append(region)
    assert not any(cuts[i]&cuts[j] for i in range(4) for j in range(i+1,4))
    return cuts

cut = jupiter_cut(J)
cut_columns = jupiter_cut(tuple(zip(*J)))
assert len(set.union(*cut)) == len(set.union(*cut_columns)) == 136
assert 32*32 - len(set.union(*cut)) == 888
assert [256-len(c) for c in cut] == [222]*4
assert [256-len(c) for c in cut_columns] == [222]*4
assert 222 == 4*10+4*13+10*13
assert 4*222 == 8*20+8*26+20*26 == 888
assert 16**2 - 34 == 222
assert 0x100 - 0x22 == 0xDE
assert 4*0xDE == 0x378 == 888
assert 0x400 - 0x88 == 0x378

def gray(x): return x ^ (x>>1)
def point(x,y): return (gray(x)<<5)|gray(y)

vertices = {point(x,y) for x in range(32) for y in range(32)}
assert vertices == set(range(1024))
# Every grid-neighbor edge is an actual one-bit edge of the hypercube.
for x in range(31):
    for y in range(32):
        assert (point(x,y)^point(x+1,y)).bit_count() == 1
for x in range(32):
    for y in range(31):
        assert (point(x,y)^point(x,y+1)).bit_count() == 1
# 4 quadrants have the 4 distinct high-bit combinations and 256 vertices each.
for qi,(xlo,xhi,ylo,yhi) in enumerate((
    (0,16,0,16),(16,32,0,16),(16,32,16,32),(0,16,16,32)
)):
    group={point(x,y) for x in range(xlo,xhi) for y in range(ylo,yhi)}
    assert len(group)==256
    assert len({((v>>9)&1,(v>>4)&1) for v in group})==1
    assert sum((x,y) in cut[qi] for x in range(xlo,xhi) for y in range(ylo,yhi))==34

assert gem("יהפיאל") == gem("הסמאל") == 136
assert len("יהפיאל")==6 and len("הסמאל")==5
assert gem("רוב")==208 and gem("עמית")==520 and gem("מייק")==160
assert 6*136+208==1024 and 5*136+208==888
assert 136==8*17 and 208==8*26 and 5*17+26==111 and 6*17+26==128
assert 8*111==888 and 8*128==1024
assert gem("צדקיאל")==235
assert (gem("יהפיאל")+gem("הסמאל")-gem("צדקיאל"))==37
assert (gem("יהפיאל",ORD)+gem("הסמאל",ORD)-gem("צדקיאל",ORD))==37
assert all(small(s)==19 for s in ("יהפיאל","הסמאל","צדקיאל"))
assert atbash("יהפיאל",ORD)==83 and atbash("הסמאל",ORD)==69
assert atbash("יהפיאל",ORD)+atbash("הסמאל",ORD)==152==136+16==160-8==8*19
assert atbash("יהפיאל",ORD)-gem("יהפיאל",ORD)==28==gem("רוב",ORD)
assert (atbash("יהפיאל",ORD)+atbash("הסמאל",ORD)-atbash("צדקיאל",ORD))==78==3*26
assert (atbash("יהפיאל")+atbash("הסמאל")-atbash("צדקיאל"))==555==5*111
assert gem("צדקיאל",ORD)==gem("ישראל",ORD)==64
assert atbash("צדקיאל",ORD)==gem("אני אחד")==74

# A power of 2 is hit iff k=10(mod8) for all k>=9 and integral positive n.
assert all(pow(2,k-3,17)==9 for k in (10,18,26,34))
assert all(pow(2,e,17)!=9 for e in range(8) if e != 7)
for k in range(9,42):
    hit = ((1<<k)-208) % 136 == 0 and ((1<<k)-208)//136 > 0
    assert hit == ((k-10)%8==0)
assert ((1<<10)-208)//136==6
assert ((1<<18)-208)//136==1926

print("PASS: four Jupiter-matrix corner cuts 34 each; 4x222=888; Q10 Gray one-bit adjacency; 5/6 names; 16-base, Atbash and power-of-two minimality.")
