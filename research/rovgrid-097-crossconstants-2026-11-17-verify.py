#!/usr/bin/env python3
"""Exact 097 digit-position audit for √2, √3, √5, φ, e, √888. Python standard library only."""
from math import isqrt
from decimal import Decimal, localcontext
from collections import Counter
import sys
sys.set_int_max_str_digits(0)
N=10000
Q=10**N
sqrt2=str(isqrt(2*Q*Q))[1:]
sqrt3=str(isqrt(3*Q*Q))[1:]
sqrt5=str(isqrt(5*Q*Q))[1:]
sqrt888=str(isqrt(888*Q*Q))[2:]
phi=str((Q+isqrt(5*Q*Q))//2)[1:]
with localcontext() as ctx:
    ctx.prec=N+100
    e=str(Decimal(1).exp()).split('.')[1][:N]
assert all(len(s)==N for s in (sqrt2,sqrt3,sqrt5,sqrt888,phi,e))

def positions(s,p):
    out=[]; start=0
    while True:
        ix=s.find(p,start)
        if ix<0:return out
        out.append(ix+1)
        start=ix+1

assert positions(sqrt2,"097")==[3011,3933,5995,6198,6206,6224,9547]
assert positions(sqrt3,"097")==[888,4102,4557,5537,5922,6749,9409]
assert positions(sqrt5,"097")==[241,1580,1844,4853,7678,8635]
assert e[887:902]=="369088870701676"
assert sqrt3[887:890]=="097"
assert sqrt888[899:902]=="913"
assert e[887:890]=="369" and e[891:894]=="888" and e[899:902]=="676"
assert (6206-6198,6224-6206,6224-6198)==(8,18,26)
assert sqrt2[6205:6208]=="097"  # ends at decimal place 6208
assert positions(phi,"097")==[564,1300,2196,2230,3078,4205,4306,6926,8774]
assert positions(e,"097")==[1199,2083,2186,2675,3062,4512,6083,6731,7612,8269,8708]
assert all(phi[i-1:i+2]=="548" for i in positions(sqrt5,"097"))
x=positions(phi,"048")+positions(phi,"548")
conversion=Counter((phi[i-1:i+2],sqrt5[i-1:i+2]) for i in x)
assert conversion=={("048","096"):8,("548","096"):5,("548","097"):6}
assert Counter(sqrt5[i-1:i+2] for i in positions(phi,"097"))=={"194":3,"195":6}
for i in positions(sqrt5,"097"):
    a=int(phi[i-1:i+2]);b=int(sqrt5[i-1:i+2])
    assert (2*a+1)%1000==b
print("PASS: √2, √3, √5 all 20 positions; e/√3/√888 shared index 888/900")
print("PASS: phi/sqrt5 six exact 548→097 co-locations and full 096/097 partition")
print("position 888: sqrt3=",sqrt3[887:890]," e=",e[887:890])
print("position 892: e=",e[891:894])
print("position 900: e=",e[899:902]," sqrt888=",sqrt888[899:902])
print("phi 048/548 to sqrt5 mapping:",dict(conversion))
