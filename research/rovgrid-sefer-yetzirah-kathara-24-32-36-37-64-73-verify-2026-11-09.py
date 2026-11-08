#!/usr/bin/env python3
"""RovGrid / Sefer Yetzirah / Kathara: verify exact counting model.

This proves cardinalities and star-number ring increments, not historical,
physical or spiritual equivalence between religious traditions.
"""
from itertools import product

def centered_star(n:int)->int:
    return 6*n*(n-1)+1

def test():
    assert 10+3+7+12==32
    assert 12+(10+3+7)==32
    assert 2*12==24 and 2*20==40 and 24+40==64
    assert 32+4+1==37
    assert 2*37-1==73==2*(32+4)+1
    assert 32*2==64 and 4*2==8 and 64+8+1==73
    assert [centered_star(n) for n in (1,2,3,4)]==[1,13,37,73]
    assert [centered_star(n)-centered_star(n-1) for n in (2,3,4)]==[12,24,36]
    assert 1+12+24==37 and 37+36==73
    assert 37+3**3==64 and 64+3**2==73
    assert 3**3+3**2==36==32+4
    assert 37*73==2701
    # The exact bijection: 32 indexed items times 2 layers -> 64 bit patterns
    pairs=[(b,i) for b in (0,1) for i in range(32)]
    codes=[32*b+i for b,i in pairs]
    assert sorted(codes)==list(range(64))
    assert len({f"{x:06b}" for x in codes})==64
    # Cube edge realization for 12 diagonal boundaries: 8 vertices, 12 edges, 24 oriented edges
    vertices=list(product((0,1), repeat=3))
    edges=[(u,v) for i,u in enumerate(vertices) for v in vertices[i+1:]
           if sum(a!=b for a,b in zip(u,v))==1]
    assert len(vertices)==8 and len(edges)==12 and 2*len(edges)==24
    # Explicit negative controls: if one or both added hypotheses removed, 73 vanishes.
    assert 2*32+1==65 # no 4 external markers per side
    assert 2*(32+4+1)==74 # two centers not identified
    print("PASS: 24,32,36,37,64,73; 6-bit mapping; 12-cube edges; star shells 12/24/36; controls")

if __name__=="__main__":
    test()
