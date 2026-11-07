#!/usr/bin/env python3
"""Exact checks of the RovGrid torus group and 888 sandpile invariants.
No third-party dependencies; exhaustively checks all 270400 torus states.
"""
from math import gcd, lcm

DIMS=(8,20,26,65)
assert 8*20*26*65 == 520*520 == 270400
assert gcd(8,65)==1
assert gcd(20,26)==2 and lcm(20,26)==260

def encode(x,y,z,w):
    A = (w+65*((x-w)%8))%520
    bit = (y-z)%2
    h = (z+13*bit-y)//2
    B = (y+20*((4*h)%13))%260
    return (A,B,bit)

def decode(A,B,bit):
    return (A%8,B%20,(B-13*bit)%26,A%65)

def add4(p,q):
    return tuple((u+v)%n for u,v,n in zip(p,q,DIMS))

def add3(p,q):
    return ((p[0]+q[0])%520,(p[1]+q[1])%260,(p[2]+q[2])%2)

seen=set()
for x in range(8):
    for y in range(20):
        for z in range(26):
            for w in range(65):
                p=(x,y,z,w); encoded=encode(*p)
                assert decode(*encoded)==p
                seen.add(encoded)
assert len(seen)==270400
sample=[(0,0,0,0),(7,19,25,64),(1,2,3,4),(4,10,13,32),(5,17,20,61)]
for p in sample:
    for q in sample:
        assert encode(*add4(p,q)) == add3(encode(*p),encode(*q))

L=((28,-8),(-8,34))
det=L[0][0]*L[1][1]-L[0][1]*L[1][0]
g=gcd(*(abs(z) for row in L for z in row))
assert (det,g,det//g)==(888,2,444)
assert 28*34-8*8 == 888
assert 14*17-4*4 == 222 and gcd(14,4,17)==1
def lab(u,v):
    return ((u+170*v)%444, v%2)
def inv37(u,v):
    return (u+22*v)%37
for u in range(-10,11):
    for v in range(-10,11):
        assert lab(u,v)==lab(u+28,v-8)
        assert lab(u,v)==lab(u-8,v+34)
        assert inv37(u,v)==inv37(u+28,v-8)==inv37(u-8,v+34)
        assert inv37(u,v)==lab(u,v)[0]%37
all_classes={lab(a-170*b,b) for a in range(444) for b in (0,1)}
assert len(all_classes)==888
assert lab(1,0)==(1,0)
assert lab(-170,1)==(0,1)
assert lab(-340,2)==(0,0)
assert 28-8*22 == -4*37 and -8+34*22 == 20*37
print("PASS: 270400 exhaustive 4D torus encoding; Z520 x Z260 x Z2")
print("PASS: sandpile Smith = (2,444), 888 state codes, conservation modulo 37")
