#!/usr/bin/env python3
# RovGrid: verify T31=136+3*T15, sums of powers 1..16, gematria, time observation.
from math import isqrt

def T(n):
    return n*(n+1)//2

def gematria(s):
    letters="אבגדהוזחטיכלמנסעפצקרשת"
    values=list(range(1,10))+list(range(10,100,10))+list(range(100,500,100))
    d=dict(zip(letters,values))
    d.update({a:d[b] for a,b in zip("ךםןףץ","כמנפצ")})
    return sum(d.get(c,0) for c in s)

assert (T(31),T(16),T(15))==(496,136,120)
assert T(31)==T(16)+3*T(15)
for n in range(1,101):
    assert T(2*n-1)==T(n)+3*T(n-1)

dots=[(a,b,30-a-b) for a in range(31) for b in range(31-a)]
central=[p for p in dots if max(p)<=15]
corners=[tuple(p for p in dots if p[i]>=16) for i in range(3)]
assert len(dots)==496 and len(set(dots))==496
assert len(central)==136
assert tuple(map(len,corners))==(120,120,120)
assert not set(central).intersection(set().union(*map(set,corners)))
assert sum(map(len,corners))+len(central)==len(dots)
assert len(set(central).union(*map(set,corners)))==len(dots)

assert sum(i*i for i in range(1,17))==1496==11*136
assert sum(i**3 for i in range(1,17))==18496==136**2
assert 1496-496==1000 and 18496-496==18000
assert 18496-1496==17000
assert 2520-1024==1496 and 2520-888==12*136
assert sum(i for i in range(1,496) if 496%i==0)==496
assert all(isqrt(8*n+1)**2!=8*n+1 for n in (1496,18496))
assert isqrt(8*496+1)**2==8*496+1

for word,num in [("קול",136),("מלכות",496),("ישו",316),("אחד",13),("אל",31),("חי",18),("חיי",28),("יהוה",26),("רוב",208),("עמית",520),("מייק",160),("יהוה חיי",54)]:
    assert gematria(word)==num,(word,gematria(word),num)
assert gematria("קול מלכות")==632==2*gematria("ישו")
assert gematria("קול דודי דופק פתחי לי")==888
assert 1331==11**3 and 13+31==44 and 31-13==18
assert (26*8,26*20,8*20)==(208,520,160)
assert 26*8+26*20+8*20==888
assert 8+20+26==54 and 8*20*26==4160
assert 26*(8+20)+8*20==888
assert [8+20+26,8*20+8*26+20*26,8*20*26]==[54,888,4160]
for i in range(1,17):
    print(i,i*i,i**3)
print("ALL ROVGRID 496/136/1496/18496 CHECKS PASSED",len(dots),len(central),*[len(x) for x in corners])
