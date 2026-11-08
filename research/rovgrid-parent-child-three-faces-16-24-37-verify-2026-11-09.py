#!/usr/bin/env python3
"""Reproduce parent/child name 3-face law, gematria and exhaustive 8-spelling audit.
No evidence of causality or historical necessity is claimed.
"""
from collections import Counter
from itertools import product
from fractions import Fraction
from math import isqrt
A='אבגדהוזחטיכלמנסעפצקרשת'
R=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
reg=dict(zip(A,R)); ordinal=dict(zip(A,range(1,23)))
for f,s in [('ך','כ'),('ם','מ'),('ן','נ'),('ף','פ'),('ץ','צ')]:
    reg[f]=reg[s]; ordinal[f]=ordinal[s]
def gem(text):
    chars=[c for c in text if c in reg]
    return sum(reg[c] for c in chars),sum(ordinal[c] for c in chars),sum((reg[c]-1)%9+1 for c in chars),len(chars)
def square(q):
    q=Fraction(q)
    return q.denominator==1 and isqrt(q.numerator)**2==q.numerator
def test():
    assert gem('אליהו')==(52,34,16,5)
    assert gem('עינבר')==(332,62,17,5)
    assert gem('עמית')==(520,61,16,4)
    assert gem('מייק רוב')==(368,80,17,7)
    assert gem('אליהו עינבר')==(384,96,33,10)
    assert gem('אליהו עינבר רוב')==(592,124,43,13)
    assert gem('עמית מייק רוב')==(888,141,33,11)
    assert (384,592,888)==(16*24,16*37,24*37)
    assert (Fraction(384*592,888),Fraction(384*888,592),Fraction(592*888,384))==(256,576,1369)
    assert 208==16*(37-24) and 296==37*(24-16)
    assert 2*(52+208)==520 and 16+24+37==77
    assert gem('אליהו')[2]==gem('עמית')[2]
    assert gem('עינבר')[2]==gem('מייק רוב')[2]
    parent,son=Counter('אליהועינבר'),Counter('עמיתמייקרוב')
    common=parent&son
    assert gem(''.join(common.elements()))==(298,64,19,6)
    assert gem(''.join((parent-common).elements()))==(86,32,14,4)
    assert gem(''.join((son-common).elements()))==(590,77,14,5)
    assert gem('אליהו ועינבר')==(390,102,39,11)
    assert gem('עמית מייק רוב')[3]==11
    hits=[]
    for father,mother,waw in product(['אליהו','אלי'],['עינבר','ענבר'],['','ו']):
        s=f'{father} {waw}{mother}'
        p=gem(s)[0]; b=p+208; c=888
        sides_squared=(Fraction(p*b,c),Fraction(p*c,b),Fraction(b*c,p))
        if all(map(square,sides_squared)):
            hits.append((s,p,b,sides_squared))
    assert hits==[('אליהו עינבר',384,592,(256,576,1369))],hits
    print('PASS: 8 spelling combinations, one integer cuboid, letter partition and small-gematria conservation')
    print(hits)
if __name__=='__main__':
    test()
