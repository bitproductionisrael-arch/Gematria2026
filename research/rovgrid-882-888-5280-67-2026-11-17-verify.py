#!/usr/bin/env python3
"""Audit 882 vs 888, Heegner 67, 5280, base-528 pi, and class-number distinction.
Dependencies: pip install mpmath
Run: python research/rovgrid-882-888-5280-67-2026-11-17-verify.py
"""
from math import gcd, isqrt
import mpmath as mp
mp.mp.dps=110

def forms(D):
    assert D < 0 and D%4 in (0,1)
    out=[]
    for a in range(1,isqrt((-D)//3)+3):
        for b in range(-a,a+1):
            v=b*b-D
            if v%(4*a): continue
            c=v//(4*a)
            if a>c or gcd(a,gcd(abs(b),c))>1: continue
            if (abs(b)==a or a==c) and b<0: continue
            out.append((a,b,c))
    return out

# Explain that different CM arguments have different discriminants
assert {D:len(forms(D)) for D in (-67,-268,-148,-232,-3552)} == {
    -67:1, -268:3, -148:2, -232:2, -3552:24}

# Algebraic links between 37, 888, 882, 67, 5280, 528 and 396
assert 888==24*37==6*(4*37)
assert 882==2*21**2==6*(4*37-1)==888-6
assert 5280==12*(21**2-1)==6*882-12==10*528
assert 528*3==396*4
assert 1760==11*160 and 330==6*55

def pi_37_series_with_denominator(b,N=9):
    s=mp.mpf(0)
    for n in range(N):
        t=(-1)**n*(mp.factorial(4*n)/mp.factorial(n)**4)*(1123+21460*n)
        t/= 4**(4*n)*mp.mpf(b)**(2*n+1)
        s+=t
    return 4/s
good=pi_37_series_with_denominator(882)
changed=pi_37_series_with_denominator(888)
assert abs(good-mp.pi)<mp.mpf('1e-50')
assert abs(changed-mp.mpf('3.162963928950163901719898957377081278438269'))<mp.mpf('1e-39')
print('d37 original 882:',mp.nstr(good,48))
print('d37 with 888 substituted:',mp.nstr(changed,48))
print('difference from pi:',mp.nstr(changed-mp.pi,35))

# Published Ramanujan-Sato 67 series, Eq. (95) of the 2026 article.
series=mp.mpf(0)
errors=[]
for n in range(5):
    C=mp.rf(mp.mpf(1)/6,n)*mp.rf(mp.mpf(1)/2,n)*mp.rf(mp.mpf(5)/6,n)/mp.factorial(n)**3
    item=(10177+261702*n)*C*(-mp.mpf(1728)/5280**3)**n
    series+=item
    approximation=1760*mp.sqrt(330)/series
    error=abs(approximation-mp.pi)
    errors.append(error)
    print('67 series n',n,'pi=',mp.nstr(approximation,54),'error=',mp.nstr(error,20))
assert mp.mpf('6e-8')<errors[0]<mp.mpf('7e-8')
assert mp.mpf('6e-16')<errors[1]<mp.mpf('7e-16')
assert mp.mpf('6e-24')<errors[2]<mp.mpf('7e-24')
print('asymptotic decimal digits per term:',mp.nstr(-mp.log10(mp.mpf(1728)/5280**3),20))
# Classical near-integer, is not exactly an integer:
exp67=mp.exp(mp.pi*mp.sqrt(67))
assert abs(exp67-(5280**3+744))<mp.mpf('0.000002')
print('exp(pi sqrt67)=',mp.nstr(exp67,54))
print('difference exp - integer:',mp.nstr(exp67-(5280**3+744),32))

# Genuine positional base-528 pi digits
q=mp.pi-3
digits=[]
for _ in range(6):
    q*=528
    digit=int(q)
    assert 0 <= digit < 528
    digits.append(digit)
    q-=digit
assert digits==[74,401,404,330,463,328]
print('base 528 fractional digits:',digits)
print('digits after two base-528 places:',mp.nstr(3+mp.mpf(74)/528+mp.mpf(401)/528**2,36))
print('PASS')
