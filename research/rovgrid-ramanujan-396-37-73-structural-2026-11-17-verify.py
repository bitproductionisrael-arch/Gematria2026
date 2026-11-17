#!/usr/bin/env python3
# Ramanujan's d=58 (396) and d=37 (882): same cubic coefficient recurrence,
# and direct conversion of pi into base 396.
# Exact rational recurrence, Decimal calculations, standalone Python 3 stdlib.
from fractions import Fraction
from decimal import Decimal, localcontext
from math import factorial
import sys

def atan_reciprocal(d: int, precision: int):
    x = Decimal(1) / d
    x2 = x*x
    power = x
    out = Decimal(0)
    k = 0
    while True:
        term = power / (2*k+1)
        if abs(term) < Decimal(10) ** (-(precision+5)):
            return out
        out += term if k % 2 == 0 else -term
        power *= x2
        k += 1

def make_coeffs(nmax):
    coeff = [Fraction(1)]
    for n in range(nmax-1):
        coeff.append(
            coeff[-1]*Fraction((4*n+1)*(4*n+2)*(4*n+3),
                               64*(n+1)**3)
        )
    for n,c in enumerate(coeff):
        assert c == Fraction(factorial(4*n), factorial(n)**4 * 256**n)
    return coeff

def dec(x):
    return Decimal(x.numerator) / Decimal(x.denominator)

with localcontext() as ctx:
    ctx.prec = 150
    pi_ref = 16*atan_reciprocal(5,ctx.prec) - 4*atan_reciprocal(239,ctx.prec)
    assert str(pi_ref).startswith("3.141592653589793238462643383279502884")

    coeff=make_coeffs(8)
    assert coeff[:4] == [Fraction(1), Fraction(3,32),
                          Fraction(315,8192),Fraction(5775,262144)]

    for terms in (1,2,3,4,5,6):
        s58=sum(dec(coeff[n])*(1103+26390*n)/(Decimal(99)**(4*n))
                for n in range(terms))
        pi58=1/(Decimal(2)*Decimal(2).sqrt()/9801*s58)
        s37=sum(dec(coeff[n])*(1123+21460*n)*
                ((Decimal(-1)/(Decimal(882)**2))**n)
                for n in range(terms))
        pi37=4*Decimal(882)/s37
        print("terms",terms,"pi_58",str(pi58)[:48],
              "error_58",abs(pi58-pi_ref))
        print("terms",terms,"pi_37",str(pi37)[:48],
              "error_37",abs(pi37-pi_ref))
        if terms==3:
            assert abs(pi58-pi_ref) < Decimal("6e-24")
            assert abs(pi37-pi_ref) < Decimal("9e-18")

    # True positional base-396 conversion of the same independently
    # calculated pi; each fractional digit is an integer from 0 to 395.
    q=pi_ref-3
    digits=[]
    for _ in range(16):
        q*=396
        digit=int(q)
        assert 0 <= digit < 396
        digits.append(digit)
        q-=digit
    assert digits == [56,27,393,178,372,391,140,365,
                      391,68,224,132,58,252,32,75]
    print("PI BASE 396 fractional digits:",digits)

assert 396 == 4*99
assert 9801 == 99*99
assert 396**4 == 256*9801**2
assert 882 == 2*21**2
assert 73**2 - 37*12**2 == 1
assert 6**2 - 37 == -1
assert 73 == 6**2 + 37
assert 12 == 2*6
assert 37*73 == 2701
assert 145**2 - 37*24**2 == -287
assert (2*396+96)==888
assert (396+124)==520
assert (396+132)==528
assert (2*396+121)==913
print("PASS: same-cubic-recurrence theorem, 58/37 π approximations, base-396 π, Pell 37→73")
