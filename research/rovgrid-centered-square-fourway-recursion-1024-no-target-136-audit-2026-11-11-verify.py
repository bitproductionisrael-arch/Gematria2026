#!/usr/bin/env python3
"""Correct user's algorithm: split into 4 only to find center; remove centered square.
Same scale rule (hole side=parent side/4) on all 4^depth parent squares.
"""
from itertools import product

def box(x,y,s):
    return {(i,j) for i in range(x,x+s) for j in range(y,y+s)}

def hole_round(k):
    side=32//(2**k)
    h=side//4
    if h<1 or (side-h)%2:
        return None
    return [box(i*side+(side-h)//2,j*side+(side-h)//2,h)
            for i,j in product(range(2**k),repeat=2)]

gone=set()
expected=[(0,0,1024),(1,64,960),(2,128,896),(3,188,836)]
observed=[(0,0,1024)]
new_counts=[]
for k in range(3):
    hs=hole_round(k)
    assert len(hs)==4**k
    raw=sum(len(c) for c in hs)
    fresh=sum(len(c-gone) for c in hs)
    union=set.union(gone,*hs)
    assert len(union)-len(gone)==fresh
    new_counts.append((raw,fresh,raw-fresh))
    gone=union
    observed.append((k+1,len(gone),1024-len(gone)))
assert observed==expected,observed
assert new_counts==[(64,64,0),(64,64,0),(64,60,4)],new_counts
assert hole_round(3) is None

# 136 can occur only by stopping mid-round 3 after 2 nonoverlapping 2x2 cuts.
g0=set.union(set(),*hole_round(0),*hole_round(1))
assert len(g0)==128
candidates=hole_round(2)
pairs=[(i,j) for i in range(len(candidates)) for j in range(i+1,len(candidates))
       if len(g0 | candidates[i] | candidates[j])==136]
assert len(pairs)>0
assert len(set.union(g0,*candidates))==188
print("PASS: user method central hole (not quarter deletion): 0/64/128/188 removed; 1024/960/896/836 remain.")
print("PASS: 136 requires an extra stop-after-two-2x2-cuts rule, not a complete third generation.")
