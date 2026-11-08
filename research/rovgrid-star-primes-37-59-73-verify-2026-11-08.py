#!/usr/bin/env python3
"""Verify Pick's theorem and star-number square within row-major 4x6 prime matrix."""
from math import gcd
P=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89]
def xy(p):
    k=P.index(p)
    return 1+k%6,1+k//6
def det(a,b,c):
    return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
A=xy(37);B=xy(73);C=xy(89);M=xy(59)
assert (A,B,C,M)==((6,2),(3,4),(6,4),(5,3))
assert abs(det(A,B,C))==6
boundary=sum(gcd(abs(x[0]-y[0]),abs(x[1]-y[1])) for x,y in [(A,B),(B,C),(C,A)])
interior=3-boundary/2+1
assert (boundary,interior)==(6,1)
sign=1 if det(A,B,C)>0 else -1
points=[]
for p in P:
    D=xy(p)
    if all(sign*det(u,v,D)>0 for u,v in [(A,B),(B,C),(C,A)]):
        points.append(p)
assert points==[59]
assert [abs(det(M,B,C))/2,abs(det(A,M,C))/2,abs(det(A,B,M))/2]==[1.5,1.,.5]
assert 37+59+73==13**2==169
assert (2**2+3**2)==13
assert 6*17==3*12+2*21+24
assert [(n,6*n*(n-1)+1) for n in [2,3,4]]==[(2,13),(3,37),(4,73)]
print("PASS: single interior point is prime #17=59; triangle area=3, hypotenuse squared=13, prime sum=13².")
