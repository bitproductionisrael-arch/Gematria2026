#!/usr/bin/env python3
"""Five follow-up theorems for RovGrid 8,20,26; standard library only."""
from math import gcd, prod, isqrt, lcm
from itertools import combinations
from fractions import Fraction

seeds = (2,4,5,13)
edges = sorted(x*y for x,y in combinations(seeds,2))
assert edges == [8,10,20,26,52,65]
assert 8*65 == 10*52 == 20*26 == prod(seeds) == 520
assert sum(seeds) == 24 and 24*37 == 888

a,b,c=8,20,26
V=a*b*c
S=a+b+c
rows=((8,520,8,1,65), (20,208,4,5,52), (26,160,2,13,80))
levels=[]
new_sums=[]
for s,F,g,k,d in rows:
    assert g==gcd(s,F) and s*F==V
    assert k==s//g and d==F//g
    assert k*d==V//(g*g)
    for h in range(1,k):
        assert (F*h)%s != 0
    dims=(k*a,k*b,k*c,d)
    P=k*k*F
    q=(1,)+(tuple(sum(prod(t) for t in combinations(dims,i)) for i in (1,2,3,4)))
    assert q[3]==P*q[1] and q[4]==P*P
    def evaluate(x):
        return sum(q[j]*x**j for j in range(5))
    for x in (Fraction(1,2),Fraction(2,3),Fraction(3,1)):
        assert evaluate(x) == P*P*x**4*evaluate(Fraction(1,1)/(P*x))
    levels.append(k*d)
    new_sums.append(k*d*S)
assert levels == [65,260,1040]
assert new_sums == [3510,14040,56160]

def fourth_axes(K):
    if K%65: return None
    return (65*K,52*K//5,80*K//13)
def square(n):
    return isqrt(n)**2 == n
for K in range(1, 65*120):
    d=fourth_axes(K)
    if d is None: continue
    all_square=all(square(z) for z in d)
    assert all_square == square(K//65)
for n in (1,2,3,7):
    K=65*n*n
    assert fourth_axes(K)==((65*n)**2,(26*n)**2,(20*n)**2)

assert 39**2 + 52**2 == 65**2
assert 65**2+52**2 == 80**2+23**2 == 6929
assert (5**2+4**2)*(5**2+12**2) == (5*5-4*12)**2+(5*12+4*5)**2
assert 5*12+4*5 == 80 and abs(5*5-4*12)==23

print("PASS: K4 / three matchings, geometric progression, polynomial inversion symmetry, complete K=65n² family, two square-sum representations.")
