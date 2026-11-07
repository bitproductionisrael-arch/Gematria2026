#!/usr/bin/env python3
"""RovGrid lattice atlas: exact, standard-library checks (2026-11-07)."""
from collections import Counter
from itertools import combinations
from math import comb, lcm, prod
from fractions import Fraction

a,b,c=8,20,26
D=(a,b,c)
S=[1,sum(D), sum(i*j for i,j in combinations(D,2)),prod(D)]
assert S == [1,54,888,4160]
counts=Counter((x>0)+(y>0)+(z>0)
               for x in range(a+1) for y in range(b+1) for z in range(c+1))
assert [counts[k] for k in range(4)] == S
assert sum(counts.values())==5103
assert lcm(160,208,520)==2080
assert lcm(888,2080,4160)==461760

# Explicit labeled basis/support-plane bijection
trees=set()
for k, (d1,d2) in enumerate(((a,b),(a,c),(b,c))):
    for i in range(1,d1+1):
        for j in range(1,d2+1):
            trees.add((k,i,j))
points={(i,j,0) for i in range(1,a+1) for j in range(1,b+1)}
points|={(i,0,j) for i in range(1,a+1) for j in range(1,c+1)}
points|={(0,i,j) for i in range(1,b+1) for j in range(1,c+1)}
map_tree=lambda t: ((t[1],t[2],0),(t[1],0,t[2]),(0,t[1],t[2]))[t[0]]
assert len(trees)==len(points)==888 and {map_tree(t) for t in trees}==points

# f-vector via cubical complex cell count
def f_vector(dims):
    n=len(dims)
    return [
        sum(prod(dims[i] if i in I else dims[i]+1 for i in range(n))
            for I in combinations(range(n),k))
        for k in range(n+1)
    ]
assert f_vector(D)==[5103,14310,13368,4160]
assert f_vector((8,20,26,65))==[336798,1276155,1812438,1143480,270400]
assert sum((-1)**i*v for i,v in enumerate(f_vector(D)))==1
assert sum((-1)**i*v for i,v in enumerate(f_vector((8,20,26,65))))==1
Fb=2*S[2]
Eb=2*Fb
Vb=Fb+2
assert (Vb,Eb,Fb)==(1778,3552,1776)
assert Vb-Eb+Fb==2
assert 5103 - (a-1)*(b-1)*(c-1)==Vb

# D4 folding
orbits={}
for i in range(32):
    for j in range(32):
        u=min(i,31-i);v=min(j,31-j)
        key=tuple(sorted((u,v)))
        orbits[key]=orbits.get(key,0)+1
assert len(orbits)==136
assert Counter(orbits.values())=={8:120,4:16}
assert sum(v-1 for v in orbits.values())==888

# Electrical graph, three parallel bundles
tau=a*b+a*c+b*c
assert tau==888
rlist=[Fraction(b+c,tau),Fraction(a+c,tau),Fraction(a+b,tau)]
assert rlist==[Fraction(46,888),Fraction(34,888),Fraction(28,888)]
assert sum(rlist)==Fraction(9,74)
assert sum(D)-3+1==52
assert 54**2-3*tau == 36*7

# Complete directed graph without loops
assert comb(65,2)==2080
assert 65*(65-1)==4160

# 4D support polynomial and flattening
D4=(8,20,26,65)
q4=[sum(prod(D4[i] for i in I) for I in combinations(range(4),k)) for k in range(5)]
assert q4==[1,119,4398,61880,270400]
assert sum(q4)==336798
assert 8*65==20*26==520
assert 8*20*26*65 == 520**2
A={(65*(x-1)+w) for x in range(1,9) for w in range(1,66)}
B={(26*(y-1)+z) for y in range(1,21) for z in range(1,27)}
assert A==B==set(range(1,521))
assert 4160-3*4160+3*4160-4160==0

print("All lattice atlas checks passed.")
