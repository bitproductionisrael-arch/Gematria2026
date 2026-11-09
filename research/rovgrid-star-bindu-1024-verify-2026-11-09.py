"""RovGrid star-bindu 1024 research verification — 2026-11-09.
Only exact integer arithmetic, orbit enumeration and exhaustive finite searches.
"""
from itertools import combinations
from collections import Counter
from math import isqrt

T=lambda n:n*(n+1)//2
S=lambda n:6*n*(n-1)+1

assert S(1)+S(7)+S(8)+S(9)==1024
assert all(S(n)==12*T(n-1)+1 for n in range(1,100))
assert all(S(n)+S(n+1)+S(n+2)+1==18*n*(n+1)+16 for n in range(1,100))
assert [n for n in range(1,100) if S(n)+S(n+1)+S(n+2)+1==1024]==[7]
assert all(S(n)%12==1 for n in range(1,100))
quads=[q for q in combinations(range(1,27),4) if sum(map(S,q))==1024]
assert len(quads)==7 and (1,7,8,9) in quads
assert [(n,n+1) for n in range(1,26) if S(n)^S(n+1)==136]==[(10,11)]
assert [(n,n+1) for n in range(1,26) if S(n)+S(n+1)==1202]==[(10,11)]
assert [(n,n+1) for n in range(1,26) if S(n)+S(n+1)-1==2701]==[(15,16)]
assert S(10)^S(11)==136 and S(10)&S(11)==533
assert S(10)+S(11)==1202==2*533+136
assert S(11)-S(10)==120 and 120+136==256
assert 255-136==119 and 1023-136==887
assert ((1023^136)+1)&1023==888
assert S(21)-S(17)==888
assert S(17)-S(1)==12*136==1632
assert S(21)-S(1)==1024+11*136==2520
assert S(21)-S(17)==(1024+11*136)-(12*136)==888
assert S(15)+S(16)==S(21)+S(6)==2702
assert S(15)+S(16)-S(1)==2701==37*73
assert S(21)+S(6)-S(1)==2701
assert S(21)-1==2520

# Every positive integer star-index pair S(b)-S(a)=888.
pairs=[]
for d in range(1,149):
    if 148%d: continue
    q=148//d
    a2=q-d+1
    if a2>0 and a2%2==0:
        a=a2//2
        b=a+d
        if S(b)-S(a)==888: pairs.append((a,b))
assert sorted(pairs)==[(17,21),(74,75)]
assert S(75)-S(74)==888

# Binary power decomposition and 8-transfer.
assert 2**7+2**8+2**9==896
assert (896-8,128+8,896+128)==(888,136,1024)
assert 32*28+128==1024
assert (32*28-8)+(32*4+8)==1024
assert T(31)+T(32)==1024

# All D4 cell orbits of a 32 by 32 square.
def orb(i,j,N=32):
    return frozenset(((i,j),(j,N-1-i),(N-1-i,N-1-j),(N-1-j,i),
                       (i,N-1-j),(N-1-i,j),(j,i),(N-1-j,N-1-i)))
os={orb(i,j) for i in range(32) for j in range(32)}
assert Counter(map(len,os))=={8:120,4:16}
assert len(os)==136
assert sum(map(len,os))==1024
assert sum(len(o)-1 for o in os)==888

# Fixed second differences, 8-bit saturation and copied-data corrections.
for n in range(2,100):
    assert T(n-1)+T(n)==n*n
    assert T(n-1)+T(n)+T(n+1)==3*T(n)+1
    assert T(n+1)-T(n)+T(n-1)==T(n)+1
    assert S(n-1)+S(n)+S(n+1)==3*S(n)+12
    assert S(n+1)-S(n)+S(n-1)==S(n)+12
assert next(n for n in range(2,25) if S(n)+12>255)==7
assert next(n for n in range(2,25) if T(n)+1>255)==23
tri_sq=[]
star_sq=[]
for n in range(1,25):
    u=T(n)*T(n+1)*T(n+2)
    v=S(n)*S(n+1)*S(n+2)
    if isqrt(u)**2==u: tri_sq.append((n,isqrt(u)))
    if isqrt(v)**2==v: star_sq.append((n,isqrt(v)))
assert tri_sq==[(3,30),(24,5850)]
assert star_sq==[]
assert (S(3)^S(4),S(5)^S(6), (S(8)&255)^(S(9)&255))==(108,204,224)
assert S(24)*S(25)*S(26)==46539370813
print("PASS — star/bindu 1024/136/888/2701, exhaustive window, D4 136 orbits, binary, phase")
print("Four-star quadruples S1..S26:",quads)
print("All global S(b)-S(a)=888 solutions:",sorted(pairs))
