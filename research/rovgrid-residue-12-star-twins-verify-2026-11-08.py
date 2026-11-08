#!/usr/bin/env python3
"""Verify 12-residue twin prime square and location in 4x6 prime atlas."""
from math import isqrt
P=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89]
def isprime(n):
    return n>=2 and all(n%d for d in range(2,isqrt(n)+1))
def position(p):
    i=P.index(p); return (i//6+1,i%6+1)
assert all(isprime(n) for n in (37,59,61,71,73,89))
assert [5*12-1,5*12+1,6*12-1,6*12+1]==[59,61,71,73]
assert 59+73==61+71==11*12==132
assert 37+59+73==37+61+71==13**2==169
assert (3*12+1)+(5*12-1)+(6*12+1)==14*12+1
assert 14*12+1==(12+1)**2
assert [6*n*(n-1)+1 for n in [2,3,4]]==[13,37,73]
assert [(p,position(p)) for p in [37,59,61,71,73,89]]==[
    (37,(2,6)),(59,(3,5)),(61,(3,6)),(71,(4,2)),(73,(4,3)),(89,(4,6))]
solutions=[n for n in range(1,1000) if 14*n+1==(n+1)**2]
assert solutions==[12]
print("PASS: double twin-prime pattern, two 13² sums, unique positive base 12, and six positions.")
