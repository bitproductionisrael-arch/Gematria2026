from math import isqrt
from collections import Counter
from itertools import product

J = [1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500]
words = ("AMIT","MIKE","ROV")
S = lambda w: sum(ord(c)-64 for c in w)
A = lambda w: sum(J[ord(c)-65] for c in w)
assert [(S(w),A(w),A(w)-S(w)) for w in words] == [(43,140,97),(38,54,16),(55,830,775)]
assert sum(map(S,words)) == 136 and sum(map(A,words)) == 1024
H = dict(zip("אבגדהוזחטיכלמנסעפצקרשת", [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
assert [sum(H[c] for c in w) for w in ("עמית","מייק","רוב")] == [520,160,208]
assert 1024-136 == 520+160+208 == 888
for n in (1,2,3,4,8,16,32):
    orbits = Counter(tuple(sorted((abs(2*i-(2*n-1)),abs(2*j-(2*n-1))))) for i,j in product(range(2*n),repeat=2))
    assert len(orbits) == n*(n+1)//2
    assert Counter(orbits.values())[4] == n
    assert Counter(orbits.values())[8] == n*(n-1)//2
    assert sum(v-1 for v in orbits.values()) == n*(7*n-1)//2
for a,b,c in ((4,10,13),(5,8,14)):
    assert a*b+a*c+b*c == 222
assert isqrt(12433)**2 != 12433
assert 223**2-12432*2**2 == 1
x,s=1,0
for k in range(1,21):
    x,s=223*x+24864*s,2*x+223*s
    assert x*x-12432*s*s == 1
    assert (x%14==13) == (k%2==1)
    if k%2:
        n=(x+1)//14
        assert n*(7*n-1)==444*s*s
        if k==1: assert (n,s)==(16,2)
        if k==3: assert (n,s)==(3168400,397830)
assert [(a,b) for a in range(1,31) for b in range(31) if 2**a*(7*2**a-1)==444*2**(2*b)] == [(4,1)]
print("PASS: fixed mappings, D4 orbit counts, cuboid half-surfaces, Pell recurrence, dyadic regression")
