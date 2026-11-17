#!/usr/bin/env python3
# Audits Ramanujan N=37/58 near-integers, quartic Borwein seeds, and CM class numbers
# pip install mpmath; python research/rovgrid-104-128-24-ramanujan-cm-2026-11-17-verify.py
import math
import mpmath as mp
mp.mp.dps = 95

def quadratic_trace(sum_roots, n):
    if n == 0: return 2
    a, b = 2, sum_roots
    for _ in range(2, n+1):
        a, b = b, sum_roots*b+a  # product of conjugates = -1
    return b

t37=quadratic_trace(12,6)
t58=quadratic_trace(5,12)
assert (t37,t58)==(3_111_698,384_238_402)
A37=64*t37; B37=4*84**4
A58=64*t58; B58=396**4
assert A37-B37==B58-A58==128
assert A37-24==B37+104==199_148_648
assert A58+24==B58-104==24_591_257_752
assert 128-24==104

for d,integer in [(37,199_148_648),(58,24_591_257_752)]:
    value=mp.exp(mp.pi*mp.sqrt(d))
    approx=mp.acosh(mp.mpf(integer)/2)/mp.sqrt(d)
    print("d",d,"exp(pi*sqrt d)",mp.nstr(value,55))
    print("arccosh π estimate",mp.nstr(approx,55),"error",mp.nstr(approx-mp.pi,35))
    assert abs(approx-mp.pi)<(mp.mpf("2e-14") if d==37 else mp.mpf("1e-18"))

def borwein(y,a,steps):
    states=[(y,a)]
    for n in range(steps):
        root=mp.root(1-y**4,4)
        y=(1-root)/(1+root)
        a=a*(1+y)**4-2**(2*n+3)*y*(1+y+y*y)
        states.append((y,a))
    return states

good=borwein(mp.sqrt(2)-1,6-4*mp.sqrt(2),3)
assert abs(1/good[2][1]-mp.pi)<mp.mpf("1e-39")
assert abs(1/good[3][1]-mp.pi)<mp.mpf("1e-90")

radicand=145-24*mp.sqrt(37)
assert radicand<0
bad_y=mp.sqrt(2)*mp.sqrt(radicand)/mp.sqrt(882)
bad_a=(1123-21460*mp.sqrt(37)*(radicand/882))/(1764*mp.sqrt(2))
bad=borwein(bad_y,bad_a,3)
assert abs(1/bad[-1][1]-mp.pi)>1
print("invalid proposed radicand",mp.nstr(radicand,35))
print("invalid-seed limit after 3 steps",mp.nstr(1/bad[-1][1],45))

def reduced_forms(discriminant):
    D=discriminant
    out=[]
    for a in range(1,math.isqrt((-D)//3)+3):
        for b in range(-a,a+1):
            v=b*b-D
            if v%(4*a):continue
            c=v//(4*a)
            if a>c or math.gcd(a,math.gcd(abs(b),c))>1:continue
            if (abs(b)==a or a==c) and b<0:continue
            out.append((a,b,c))
    return out

for D,h in [(-148,2),(-232,2),(-292,4),(-888,12),(-3552,24)]:
    forms=reduced_forms(D)
    assert len(forms)==h,(D,forms)
    print("D",D,"class number",h)
assert 888==24*37
assert 396==4*99
assert 396**4==256*99**4
print("PASS all verified arithmetic and CM class-number checks")
