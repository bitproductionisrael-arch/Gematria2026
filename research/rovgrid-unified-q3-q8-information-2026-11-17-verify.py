#!/usr/bin/env python3
"""RovGrid unified model. No external packages. Python 3.8+.
Verify the two independent cube-derived 888 constructions,
Q3, Q8, Hamming/tetrahedron parity, 4-valued metadata and ABC.
"""
from itertools import product, combinations, combinations_with_replacement
from collections import Counter
from math import comb
# --- The three binary differentiations (Q3) ---
cube3 = list(product((0,1), repeat=3))
assert len(cube3)==2**3==8
ham=lambda a,b: sum(x!=y for x,y in zip(a,b))
pairs3=list(combinations(cube3,2))
assert len(pairs3)==28
dist=Counter(ham(a,b) for a,b in pairs3)
assert dist == {1:12,2:12,3:4},dist
edges3=[(a,b) for a,b in pairs3 if ham(a,b)==1]
assert len(edges3)==12
directed3=[(a,b) for a in cube3 for b in cube3 if ham(a,b)==1]
assert len(directed3)==24
assert len(directed3)==2*len(edges3)

# Parity splits 8 vertices into complementary regular tetrahedra.
parity={r:[v for v in cube3 if sum(v)%2==r] for r in (0,1)}
assert [len(parity[r]) for r in (0,1)] == [4,4]
assert all(ham(a,b)==2 for verts in parity.values() for a,b in combinations(verts,2))
assert sum(comb(len(p),2) for p in parity.values())==12
assert len([p for p in pairs3 if ham(*p)==3])==4

# Half-cube primitive, accumulated faces and two equal 888 routes.
V,E,F=8,12,6
primitive=(V//2,V//2+E//2,V//2+E//2+F//2)
assert primitive==(4,10,13)
box=tuple(2*x for x in primitive)
assert box==(8,20,26)
face_area_products=(box[0]*box[1],box[0]*box[2],box[1]*box[2])
assert face_area_products==(160,208,520)
assert sum(face_area_products)==888
assert sum(box)==54
assert box[0]*box[1]*box[2]==4160

# Each binary question has four possible SUBSETS of permitted values:
# {},{0},{1},{0,1}. We use constraint semantics:
# empty means impossible; full means unresolved.
info_sets=(frozenset(),frozenset((0,)),frozenset((1,)),frozenset((0,1)))
status=list(product(info_sets,repeat=3))
assert len(status)==4**3==64
consistent=[s for s in status if all(len(axis)>0 for axis in s)]
inconsistent=[s for s in status if any(len(axis)==0 for axis in s)]
assert len(consistent)==3**3==27
assert len(inconsistent)==4**3-3**3==37
partial_counts=Counter(sum(len(x)==2 for x in s) for s in consistent)
assert partial_counts=={0:8,1:12,2:6,3:1}, partial_counts
assert (V,E,F)==(partial_counts[0],partial_counts[1],partial_counts[2])
checks=[(s,e) for s in inconsistent for e in directed3]
assert len(checks)==37*24==888
assert len(set(checks))==888

# --- The eight-dimensional Boolean lattice/cube Q8, not root lattice E8 ---
dim=8
vertices8=range(2**dim)
edges8={(v, v^(1<<axis)) for v in vertices8 for axis in range(dim)
        if (v & (1<<axis))==0}
assert len(edges8)==dim*2**(dim-1)==1024
facets8=[(axis,value) for axis in range(dim) for value in (0,1)]
assert len(facets8)==2*dim==16
facet_pairs=list(combinations_with_replacement(facets8,2))
assert len(facet_pairs)==comb(2*dim+1,2)==136
facet_class=Counter()
for (axis1,side1),(axis2,side2) in facet_pairs:
    if axis1==axis2 and side1==side2:
        facet_class['same']+=1
    elif axis1==axis2:
        facet_class['opposite']+=1
    else:
        facet_class['intersect']+=1
assert facet_class=={'same':16,'opposite':8,'intersect':112}
assert len(edges8)-len(facet_pairs)==888
assert len(edges8)-len(facet_pairs)==dim*(2**(dim-1)-2*dim-1)
assert 888==8*111

# Compare other dimensions, to prevent silently selecting a general law
# that gives 888 in all dimensions.
results={}
for n in range(1,11):
    edges=n*2**(n-1)
    facets=2*n
    unordered=comb(facets+1,2)
    results[n] = (2**n,edges,facets,unordered,edges-unordered)
assert results[3]==(8,12,6,21,-9)
assert results[7]==(128,448,14,105,343)
assert results[8]==(256,1024,16,136,888)
assert results[9]==(512,2304,18,171,2133)

# 16 two-input Boolean functions * 64 metadata statuses =1024.
assert (2**(2**2))*(4**3)==1024
assert 16*len(consistent)==432
assert 16*len(inconsistent)==592
assert 432+592==1024  # distinct 1024-partition from 136+888

# --- ABC's separate modulo-nine eight-step orbit ---
abc_alphabet=(3,6,9)
zero_to_nine=lambda x:x%9 or 9
step=lambda pair:(pair[1],zero_to_nine(pair[0]+pair[1]))
orb=[];s=(3,6)
while s not in orb:
    orb.append(s)
    s=step(s)
assert len(orb)==8 and s==(3,6)
abc_pairs=set(product(abc_alphabet,repeat=2))
assert abc_pairs-set(orb)=={(9,9)}
assert step((9,9))==(9,9)
assert sum(a==b for a,b in abc_pairs)==3
assert sum(a!=b for a,b in abc_pairs)==6

# Its phase may be encoded in ordinary 3bit or Gray3, not intrinsically.
gray=lambda n:n^(n>>1)
codes=[gray(t) for t in range(8)]
assert len(set(codes))==8
bits_changed=lambda a,b:(a^b).bit_count()
assert all(bits_changed(codes[i],codes[(i+1)%8])==1 for i in range(8))
assert all(codes[(i+4)%8]==(codes[i]^0b110) for i in range(8))

# Original ABC triangular operators and standard Genesis anchors.
tri=lambda n:n*(n+1)//2
assert sum((3,6,9))==18
assert sum(tri(n) for n in (3,6,9))==72
assert sum(tri(n-1) for n in (3,6,9))==54
assert 72+54==126==3**2+6**2+9**2
assert 2*18+1==37 and 72//3==24
assert 37*24==888
assert 37*73==2701

print('PASS: Q3 8 vertices,12 edges,6 facets,28 pair classes=12+12+4')
print('PASS: two complementary tetrahedra (parity) on cube vertices')
print('PASS: 64 status triples=27 consistent+37 impossible, 24 directed flips, 37*24=888')
print('PASS: Q8 1024 edges and 16 facets, 136 facet multisets, difference=888')
print('PASS: facet pair types 16 identical,8 opposite,112 intersecting')
print('PASS: ABC 8-cycle+1 fixed, 3/6/9 transition, Gray code, 54/72/888')
print('DIMENSION COUNTS: n (vertices,edges,facets,facetPairs,difference)')
for n,result in results.items(): print(n,*result)
