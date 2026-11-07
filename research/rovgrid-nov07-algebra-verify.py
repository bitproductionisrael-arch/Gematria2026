#!/usr/bin/env python3
"""RovGrid 2026-11-07 algebra and D4 geometry verifier; Python stdlib only."""
from fractions import Fraction
from math import gcd
from pathlib import Path
import argparse

def prime_list(n=110):
    out=[]
    k=2
    while len(out)<n:
        if all(k%p for p in out if p*p<=k): out.append(k)
        k+=1
    return out
PR=prime_list()
def P(k): return PR[k-1]
def I(p): return PR.index(p)+1
def W(n):
    assert n>=1
    if n==1: return 0
    w=0
    for p in PR:
        while n%p==0:
            n//=p
            w+=I(p)
        if n==1: break
    assert n==1
    return w
def op(a,b): return P(I(a)+I(b))
def ext(a,b): return P(W(a)+W(b))
def poly_mul(a,b):
    out=[0]*(len(a)+len(b)-1)
    for i,x in enumerate(a):
        for j,y in enumerate(b): out[i+j]+=x*y
    return out
def area(poly):
    return abs(sum(x*v-u*y for (x,y),(u,v) in zip(poly,poly[1:]+poly[:1])))/2
def verify():
    assert [op(a,b) for a,b in [(73,37),(59,41),(13,13),(101,47),(11,17)]]==[137,113,37,179,37]
    assert [ext(a,b) for a,b in [(520,61),(160,52),(208,28),(101,47),(59,41)]]==[113,53,53,179,113]
    assert (W(888),W(141),W(136),W(1024))==(17,17,10,10)
    assert op(op(37,19),29)==113
    assert op(op(op(37,101),59),29)==313
    assert op(op(op(op(37,19),101),59),29)==367
    xs=[64,72]
    for _ in range(7): xs.append(sum(xs))
    assert xs==[64,72,136,272,544,1088,2176,4352,8704]
    assert sum(xs[:8])==xs[8]==8704
    assert [W(z) for z in xs]==[6,7,10,11,12,13,14,15,16]
    assert [P(W(z)) for z in xs]==[13,17,29,31,37,41,43,47,53]
    assert gcd(64,72)==8 and 64*72//gcd(64,72)==576
    pairs=[]
    for v in range(1,30):
        if 888%v==0:
            u=888//v
            if u>v: pairs.append((u+v,u-v))
    assert sorted(pairs)==sorted([(61,13),(86,62),(119,103),(154,142),(226,218),(299,293),(446,442),(889,887)])
    for A,B,n in [(55,53,54),(61,13,888),(889,887,888)]:
        h=Fraction(A-B,2)
        top=[(0,0),(A,0),(A-h,h),(h,h)]
        half=[(0,0),(Fraction(A,2),0),(Fraction(A,2),h),(h,h)]
        assert area(top)==n and area(half)==Fraction(n,2)
        assert A*A-B*B==4*n
    assert 55**2-52**2==321 and 55**2-53**2==216
    assert Fraction(1024,61)==16+Fraction(48,61)
    q=[1];Q=[1]
    for n in (4,10,13): q=poly_mul(q,[1,n])
    for n in (8,20,26): Q=poly_mul(Q,[1,n])
    assert q==[1,27,222,520] and Q==[1,54,888,4160]
    assert 61*61-13*13==889*889-887*887==3552
    print("PASS: names, prime-index operators, 8 dimensions, 8 solutions, D4 areas, polynomials.")
def svg_ring(A,B,dest):
    """Vector generator with exact original units (not enlarged)."""
    h=Fraction(A-B,2)
    outer=[(0,0),(A,0),(A,A),(0,A)]
    inner=[(h,h),(A-h,h),(A-h,A-h),(h,A-h)]
    def pt(v): return ",".join(str(float(t)) for t in v)
    def polygon(points,color):
        return '<polygon points="'+ " ".join(pt(p) for p in points) +'" fill="'+color+'"/>'
    lines=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+str(A)+' '+str(A)+'">']
    for i in range(4):
        j=(i+1)%4
        o=((outer[i][0]+outer[j][0])/2,(outer[i][1]+outer[j][1])/2)
        q=((inner[i][0]+inner[j][0])/2,(inner[i][1]+inner[j][1])/2)
        lines.append(polygon([outer[i],o,q,inner[i]],"#286ca4"))
        lines.append(polygon([o,outer[j],inner[j],q],"#75aed5"))
    lines.append(polygon(inner,"#13283f"))
    lines.append("</svg>")
    dest.write_text("\n".join(lines),encoding="utf-8")
if __name__=="__main__":
    arg=argparse.ArgumentParser()
    arg.add_argument("--svg-output",type=Path,help="emit exact-scale square-ring SVG into folder")
    args=arg.parse_args()
    verify()
    if args.svg_output:
        args.svg_output.mkdir(parents=True,exist_ok=True)
        for A,B in ((55,53),(61,13),(889,887)):
            svg_ring(A,B,args.svg_output/("ring_"+str(A)+"_"+str(B)+".svg"))
