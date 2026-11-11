#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""RovGrid: independent checks of Ani / Vehu, 72 positions and 231 gates.
Run: python3 research/rovgrid-ani-vehu-72-names-231-gates-1024-2026-11-11-verify.py
"""
from math import gcd
ALPHABET = "אבגדהוזחטיכלמנסעפצקרשת"
REGVALS = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
REG = dict(zip(ALPHABET, REGVALS))
ORD = {a:i+1 for i,a in enumerate(ALPHABET)}
ATB = {a:23-(i+1) for i,a in enumerate(ALPHABET)}
ALBM = {ALPHABET[i]:ALPHABET[(i+11)%22] for i in range(22)}
FINAL = dict(zip("ךםןףץ", "כמנפצ"))
def normalize(w):
    return "".join(FINAL.get(a,a) for a in w if a not in " \t\n־-״׳")
def gem(w, method="reg"):
    s=normalize(w)
    if method=="albm": return sum(REG[ALBM[a]] for a in s)
    mapping={"reg":REG,"ord":ORD,"atb":ATB}[method]
    return sum(mapping[a] for a in s)
def R(n):
    assert n>=1
    return "אני" + "והואואני"*(n-1)
def S(n):
    return R(n)+"והוא"
def check(w, vals):
    assert tuple(gem(w,m) for m in ("reg","ord","atb")) == vals, (w,vals)
def totient(n):
    return sum(gcd(k,n)==1 for k in range(1,n+1))
def main():
    check("אני",(61,25,44))
    check("הוא",(12,12,57))
    check("והו",(17,17,52))
    check("והוא",(18,18,74))
    check("והואו",(24,24,91))
    check("והואניוהו",(95,59,148))
    assert 148*6==888 and 95-59==36 and 95+59==154
    assert [x for x in (1,37,49) if (x-1)%12==0]==[1,37,49]
    assert [37-1,49-37,72+1-49]==[36,12,24]
    for n in range(1,31):
        s=R(n)
        assert len(s)==8*n-5
        assert gem(s)==85*n-24
        assert gem(s,"ord")==49*n-24
        assert gem(s,"atb")==135*n-91
        assert gem(s)-gem(s,"ord")==36*n
        assert gem(s)+gem(s,"ord")==134*n-48
        assert gem(s,"atb")+gem(s,"ord")==23*len(s)
    for n,v in [(3,(19,231,123,314)),(4,(27,316,172,449)),
                (5,(35,401,221,584)),(8,(59,656,368,989))]:
        s=R(n)
        assert (len(s),gem(s),gem(s,"ord"),gem(s,"atb"))==v
    assert 22*21//2==231 and gem("רלא")==231 and gem("רלא","ord")==33
    assert 19*23==123+314==437
    assert 656+368==1024==8*128
    assert (656-368)==288==totient(888)
    assert 656==40+5+200+200+10+1+200 # Μεσσίας
    assert gem("מייק")+gem("רוב")==368
    assert gem("יהי אור")==232 and 888-656==368-136==232
    assert [(n,gem(R(n))+gem(R(n),"ord")) for n in range(1,30) if gem(R(n))+gem(R(n),"ord")==128*n]==[(8,1024)]
    t=S(14)
    assert (len(t),gem(t),gem(t,"ord"),gem(t,"atb"))==(111,1184,680,1873)
    assert gem(t)-gem(t,"ord")==504
    assert (gem("אנחנו"),gem("אנחנו","ord"),gem("אנחנו","atb"),gem("אנחנו","albm"))==(115,43,72,216)
    assert (gem("אחד"),gem("אחד","ord"),gem("אחד","atb"),gem("אחד","albm"))==(13,13,56,190)
    assert (gem("אנחנו אחד"),gem("אנחנו אחד","ord"),gem("אנחנו אחד","atb"),gem("אנחנו אחד","albm"))==(128,56,128,406)
    assert 115-72==56-13==43
    assert (gem("אנחנו אחד")+gem("אנחנו אחד","ord"))==8*23
    assert gem("אנחנו אחד","atb")*8==1024
    comp=[k for k in range(4,50) if any(k%d==0 for d in range(2,int(k**.5)+1))]
    assert comp.index(49)+1==33 and comp.index(25)+1==15
    chain=[73,61,49,37,25,13,1]
    assert all(chain[i]-chain[i+1]==12 for i in range(6))
    assert sum(chain)==259==7*37
    assert [chain[i]+chain[-i-1] for i in range(3)]==[74]*3
    assert (7**2+5**2)*(7+5)==888
    # New modular observation: n=8 is the least positive index with ord divisible by 23.
    assert [n for n in range(1,32) if gem(R(n),"ord")%23==0]==[8,31]
    assert 368==23*16 and 989==23*43 and 59==16+43
    assert (gem(R(8),"ord")+gem(R(8),"atb"))==59*23
    assert 656==16*41 and 368==16*23 and 1024==16*64
    assert (gem(S(14)),888,296)==(8*148,6*148,2*148)
    assert gem(R(5),"ord")==221 and 231-221==10
    print("PASS: positional 72, letterwise methods, n=1..30, 231 gates, 1024 closure, 14-tail, 128 symmetry")
if __name__=="__main__":
    main()
