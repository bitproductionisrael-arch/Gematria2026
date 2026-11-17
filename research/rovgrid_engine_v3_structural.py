"""ROVGRID v3 structural research implementation (Python 3, stdlib only).

Mathematical scope: verified e, π, φ and sqrt(5) computations; one exact
Fibonacci-Cassini -> π arctan telescoping identity; independently evaluated
Chudnovsky d=163 and Ramanujan-Sato/Heegner d=67 π series.

This is a mathematical reference, NOT a validated fault-tolerant hardware system.
All Decimal methods return numeric approximations with guard digits.
"""
from __future__ import annotations

from decimal import Decimal, localcontext
from fractions import Fraction
from math import ceil
from dataclasses import dataclass


def fibonacci_triplet_safe(k: int) -> tuple[int, int, int]:
    # Explicitly derived from the recurrence, removing any index ambiguity.
    if k < 2:
        raise ValueError("k must be at least 2")
    a, b = 0, 1
    for _ in range(k):
        a, b = b, a + b
    return a, b-a, 2*a-b


def cassini_signed(k: int) -> int:
    fk, fm1, fm2 = fibonacci_triplet_safe(k)
    return fk*fm2 - fm1*fm1


def fibonacci_golden_pair(k: int) -> tuple[Fraction, Fraction]:
    fk, prev, _ = fibonacci_triplet_safe(k)
    phi = Fraction(fk, prev)
    return phi, 2*phi - 1  # (sqrt5 ≈ 2phi−1) with rational-only arithmetic


def fibonacci_arctan_tail_bound(m: int) -> Fraction:
    """Strict magnitude bound for π minus the uncorrected arctan partial sum."""
    if m < 1:
        raise ValueError("m>=1")
    f, _, _ = fibonacci_triplet_safe(2*m+2)
    return Fraction(4, f) # exact error = 4 atan(1/f) < 4/f


def _atan_decimal(x: Decimal, precision: int) -> Decimal:
    """Arctan Taylor for 0<=x<=1/2 with alternating-series next-term bound."""
    if not (0 <= x <= Decimal('0.5')):
        raise ValueError("arctan implementation supports 0<=x<=0.5")
    eps = Decimal(10) ** (-(precision-4))
    s = Decimal(0)
    power = x
    x2 = x*x
    n = 0
    while True:
        v = power / (2*n+1)
        s += v if n % 2 == 0 else -v
        n += 1
        power *= x2
        if abs(power/(2*n+1)) < eps:
            return +s


def pi_fibonacci(m: int = 1, precision: int = 80) -> Decimal:
    """Exact identity π=4[sum_{j=1}^m atan(1/F_(2j+1)) + atan(1/F_(2m+2))].
    The numerical arctans are evaluated with explicit alternating next-term cutoff.
    """
    if m < 1 or precision < 20:
        raise ValueError("m>=1, precision>=20")
    with localcontext() as ctx:
        ctx.prec = precision + 20
        s = Decimal(0)
        for j in range(1, m+1):
            f, _, _ = fibonacci_triplet_safe(2*j+1)
            s += _atan_decimal(Decimal(1)/f,ctx.prec)
        tail, _, _ = fibonacci_triplet_safe(2*m+2)
        s += _atan_decimal(Decimal(1)/tail,ctx.prec)
        ctx.prec = precision
        return +(4*s)


def e_interval(a: int, b: int, alternating: bool) -> tuple[int, int]:
    """Binary split with *factorial-chain* denominators, not plain fractions.

    Return P,Q representing sum_{k=a}^{b-1} sign(k)/[a*(a+1)*...*k]
    (with factor 0 replaced by 1). Merge: P=P_left*Q_right+P_right,
    Q=Q_left*Q_right. When a=0 this is sum sign(k)/k!.
    """
    if b-a==1:
        return (-1 if alternating and a%2 else 1), max(a,1)
    if a >= b:
        raise ValueError("nonempty interval required")
    mid=(a+b)//2
    pl,ql=e_interval(a,mid,alternating)
    pr,qr=e_interval(mid,b,alternating)
    return pl*qr+pr,ql*qr


def e_terms_for_digits(digits: int, guard: int = 15) -> int:
    """Conservative factorial-tail rule; ensures 8/M! < 10^-(digits+guard)."""
    target=8 * 10**(digits+guard)
    m=2
    fact=2
    while fact<=target:
        m+=1
        fact*=m
    return m


@dataclass(frozen=True)
class EulerLock:
    e: Decimal
    inverse_e: Decimal
    residual: Decimal
    terms: int
    within_tolerance: bool


