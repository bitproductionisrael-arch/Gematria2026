#!/usr/bin/env python3
"""Reproduce exact arithmetic and two explicit graph reconstructions from
RovGrid Kathara 49-page scanned 324044.pdf.

No OCR and no inference of physics. Requires networkx >= 2.8 and Python >= 3.9.
"""
from fractions import Fraction
from math import gcd

def totient(n):
    return sum(gcd(k,n) == 1 for k in range(1,n+1))

def source_arithmetic():
    assert 4*6 == 24 and 4*5 == 20
    assert 4*(6+5) == 44
    assert 37-32 == 5 and 32-26 == 6 and 37-26 == 11
    assert 6*37 + 5*26 == 11*32 == 352
    assert 24*37 == 888 and 20*26 == 520
    assert 24*37+20*26 == 44*32 == 11*128 == 1408
    assert 24*(37-32) == 20*(32-26) == 120
    assert 15*16//2 == 120
    assert (6*5 + 6*5 + 5*4//2) == 70  # example only, not used as evidence
    assert 6*5+6*5//2+5*4//2 == 55 # C(6,2)+6*5+C(5,2) = 15+30+10
    angles=(Fraction(45),Fraction(100,3),Fraction(35,3))
    assert sum(angles)==90
    assert tuple(int(x*Fraction(3,5)) for x in angles)==(27,20,7)
    assert 27+20+7==54
    assert (8+20+26)==54 and 4+10+13==27
    assert 12*12*2 == 288 == totient(888)
    assert 288+12 == 300
    assert 7+1+7 == 15
    ks=[Fraction(1),Fraction(3,2),Fraction(2),Fraction(3),Fraction(4)]
    for n,expected in {1:["1","3/2","2","3","4"],5:["5","15/2","10","15","20"],
                       6:["6","9","12","18","24"],8:["8","12","16","24","32"],
                       11:["11","33/2","22","33","44"],12:["12","18","24","36","48"]}.items():
        assert [str(k*n) for k in ks]==expected
    assert all(Fraction(26,k).denominator>1 or Fraction(26,k)>12 for k in ks)
    print("PASS | 4×(6+5), weighted-32 identity, angles, totient, scaling, negative check")

def kathara_graph(include_6_7):
    import networkx as nx
    g=nx.Graph()
    for seq in [(12,11,8,5,2,1),(9,6,3),(10,7,4)]:
        nx.add_path(g,seq)
    g.add_edges_from([(9,10),(3,4)])
    g.add_edges_from([
        (12,9),(12,10),(11,9),(11,10),(9,8),(10,8),
        (8,6),(8,7),(6,5),(7,5),(5,3),(5,4),
        (3,2),(4,2),(3,1),(4,1)
    ])
    if include_6_7:
        g.add_edge(6,7)
    return g

def graph_checks():
    import networkx as nx
    for complete,E,triangles,k4,cycles in ((False,27,20,4,16),(True,28,22,5,17)):
        g=kathara_graph(complete)
        cs=[c for c in nx.enumerate_all_cliques(g) if len(c)==3]
        fours=[c for c in nx.enumerate_all_cliques(g) if len(c)==4]
        auto=len(list(nx.algorithms.isomorphism.GraphMatcher(g,g).isomorphisms_iter()))
        assert len(g)==12 and len(g.edges)==E
        assert nx.is_connected(g)
        assert sum(dict(g.degree()).values())==2*E
        assert len(nx.cycle_basis(g))==cycles==E-12+1
        assert len(cs)==triangles
        assert len(fours)==k4
        assert auto==4
        assert nx.check_planarity(g)[0]
        top={9,10,11,12,8}; bottom={1,2,3,4,5}
        tri_partition=(sum(set(c)<=top for c in cs),
                       sum(not(set(c)<=top or set(c)<=bottom) for c in cs),
                       sum(set(c)<=bottom for c in cs))
        assert tri_partition == ((7,8,7) if complete else (7,6,7))
        assert g.subgraph(top).number_of_edges()==9
        assert g.subgraph(bottom).number_of_edges()==9
        if complete:
            assert any(set(c)=={5,6,7,8} for c in fours)
            assert 5*4 == 20 # triangle incidences within five K4, not unique triangles
        print(f"PASS | page {8 if complete else 47} graph: V=12 E={E} triangles={triangles} K4={k4} beta1={cycles} automorphisms={auto} partition={tri_partition}")

if __name__=="__main__":
    source_arithmetic()
    graph_checks()
