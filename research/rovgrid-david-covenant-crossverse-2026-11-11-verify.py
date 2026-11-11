#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""RovGrid: standalone arithmetic verification of cross-verse / lexicon findings.
Scope: selected quotations, not the exhaustive 62-verse subset scan.
No external dependencies; run: python research/rovgrid-david-covenant-crossverse-2026-11-11-verify.py
"""
from itertools import accumulate

ABC = 'אבגדהוזחטיכלמנסעפצקרשת'
RAW = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
G = dict(zip(ABC, RAW))
R = {x: i + 1 for i,x in enumerate(ABC)}
FINALS = dict(zip('ךםןףץ','כמנפצ'))

def letters(s):
    return [FINALS.get(x, x) for x in s if x in G or x in FINALS]

def gem(s):
    return sum(G[x] for x in letters(s))

def ordinal(s):
    return sum(R[x] for x in letters(s))

def small(s):
    return sum(sum(map(int,str(G[x]))) for x in letters(s))

def atbash_ordinal(s):
    return 23*len(letters(s))-ordinal(s)

def atbash(s):
    return sum(G[ABC[22-R[x]]] for x in letters(s))

def albam(s):
    return sum(G[ABC[(R[x]-1+11) % 22]] for x in letters(s))

def running_returning(s):
    p=list(accumulate(G[x] for x in letters(s)))
    return p[-1]+2*sum(p[:-1]) if p else 0

def assert_signature(s, g, o, k):
    got=(gem(s),ordinal(s),small(s))
    assert got==(g,o,k),(s,got,(g,o,k))
    print('PASS',s,'regular/ordinal/small =',got)

# Two independent textual contexts (not the entire verse):
for phrase in ['אני אהיה לו','איה חסדיך']:
    assert_signature(phrase,118,64,28)
for phrase in ['אמן ואמן','עבדי אמאס']:
    assert_signature(phrase,188,62,26)
for phrase in ['אנכי אדני יהוה','זבח כל הימים']:
    assert_signature(phrase,172,91,37)
assert_signature('ימד זרע דוד',345,84,39)
assert_signature('ילד זרע דויד',345,93,39)
assert_signature('ברוך יהוה אמן',345,93,39)
assert_signature('אהיה אשר אהיה משה',888,123,42)
assert gem('בריתי') == gem('כסא ישראל') == 622
assert (gem('כה אמר כסא ישראל'),ordinal('כה אמר כסא ישראל'),small('כה אמר כסא ישראל')) == (888,141,33)
assert gem('מי אני')==111
assert gem('מי אני יהוה')==137
assert ordinal('מי אני')==48
assert atbash_ordinal('ימד זרע דוד')==123
assert atbash_ordinal('ילד זרע דויד')==137
assert atbash_ordinal('ברוך יהוה אמן')==160
assert ordinal('אהיה אשר אהיה')==84
assert (gem('ברוך יהוה אמן')+7*gem('ואמן'))==1024

# Lexicon and independent bridges
s='מוחלט'
assert (gem(s),ordinal(s),running_returning(s),atbash(s),atbash_ordinal(s),albam(s))==(93,48,541,220,67,383)
assert (atbash(s),atbash_ordinal(s))==(gem('עד עולם'),ordinal('עד עולם'))==(220,67)
assert ordinal(s)==ordinal('מי אני')==48
assert running_returning(s)==gem('ישראל')==541
assert albam(s)==gem('הוא יקראני')==383
assert gem(s)==ordinal('ברוך יהוה אמן')==ordinal('ילד זרע דויד')==93

print('ALL PASS — verified arithmetic only. External Power-of-Bet alphabet maps excluded.')