def euler_pair(precision: int = 500, terms: int | None = None) -> EulerLock:
    if terms is None:
        terms=e_terms_for_digits(precision)
    if terms < 2:
        raise ValueError("terms>=2")
    p,q=e_interval(0,terms,False)
    pa,qa=e_interval(0,terms,True)
    with localcontext() as ctx:
        ctx.prec=precision+35
        e=Decimal(p)/q
        inv=Decimal(pa)/qa
        residual=abs(e*inv-1)
        passed=residual < Decimal(10)**(-precision)
        return EulerLock(+e,+inv,+residual,terms,passed)


def e_continued_fraction(k: int) -> Fraction:
    """Convergent index k=1 => 3/1, k=2 => 8/3; k>=1."""
    if k < 1:
        raise ValueError("k>=1")
    pm2,pm1=0,1
    qm2,qm1=1,0
    for j in range(k+1):
        if j==0:
            a=2
        elif j%3==2:
            a=2*((j+1)//3)
        else:
            a=1
        p=a*pm1+pm2
        q=a*qm1+qm2
        pm2,pm1=pm1,p
        qm2,qm1=qm1,q
    return Fraction(pm1,qm1)


def pi_chudnovsky(precision: int = 500, terms: int | None = None) -> Decimal:
    """d=163 / 640320³ / sqrt10005, not d=67."""
    if terms is None:
        terms=ceil((precision+20)/14.18)+2
    with localcontext() as ctx:
        ctx.prec=precision+40
        term=Decimal(1)
        summed=Decimal(0)
        denom=Decimal(640320)**3
        for k in range(terms):
            summed += term*(13591409+545140134*k)
            ratio_numer=1
            for i in range(1,7):
                ratio_numer*=6*k+i
            ratio_denom=(3*k+1)*(3*k+2)*(3*k+3)*(k+1)**3
            term *= -Decimal(ratio_numer)/(Decimal(ratio_denom)*denom)
        value=Decimal(426880)*Decimal(10005).sqrt()/summed
        ctx.prec=precision
        return +value


def pi_heegner67(precision: int = 500, terms: int | None = None) -> Decimal:
    """2026 proved Ramanujan-Sato d=67 formula, direct sqrt330, no Δ2 register.

    1760 sqrt(330)/π = sum (10177 + 261702n) t(n), with
    t(0)=1, t(n+1)/t(n)= -24(6n+1)(2n+1)(6n+5) / [5280³(n+1)³].
    """
    if terms is None:
        terms=ceil((precision+20)/7.93)+2
    with localcontext() as ctx:
        ctx.prec=precision+40
        term=Decimal(1)
        summed=Decimal(0)
        den=Decimal(5280)**3
        for n in range(terms):
            summed += term*(10177+261702*n)
            term *= -Decimal(24*(6*n+1)*(2*n+1)*(6*n+5))/(den*(n+1)**3)
        value=Decimal(1760)*Decimal(330).sqrt()/summed
        ctx.prec=precision
        return +value


def pi_67_wrong_variant(precision: int = 40, terms: int = 5) -> Decimal:
    """Reproduce (do not use) user's unverified 154865/6314415 5280 formula."""
    with localcontext() as ctx:
        ctx.prec=precision+25
        sum_=Decimal(0)
        num=Decimal(1)
        den=Decimal(1)
        for k in range(terms):
            if k:
                for i in range(1,7):
                    num *= 6*(k-1)+i
                den *= (3*k-2)*(3*k-1)*(3*k) * k**3 * Decimal(5280)**3
            sum_ += Decimal((-1)**k)*num*(154865+6314415*k)/den
        return +(12*sum_/((Decimal(5280)**3).sqrt()))


if __name__ == '__main__':
    from decimal import Decimal
    P=120
    a=pi_fibonacci(m=1,precision=P)
    b=pi_heegner67(precision=P)
    c=pi_chudnovsky(precision=P)
    print('Fibonacci pi:',str(a)[:85])
    print('Heegner 67 pi:',str(b)[:85])
    print('Chudnovsky pi:',str(c)[:85])
    print('Max 3-way difference:',max(abs(a-b),abs(a-c),abs(b-c)))
    result=euler_pair(precision=500)
    print('Euler terms:',result.terms,'residual exponent:',result.residual.adjusted(),'passed:',result.within_tolerance)
    print('Fibonacci k=47 Cassini:',cassini_signed(47),'φ,√5:',fibonacci_golden_pair(47))