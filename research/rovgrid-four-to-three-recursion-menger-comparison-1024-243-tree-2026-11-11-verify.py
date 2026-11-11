#!/usr/bin/env python3
"""Four-to-three binary quarter deletion (32x32) vs exact 3D Menger rule.
Verify all generations, tree connectivity and hypercube edge counts.
"""
from itertools import product
from collections import deque

def survivors(level):
    assert 0 <= level <= 5
    return {(x,y) for x,y in product(range(32),repeat=2)
            if all(not (x & (1<<b) and y & (1<<b)) for b in range(4,4-level,-1))}

def plane_edges(S):
    return sum((x+1,y) in S for x,y in S)+sum((x,y+1) in S for x,y in S)

def plane_cross(A,B):
    return sum((x+dx,y+dy) in B for x,y in A
               for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))

def edge_count(V):
    return sum((v^(1<<b)) in V for v in V for b in range(10))//2

for d in range(6):
    S=survivors(d)
    assert len(S) == 3**d * 4**(5-d)
    R=set(product(range(32),repeat=2))-S
    assert len(R)==1024-len(S)
    print("level", d, "remaining",len(S),"removed",len(R),"plane_edges",plane_edges(S))
assert [len(survivors(d-1))-len(survivors(d)) for d in range(1,6)]==[256,192,144,108,81]
assert sum([256,192,144,108,81])==781 and 1024-781==243

# Prove exact planar tree: connected and |E|=|V|-1.
S=survivors(5)
seen={(0,0)}
queue=deque([(0,0)])
while queue:
    x,y=queue.popleft()
    for p in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
        if p in S and p not in seen:
            seen.add(p);queue.append(p)
assert seen == S
assert plane_edges(S) == len(S)-1 == 242
assert [plane_edges(survivors(d)) for d in range(6)]==[1984,1472,1072,752,484,242]

def gray(x): return x^(x>>1)
G={(gray(x)<<5)|gray(y) for x,y in S}
B={(x<<5)|y for x,y in S}
assert len(G)==len(B)==243
assert edge_count(B)==810==5*2*3**4
assert edge_count(G)==422
assert 10*243-2*edge_count(B)==810
assert 10*243-2*edge_count(G)==1586
# Menger 3D: 3^3=27 cells; delete if at least 2 coordinates have midpoint value 1.
M={(x,y,z) for x,y,z in product(range(3),repeat=3) if (x==1)+(y==1)+(z==1)<=1}
assert len(M)==20 and 27-len(M)==7
contacts=sum((x+dx,y+dy,z+dz) in M for x,y,z in M
             for dx,dy,dz in ((1,0,0),(0,1,0),(0,0,1)))
assert contacts==24
assert 20**2==400 and (20*7)==140
print("PASS: 4->3 recursion is 1024,768,576,432,324,243, with final 243/242 connected tree.")
print("PASS: final Q10 induced edges binary=810 and Gray=422; true Menger 27->20, contacts=24.")
