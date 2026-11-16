#!/usr/bin/env python3
"""Verify three binary questions -> cubical event complex, 26+1=27, 8/20/26 -> 888.
No external packages. Run python research/rovgrid-event-cube-when-where-what-2026-11-17-verify.py
"""
from itertools import product,combinations
from collections import Counter
from math import comb

# T = when, L = where, D = thing/application. These are classification axes,
# NOT claims that time is literally a Euclidean spatial axis.
vertices=list(product((0,1),repeat=3))
assert len(vertices)==8

def hamming(a,b):
    return sum(x!=y for x,y in zip(a,b))
edges=[(a,b) for a,b in combinations(vertices,2) if hamming(a,b)==1]
assert len(edges)==12 and all(hamming(a,b)==1 for a,b in edges)
edge_counts=Counter(i for a,b in edges for i in range(3) if a[i]!=b[i])
assert edge_counts=={0:4,1:4,2:4}

faces={}
for axis in range(3):
    for value in (0,1):
        corners=frozenset(v for v in vertices if v[axis]==value)
        faces[(axis,value)]=corners
assert len(faces)==6
assert all(len(corners)==4 for corners in faces.values())
assert all(len({edge for edge in edges if edge[0] in face and edge[1] in face})==4 for face in faces.values())

# Every pattern containing 0,1,* is a subcube. k stars means k free dimensions.
patterns=list(product((0,1,"*"),repeat=3))
assert len(patterns)==27
counts=Counter(p.count("*") for p in patterns)
assert counts=={0:8,1:12,2:6,3:1}
for k in range(4):
    assert counts[k]==comb(3,k)*2**(3-k)
assert counts[0]+counts[1]+counts[2]==26
assert sum(counts.values())==27==3**3
assert 8-12+6==2    # Euler of boundary
assert 8-12+6-1==1  # Euler characteristic of full 3-cell complex

# Cumulative boundary cell counts; defining these quantities is a MODEL CHOICE.
A=counts[0]                    # 8
B=counts[0]+counts[1]          # 20
C=counts[0]+counts[1]+counts[2]# 26
assert (A,B,C)==(8,20,26)
assert (A*B,A*C,B*C)==(160,208,520)
assert A*B+A*C+B*C==888
assert A+B+C==54
assert A*B*C==4160

def flip(v,axis):
    return tuple((1-x) if i==axis else x for i,x in enumerate(v))
for v in vertices:
    assert all(flip(flip(v,i),i)==v for i in range(3))
    for i,j in combinations(range(3),2):
        assert flip(flip(v,i),j)==flip(flip(v,j),i)
assert len({tuple(flip(v,i) for i in range(3)) for v in vertices})==8
opposite=lambda v:tuple(1-x for x in v)
opposite_pairs={frozenset((v,opposite(v))) for v in vertices}
assert len(opposite_pairs)==4
assert all(hamming(*tuple(pair))==3 for pair in opposite_pairs)

# A partial information lattice (0,1,*) is different from modulo-9 addition.
def join(a,b):
    if a==b:return a
    return "*"
assert join(0,1)=="*" and join("*",0)=="*" and join("*",1)=="*"
def add_mod9(a,b):
    n=(a+b)%9
    return n or 9
assert add_mod9(9,3)==3 and add_mod9(9,6)==6

# Count all histories of 3 binary axes through two time steps: 8*8 = 64.
# A present snapshot has only 8 states. An additional event log is necessary
# to distinguish histories unless a deterministic unique-predecessor rule is known.
histories=list(product(vertices,repeat=2))
assert len(histories)==64
assert len({history[1] for history in histories})==8

print("PASS: 8 vertices, 12 edges, 6 faces, 1 cube -> 27 partial patterns")
print("PASS: 26 boundary cells + 1 full cube; cumulative 8/20/26; sum of pair products 888")
print("PASS: 3 reversible commuting bit-flips, 4 antipodal mirror pairs; event-history separation")
