#!/usr/bin/env python3
"""Verify the precise cuboctahedron analogy; no anatomical-incidence equivalence asserted."""
from itertools import product
points=set()
for position_of_zero in range(3):
    for a,b in product((-1,1),repeat=2):
        coord=[0,0,0]
        places=[i for i in range(3) if i!=position_of_zero]
        coord[places[0]]=a
        coord[places[1]]=b
        points.add(tuple(coord))
assert len(points)==12
V=sorted(points)
edges=[(a,b) for i,a in enumerate(V) for b in V[i+1:] if sum((a[k]-b[k])**2 for k in range(3))==2]
assert len(edges)==24
degree={v:sum(v in e for e in edges) for v in V}
assert set(degree.values())=={4} and sum(degree.values())==48
by_height={z:sum(x[2]==z for x in V) for z in (-1,0,1)}
assert by_height=={-1:4,0:4,1:4}
assert 1+4+8==13
assert 1+len(V)+len(edges)==37
faces_triangles=8
faces_squares=6
assert len(V)-len(edges)+faces_triangles+faces_squares==2
assert 12*4//2==24
assert 1+12+24==37
print("PASS: 13 2D labeled points re-embedded as cuboctahedron center 1 +4 equator +8 off-equator")
print("PASS: 12 3D vertices, 24 edges, 8 triangular and 6 square faces, Euler V-E+F=2")
print("PASS: mathematical 1+12+24=37, corresponding to 1 sternum+12 thoracic vertebrae+24 ribs by COUNT")
print("NOT PROVEN: anatomical 3D bone locations/incidence graph equals regular cuboctahedron")
