#!/usr/bin/env python3
# Reproducible, dependency-free verification: RovGrid 222–888, 2026-11-09.
def poly_coeff(n):
    a,b,c=(4*n,10*n,13*n)
    return (a+b+c,a*b+a*c+b*c,a*b*c)
def ss(n):
    return sum((n*v)**2 for v in (1,10,11))
def heb(s):
    vals=dict(zip("אבגדהוזחטיכלמנסעפצקרשת",
       [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
    return sum(vals[ch] for ch in s if ch in vals)
def digit_sum(v): return sum(map(int,str(v)))
assert (heb('עמית'),heb('מייק'),heb('רוב')) == (520,160,208)
assert heb('דוד')==14 and heb('דודרוב')==222
assert heb('עמיתמייקרוב')==888
assert digit_sum(520)+digit_sum(160)==14
for n in range(1,101):
    coeff=poly_coeff(n)
    assert coeff==(27*n,222*n*n,520*n*n*n)
    assert ss(n)==coeff[1]
assert [ss(n) for n in range(1,6)]==[222,888,1998,3552,5550]
assert 1998==666*3
assert all((a*a+a*b+b*b)%4 != 2 for a in range(4) for b in range(4))
assert not any(a*a+b*b+(a+b)**2==444 for a in range(-100,101) for b in range(-100,101))
print('PASS: name values, reduction, two polynomial and squares constructions, targets')
