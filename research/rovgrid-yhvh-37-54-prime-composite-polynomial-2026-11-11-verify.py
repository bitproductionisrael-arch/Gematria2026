#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""RovGrid 2026-11-11: independent arithmetic, gematria, geometry verification."""
from math import isqrt
import unicodedata

H = dict(zip("אבגדהוזחטיכלמנסעפצקרשת",[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
H.update({'ך':20, 'ם':40, 'ן':50, 'ף':80, 'ץ':90})  # Hebrew final letters in standard gematria
def hebrew(s):
    return sum(H[c] for c in s if c in H)
def prime(n):
    if n < 2: return False
    return all(n%d for d in range(2,isqrt(n)+1))
def nth_prime(k):
    n=1
    while k:
        n+=1
        if prime(n): k-=1
    return n
def composites_through(n):
    return sum(1 for m in range(4,n+1) if not prime(m))
def remove_zero_all(n):
    return int(str(n).replace("0","")) if n else 0
def remove_zero_once(n):
    s=str(n)
    return int(s[:-1]) if s.endswith("0") and n else n

assert hebrew("יהוה")==26
assert sum(remove_zero_all(H[c]) for c in "יהוה")==17
assert [hebrew(s) for s in "יוד הא ויו הא".split()]==[20,6,22,6]
assert hebrew("יוד הא ויו הא")==54
assert hebrew("יוד הא ואו הא")==45
assert [hebrew(s) for s in ["עמית","מיכאל","בלייז","רוב"]]==[520,101,59,208]
assert hebrew("מייק")==160
assert nth_prime(26)==101 and nth_prime(17)==59
assert 26*20==520 and 26*(54-26-20)==208
assert 520+101+59+208==888 and 101+59==160
assert composites_through(54)==37
assert composites_through(55)==38
assert sum(prime(k) for k in range(2,55))==16
assert 37*54==1998
assert [hebrew(s) for s in "בראשית ברא אלהים את השמים".split()]==[913,203,86,401,395]

layers=["יוד","יוד הא","יוד הא ויו","יוד הא ויו הא"]
assert [hebrew(s) for s in layers]==[20,26,48,54]
assert [len(s.replace(" ","")) for s in layers]==[3,5,8,10]
assert sum(hebrew(s) for s in layers)==148==4*37
assert 148*6==888
assert len("עמיתמייקרוב")==11
assert len("עמיתמיכאלבלייזרוב")==17

greek_iso=dict(zip("ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ",[1,2,3,4,5,7,8,9,10,20,30,40,50,60,70,80,100,200,300,400,500,600,700,800]))
greek_ordinal="ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ"
def letters(s):
    t=unicodedata.normalize("NFD",s).upper()
    return [c for c in t if c in greek_iso]
def iso(s): return sum(greek_iso[c] for c in letters(s))
def small(s): return sum(remove_zero_all(greek_iso[c]) for c in letters(s))
def once(s): return sum(remove_zero_once(greek_iso[c]) for c in letters(s))
def atbash(s): return sum(25-(greek_ordinal.index(c)+1) for c in letters(s))
words=["Ὁ","Θεός","ὁ"]
assert [iso(s) for s in words]==[70,284,70]
assert [small(s) for s in words]==[7,23,7]
assert [once(s) for s in words]==[7,41,7]
assert [atbash(s) for s in words]==[10,54,10]
assert sum(iso(s) for s in words)==424
assert sum(small(s) for s in words)==37
assert sum(remove_zero_all(small(s)) for s in words)==19
assert sum(once(s) for s in words)==55
assert sum(atbash(s) for s in words)==74
assert 19+37+55==111 and 111*8==888 and 19+55==74
assert hebrew("משיח")+hebrew("בן")+hebrew("דוד")==424

R=3
def valid(q,r): return max(abs(q),abs(r),abs(q+r)) <= R
nodes=sum(valid(q,r) for q in range(-R,R+1) for r in range(-R,R+1))
tris=sum(
    int(valid(q,r) and valid(q+1,r) and valid(q,r+1))+
    int(valid(q+1,r) and valid(q,r+1) and valid(q+1,r+1))
    for q in range(-R,R+1) for r in range(-R,R+1)
)
assert (nodes,tris)==(37,54)
assert [8+20+26,8*20+8*26+20*26,8*20*26]==[54,888,4160]

expected_full=[5103,36941,120475,280665,542471,930853,1470771,2187185]
for x in range(1,9):
    full=(1+8*x)*(1+20*x)*(1+26*x)
    expanded=1+54*x+888*x*x+4160*x*x*x
    assert full==expanded==expected_full[x-1]
    assert full-1==54*x+888*x*x+4160*x*x*x
for x in (1,4,7):
    assert all((1+a*x)%3==0 for a in (8,20,26))
for x in (2,5):
    assert all(prime(1+a*x) for a in (8,20,26))
assert (1+8*8,1+20*8,1+26*8)==(65,161,209)
assert (5*13,7*23,11*19)==(65,161,209)
print("PASS — all RovGrid 2026-11-11 checks")
