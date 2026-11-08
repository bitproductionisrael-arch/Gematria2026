#!/usr/bin/env python3
"""Exact audit: all triangles of first 24 primes in 4 rows × 6 columns."""
from itertools import combinations
from collections import Counter
from math import gcd, isqrt
from random import Random
P=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89]
def audit(columns=6):
    pos={p:(i%columns,i//columns) for i,p in enumerate(P)}
    sub=lambda a,b:(a[0]-b[0],a[1]-b[1])
    dot=lambda a,b:a[0]*b[0]+a[1]*b[1]
    cross=lambda a,b:a[0]*b[1]-a[1]*b[0]
    d2=lambda a,b:sum((a[i]-b[i])**2 for i in range(2))
    triangle=lambda p:cross(sub(pos[p[1]],pos[p[0]]),sub(pos[p[2]],pos[p[0]]))!=0
    def right(p):
        return any(dot(sub(pos[p[(j+1)%3]],pos[p[j]]),sub(pos[p[(j+2)%3]],pos[p[j]]))==0 for j in range(3))
    def distances(p):return sorted([d2(pos[a],pos[b]) for a,b in combinations(p,2)])
    def inside(p):
        q=[pos[x] for x in p]
        return [v for v,c in pos.items()
            if (lambda ds:all(t>0 for t in ds) or all(t<0 for t in ds))
            ([cross(sub(q[(j+1)%3],q[j]),sub(c,q[j])) for j in range(3)])]
    sq=lambda n:isqrt(n)**2==n
    triples=list(combinations(P,3))
    valid=[x for x in triples if triangle(x)]
    rights=[x for x in valid if right(x)]
    integer=[x for x in rights if all(sq(n) for n in distances(x))]
    q13=[x for x in rights if distances(x)==[4,9,13]]
    matches=[]
    for t in rights:
        ins=inside(t)
        if len(ins)==1:
            a,b=max(combinations(t,2),key=lambda pair:d2(pos[pair[0]],pos[pair[1]]))
            value=a+b+ins[0]
            if sq(value):matches.append((t,ins[0],(a,b),value))
    return dict(pos=pos,total=len(triples),valid=len(valid),right=len(rights),
                integer=integer,q13=q13,match=matches,inside=inside,distances=distances,
                squares_any=[x for x in triples if sq(sum(x))],
                ones=sum(len(inside(t))==1 for t in rights))
a=audit(6)
assert (a["total"],a["valid"],a["right"],len(a["integer"]),len(a["q13"]),a["ones"],len(a["match"]))==(2024,1884,524,8,40,124,6)
assert {tuple(a["distances"](t)) for t in a["integer"]}=={(9,16,25)}
assert sum(sum(t)==169 for t in combinations(P,3))==21
assert len(a["squares_any"])==91
assert [t for t in a["q13"] if t==(37,73,89)]==[(37,73,89)]
assert (37,73,89) in [t for t,inner,hyp,value in a["match"] if inner==59 and value==169]
assert [x for x in a["match"] if x[0] in a["q13"]]==[((37,73,89),59,(37,73),169)]
isos=[t for t in combinations(P,3) if a["distances"](t)==[13,13,26]]
assert set(isos)=={(2,37,73),(5,61,67),(7,41,89),(13,17,79)}
assert (a["pos"][2],a["pos"][37],a["pos"][73])==((0,0),(5,1),(2,3))
assert a["inside"]((23,37,73))==[53] and a["inside"]((37,73,89))==[59]
assert 37+53+73==163 and 37+59+73==169 and 169-163==6
assert [(P.index(q)+1,P.index(r)+1) for q,r in [(23,89),(37,73),(53,59)]]==[(9,24),(12,21),(16,17)]
assert 23+89==53+59==112 and 37+73==110
b=audit(4)
assert (b["right"],len(b["q13"]))==(524,40)
assert [(t,inner,val) for t,inner,hyp,val in b["match"] if t in b["q13"]]==[
  ((7,43,53),31,81),((11,59,67),43,121)]
print("PASS: 4x6 census, 3-4-5, 40 norm13, 6 square interior, star-pair 2-37-73, 163/169, index33, 6x4 control.")
print("4x6: all",a["total"],"triangles",a["valid"],"right",a["right"],"integer",len(a["integer"]),"norm13",len(a["q13"]),"single-interior",a["ones"],"square-matches",len(a["match"]))
print("4x6 matches:",a["match"])
print("Expected square-matches among 40 shuffled:",40*91/2024)
# Optional reproducible random-label baseline
coords=[(i%6,i//6) for i in range(24)]
def det(a,b,c):
    return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
pidx={v:i for i,v in enumerate(P)}
slots=[]
for t in a["q13"]:
    u,v=max(combinations(t,2),key=lambda pair:sum((a["pos"][pair[0]][j]-a["pos"][pair[1]][j])**2 for j in range(2)))
    w=a["inside"](t)[0]
    slots.append((pidx[u],pidx[v],pidx[w]))
rng=Random(20261108)
freq=Counter()
for _ in range(40000):
    arr=P[:];rng.shuffle(arr)
    z=sum(isqrt(arr[i]+arr[j]+arr[k])**2==arr[i]+arr[j]+arr[k] for i,j,k in slots)
    freq[z]+=1
print("Randomized 40000: P(>=1) =",round(1-freq[0]/40000,5),
      "P(=1) =",round(freq[1]/40000,5),
      "E =",round(sum(i*c for i,c in freq.items())/40000,5))
