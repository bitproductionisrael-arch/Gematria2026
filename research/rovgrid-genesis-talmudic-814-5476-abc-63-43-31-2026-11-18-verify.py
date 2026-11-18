"""Check Genesis 1:1 milui geometry, profile depth, ALBAM and randomization.
Run: python3 research/rovgrid-genesis-talmudic-814-5476-abc-63-43-31-2026-11-18-verify.py
All calculations are based on explicit tables, without external dependencies.
"""
from collections import Counter
from random import Random
from math import gcd

W = 'בראשית ברא אלהים את השמים ואת הארץ'.split()
A = 'אבגדהוזחטיכלמנסעפצקרשת'
R = dict(zip(A,[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
O = dict(zip(A,range(1,23)))
F = dict(zip('ךםןףץ','כמנפצ'))
M = dict(zip(A,['אלף','בית','גימל','דלת','הא','ויו','זין','חית','טית','יוד','כף','למד','מם','נון','סמך','עין','פא','צדי','קוף','ריש','שין','תו']))
MS = dict(M, ת='תיו')
L = dict(zip(A,['Alf','Bet','Gml','Dlt','Hey','Vav','Zin','Het','Tet','Yod','Kaf','Lmd','Mem','Nun','Smk','Ayn','Peh','Zdk','Kuf','Res','Sin','Tav']))
def n(c): return F.get(c,c)
def gem(s,values): return sum(values[n(c)] for c in s if n(c) in values)
def expand(w,profile,depth=1):
    for _ in range(depth):
        w=''.join(profile[n(c)] for c in w)
    return w
def sf(w,profile,values): return gem(expand(w,profile),values)
def small(c):
    a=R[n(c)]
    while a>=10: a//=10
    return a
def dr(k): return (k-1)%9+1
def redlatin(name): return sum((ord(c.upper())-65)%9+1 for c in name)
def prime_position(p):
    S=[True]*(p+1)
    S[0]=S[1]=False
    for j in range(2,int(p**0.5)+1):
        if S[j]:
            for k in range(j*j,p+1,j):S[k]=False
    return sum(S),S[p]

assert list(map(len,W))==[6,3,5,2,5,3,4]
assert [gem(w,R) for w in W]==[913,203,86,401,395,407,296]
assert [sf(w,M,R) for w in W]==[1819,1033,291,517,546,539,731]
assert [sf(w,M,O) for w in W]==[208,115,111,58,123,80,119]
assert [dr(sum(map(small,w))) for w in W]==[4,5,5,5,8,2,8]
assert [len(w)*sum(map(small,w)) for w in W]==[78,15,70,10,85,33,68]
assert [sum(redlatin(L[n(c)]) for c in w) for w in W]==[73,34,71,17,78,26,59]
assert sum(gem(w,R) for w in W)==2701
assert sum(sf(w,M,R) for w in W)==5476
assert sum(sf(w,M,O) for w in W)==814
assert sum(dr(sum(map(small,w))) for w in W)==37
assert sum(len(w)*sum(map(small,w)) for w in W)==359
assert sum(sum(redlatin(L[n(c)]) for c in w) for w in W)==358
assert sum(sum(map(small,w)) for w in W)==82
assert sum(map(small,'אלהים'))==14

for profile,expected in [
    (M,[(28,2701),(75,5476),(204,11667),(561,29869)]),
    (MS,[(28,2701),(78,5506),(218,11777),(615,31517)]),
]:
    got=[(sum(len(expand(w,profile,d)) for w in W),
          sum(gem(expand(w,profile,d),R) for w in W)) for d in range(4)]
    assert got==expected,(got,expected)
assert sum(sf(w,MS,O) for w in W)==844
assert 5506-844==5476-814==4662==37*(3**2+6**2+9**2)
assert 11777-11667==110==5*10+3*20
assert prime_position(11777)==(1410,True)
assert gem('אפס',R)==gem('הכל אלהים',R)==141

a,b=W[:3],W[3:]
assert sum(sf(w,M,R) for w in a)==3143
assert sum(sf(w,M,O) for w in a)==434
assert sum(sf(w,M,R) for w in b)==2333
assert sum(sf(w,M,O) for w in b)==380
assert 434-380==54==8+20+26
assert 3143-2333==810==15*54
assert 3143-434==2709==63*43
assert 2333-380==1953==63*31
assert 814+2709+1953==5476==74*74
assert gcd(2701,5476,814)==37

def albam(ch):return A[(A.index(n(ch))+11)%22]
assert ''.join(map(albam,'אבא'))=='למל'
assert ''.join(map(albam,'למל'))=='אבא'
P=['אבא','למל']
assert sum(gem(w,R) for w in P)==104
assert sum(gem(w,O) for w in P)==41
assert (2*104,3*104,4*104,3*41)==(208,312,416,123)
pr=ps=1
for c in ''.join(P):pr*=R[n(c)];ps*=small(c)
assert (pr,ps)==(72000,72)
assert pr//ps==1000
assert sum((len(w)+1)*gem(w,R) for w in W)//2==7200

# Post-hoc permutation diagnostic; no claim of a calibrated statistical p-value.
random=Random(888)
chars=list(''.join(W))
fo={c:sf(c,M,O) for c in set(chars)}
fr={c:sf(c,M,R) for c in set(chars)}
count=Counter()
for _ in range(200000):
    random.shuffle(chars)
    test54=sum(fo[c] for c in chars[:14])==434
    test810=sum(fr[c] for c in chars[:14])==3143
    pos=total=0
    for k in [6,3,5,2,5,3,4]:
        total+=dr(sum(small(c) for c in chars[pos:pos+k]))
        pos+=k
    test37=total==37
    count['37']+=test37
    count['54']+=test54
    count['810']+=test810
    count['54+810']+=test54 and test810
    count['triple']+=test54 and test810 and test37
assert count==Counter({'37':103205,'54':1868,'810':202,'54+810':72,'triple':32}),count
print('PASS: 2701/5476/814; geometric 74² closure; double milui profiles; ALBAM symmetry')
print('PASS: reproducible permutation control (seed 888; N=200000):',dict(count))
