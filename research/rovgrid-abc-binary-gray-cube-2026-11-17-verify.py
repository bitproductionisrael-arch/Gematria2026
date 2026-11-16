#!/usr/bin/env python3
"""Exhaustive 3/6/9 Fibonacci ABC -> 3-bit counter -> Gray cube Hamiltonian cycle.
No external dependencies. Uses mathematical objects only, not physical experimental data.
"""
from itertools import product,combinations
from collections import Counter
from math import comb

ABC=(3,6,9)
z=lambda n:n%9 or 9
F=lambda s:(s[1],z(s[0]+s[1]))
def iterate(s,n):
    for _ in range(n):s=F(s)
    return s
states=set(product(ABC,repeat=2))
assert len(states)==9
assert F((9,9))==(9,9)
active=[]
s=(3,6)
for i in range(8):
    assert s not in active
    active.append(s)
    s=F(s)
assert s==(3,6)
assert states-set(active)=={(9,9)}
assert sum(a==b for a,b in states)==3
assert sum(a!=b for a,b in states)==6
for s in states:
    assert iterate(s,4)==(z(-s[0]),z(-s[1]))
    assert iterate(s,8)==s

# Named phase is a bijection on active states; not an algebraic
# identification of mod9 addition with Boolean addition.
ph={s:i for i,s in enumerate(active)}
assert len(ph)==8
for s in active:
    assert ph[F(s)] == (ph[s]+1)%8
    assert ph[iterate(s,4)] == (ph[s]^0b100)
    assert ph[iterate(s,8)] == ph[s]

# Gray 3-bit labels realize an edge-wise Hamiltonian circuit.
gray=lambda n:n^(n>>1)
codes=[gray(i) for i in range(8)]
assert len(set(codes))==8
distance=lambda a,b:(a^b).bit_count()
assert all(distance(codes[i],codes[(i+1)%8])==1 for i in range(8))
assert all(codes[(i+4)%8]==(codes[i]^0b110) for i in range(8))
vertices=range(8)
edges={frozenset((a,b)) for a,b in combinations(vertices,2) if distance(a,b)==1}
assert len(edges)==12
cycle={frozenset((codes[i],codes[(i+1)%8])) for i in range(8)}
assert len(cycle)==8 and cycle<=edges
unused=edges-cycle
assert len(unused)==4
expected={(0,2),(1,5),(3,7),(4,6)}
assert {tuple(sorted(edge)) for edge in unused}==expected
assert len({v for edge in unused for v in edge})==8 # perfect matching
assert all(len([e for e in unused if v in e])==1 for v in vertices)
# Every node has cube degree 3, cycle degree 2, spare degree 1.
assert all(sum(v in edge for edge in edges)==3 for v in vertices)
assert all(sum(v in edge for edge in cycle)==2 for v in vertices)

# Real 3D space x,y,z is conceptually distinct from
# timestamp and the object's metadata; cube is 3-bit quantization.
for n in range(1,6):
    # Each axis 0,1,*; number of subcubes at each dimension k.
    counts=[comb(n,k)*2**(n-k) for k in range(n+1)]
    assert sum(counts)==3**n
assert [comb(3,k)*2**(3-k) for k in range(4)]==[8,12,6,1]
assert 8+12+6==26
assert 26+1==27==3**3
assert (8*(8+12)+8*(8+12+6)+(8+12)*(8+12+6))==888

# A three-bit modulo-8 counter wraps its low bits, but extended
# counter carries to a higher bit and does not reset global time.
assert [i&7 for i in range(9)]==[0,1,2,3,4,5,6,7,0]
assert 0b0111+1==0b1000
assert (0b0111+1)&7==0
assert ((0b0111+1)>>3)==1
for t in range(100):
    assert (t%8)==((t+8)%8)
    assert (t+8)//8==t//8+1

print("PASS: 9 ABC pairs; active orbit8 + one fixed; 4-step complement, 8-step return")
print("PASS: phase bijection to 3-bit counter; half-phase XOR100")
print("PASS: Gray Hamiltonian cycle8 edges in 3-cube12 edges, unused4-edge perfect matching; half-phase XOR110")
print("PASS: partial-information n-cube count3^n; 8+12+6+1=27; 8/20/26 pair-products=888")
for i,pair in enumerate(active):
    print(i,str(pair),format(i,'03b'),format(codes[i],'03b'))
