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

# Cube combinatorics / antipodal orbits / shell geometry.
V,E,F = 8,12,6
assert V-E+F==2
assert (V,V+E,V+E+F)==(8,20,26)
assert (V//2,(V+E)//2,(V+E+F)//2)==(4,10,13)
assert (V//2, E//2, F//2)==(4,6,3)
a,b,c=(V//2,(V+E)//2,(V+E+F)//2)
assert (a+b+c,a*b+a*c+b*c,a*b*c)==(27,222,520)
assert ((2*a)+(2*b)+(2*c),(2*a)*(2*b)+(2*a)*(2*c)+(2*b)*(2*c),(2*a)*(2*b)*(2*c))==(54,888,4160)
shell=4**3-3**3
assert shell == 3*4**2-3*4+1 == 37
assert V+E+F+1==3**3
assert 3**3-1 == V+E+F ==26
assert 3**3+shell==4**3
assert {3:111,F:222,V:296,E:444,24:888} == {k:k*shell for k in [3,F,V,E,24]}
assert V*3 == E*2 == F*4 == 24
assert (V-E+F)*shell == V*shell-E*shell+F*shell ==74
assert (V+F)*shell+2==520
print('PASS: cube f-vector, antipodal pairs, 1/7/19/37 cube shell, name bridges')


# Factorial ladder extension (Nov 09): 37 × n!; consecutive deltas.
from math import factorial, comb
expected=[37,74,222,888,4440,26640,186480,1491840,13426560,134265600]
assert [37*factorial(n) for n in range(1,11)]==expected
assert 37*(factorial(4)-factorial(3))==666
assert 37*(factorial(5)-factorial(4))==222*(4**2)
assert 37*(factorial(6)-factorial(5))==222*(10**2)
assert 37*(factorial(7)-factorial(6))==222*720!=222*(13**2)
assert 37*factorial(7)==24*comb(37,3)
for n in range(1,15):
    assert 37*factorial(n+1)-37*factorial(n)==37*n*factorial(n)
assert 37*factorial(5)!=222*3**2
print('PASS: 37*n! ladder, differences, primitive edge 4/10 hits and 13 miss')


# Triple David closure and unique c under an explicit selected constraint.
a,b=4,10
def quadratic_coeff(c): return a*b+(a+b)*c
def scaled_rov_face(c): return (2*a)*(2*c)
solutions=[c for c in range(-1000,1001) if quadratic_coeff(c)-scaled_rov_face(c)==a+b]
assert solutions == [13]  # uniqueness among integers in range; exact linear equation proves uniqueness in R.
assert quadratic_coeff(13)==222 and scaled_rov_face(13)==208
assert a+b == quadratic_coeff(13)-scaled_rov_face(13) == digit_sum(520)+digit_sum(160) == heb('דוד') ==14
lost1,lost2=520-digit_sum(520),160-digit_sum(160)
assert (lost1,lost2)==(513,153)
assert lost1+lost2==666
assert sorted(str(lost1))==sorted(str(lost2))
assert all(int(x)+int(y)<10 for x,y in zip(str(lost1),str(lost2)))
assert (lost1+lost2)+(digit_sum(520)+digit_sum(160)+208)==888
assert 666==9*74==37*(factorial(4)-factorial(3))==poly_coeff(2)[1]-poly_coeff(1)[1]
print('PASS: three David pathways, unique third edge, no-carry positional 513/153 bridge')
