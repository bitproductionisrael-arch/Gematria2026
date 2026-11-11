#!/usr/bin/env python3
"""Original 32x32 nine-hole mask; quarter sums 34, C4, unique a²+8b²=136 and Gray Q10."""
from itertools import product
from collections import defaultdict
HOLES=((12,12,8),(4,4,3),(14,4,3),(25,4,3),(25,14,3),
       (25,25,3),(15,25,3),(4,25,3),(4,15,3))
cell_owner={}
for idx,(x,y,s) in enumerate(HOLES):
    assert 0<=x and 0<=y and x+s<=32 and y+s<=32
    for xx,yy in product(range(x,x+s),range(y,y+s)):
        assert (xx,yy) not in cell_owner
        cell_owner[(xx,yy)]=idx
assert len(cell_owner)==136==8*8+8*9
assert {(32-y-s,x,s) for x,y,s in HOLES}==set(HOLES)
for qx,qy in product(range(2),repeat=2):
    group={(x,y):i for (x,y),i in cell_owner.items()
          if (x//16,y//16)==(qx,qy)}
    assert len(group)==34
    assert sum(i==0 for i in group.values())==16
    assert sum(i!=0 for i in group.values())==18
    assert 16*16-len(group)==222
assert 136==4*34 and 888==4*222==32**2-136
assert 222==4*10+4*13+10*13
assert 888==8*20+8*26+20*26
solutions=[(a,b) for a,b in product(range(1,33),repeat=2) if a*a+8*b*b==136]
assert solutions==[(8,3)],solutions

def gray(t):return t^(t>>1)
def point(x,y):return (gray(x)<<5)|gray(y)
D={point(x,y) for x,y in cell_owner}
assert len(D)==136
assert {point(x,y) for x,y in product(range(32),repeat=2)}==set(range(1024))
def internal(S):
    return sum((u^(1<<i)) in S for u in S for i in range(10))//2
ie=internal(D)
cross=10*len(D)-2*ie
remain=5120-ie-cross
assert (ie,cross,remain)==(336,688,4096)
assert ie+cross==1024 and remain==2**12
assert 1024-136==888
print("PASS: original holes, C4, 4×(16+18)=136, 4×222=888; unique positive (8,3); Q10 336/688/4096.")
