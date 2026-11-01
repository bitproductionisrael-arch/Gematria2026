#!/usr/bin/env python3
# Nov 2, 2026: exact finite arithmetic, no third-party dependencies.
from collections import Counter
from itertools import permutations, combinations, product
from functools import reduce
from math import gcd

V=(1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400)
idx={v:i+1 for i,v in enumerate(V)}
N=[[70,40,10,400],[40,10,10,100],[200,6,2,0]]
O=[[idx.get(v,0) for v in row] for row in N]
def swap(v):
    if v==0: return 0
    p=idx[v]
    return p-1 if p%2==0 else p+1
U=[[swap(v) for v in row] for row in N]
def forward(v):
    return V[idx[v]%22] if v else 0
Sh=[[forward(v) for v in row] for row in N]
def det2(a):return a[0][0]*a[1][1]-a[0][1]*a[1][0]
def det3(a):
    (a,b,c),(d,e,f),(g,h,i)=a
    return a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g)
def minors(A):
    return [det3([[row[j] for j in range(4) if j!=omit] for row in A]) for omit in range(4)]
def smith_invariants(A):
    g1=reduce(gcd,(abs(v) for row in A for v in row))
    g2=reduce(gcd,(abs(det2([[A[r][c] for c in cs] for r in rs]))
                    for rs in combinations(range(3),2) for cs in combinations(range(4),2)))
    g3=reduce(gcd,(abs(v) for v in minors(A)))
    return (g1,g2//g1,g3//g2)
assert U==[[15,14,9,21],[14,9,9,20],[19,5,1,0]]
assert minors(U)==[-136,-177,1699,749]
assert smith_invariants(N)==(2,10,60)
assert smith_invariants(O)==(1,1,6)
assert smith_invariants(U)==(1,1,1)
assert smith_invariants(Sh)==(1,1,10)

co=(136,-177,-1699,749)
k=co
assert all(sum(row[j]*k[j] for j in range(4))==0 for row in U)
def full_det(r):return sum(r[j]*co[j] for j in range(4))
assert full_det((3,2,4,9))==-1
assert full_det((10,2,5,10))==1
assert 82*136-63*177==1
def candidates(K,signs):
    out=[]
    for a,b,c in product(range(K+1), repeat=3):
        for t in signs:
            w=t-136*a+177*b+1699*c
            if w%749==0 and 0<=w//749<=K:
                out.append((t,(a,b,c,w//749)))
    return out
assert candidates(8,(-1,1))==[]
assert candidates(9,(-1,1))==[(-1,(3,2,4,9))]
assert candidates(9,(1,))==[]
assert candidates(10,(1,))==[(1,(10,2,5,10))]

inverse=((100,-173,-23,136),(-130,225,30,-177),(-1250,2162,288,-1699),(551,-953,-127,749))
B=U+[[10,2,5,10]]
assert all(sum(B[i][j]*inverse[j][k] for j in range(4))==int(i==k)
           for i in range(4) for k in range(4))

groups=[((10,40,70,400),(10,10,40,100),(2,6,200)),
        ((10,10,100,400),(10,40,40,70),(2,6,200))]
stats=Counter()
for group in groups:
    for a in set(permutations(group[0])):
        for b in set(permutations(group[1])):
            for c in set(permutations(group[2]+(0,))):
                rows=(a,b,c)
                us=[[swap(v) for v in row] for row in rows]
                ms=minors(us)
                detkey=lambda r: sum((-1)**(j+1)*ms[j]*r[j] for j in range(4))
                stats['all']+=1
                stats['index1']+=(reduce(gcd,(abs(v) for v in ms))==1)
                stats['keyplus_det1']+=(detkey((10,2,5,10))==1)
                stats['keyplus_detminus1']+=(detkey((10,2,5,10))==-1)
                stats['keyminus_detminus1']+=(detkey((3,2,4,9))==-1)
                if detkey((10,2,5,10))==1:
                    assert rows==tuple(map(tuple,N))
assert dict(stats)=={'all':10368,'index1':5544,'keyplus_det1':1,
                    'keyplus_detminus1':1,'keyminus_detminus1':2},stats
print('Smith invariants: N=(2,10,60), O=(1,1,6), U=(1,1,1), Shift=(1,1,10)')
print('minors (omitted 1..4):',minors(U))
print('det([U;(3,2,4,9)])=-1 and det([U;(10,2,5,10)])=1')
print('integer inverse verified')
print('exhaustive counts:', dict(stats))
print('ALL TESTS PASSED')
