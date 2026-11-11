#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""RovGrid / 11 Nov 2026 — portable 432/777/888 independent arithmetic verification."""
from collections import Counter
from math import prod
ABC = 'אבגדהוזחטיכלמנסעפצקרשת'
RAW = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
G = dict(zip(ABC,RAW))
F = dict(zip('ךםןףץ','כמנפצ'))
O = {c:i+1 for i,c in enumerate(ABC)}
M = {'י':'יוד','ה':'הא','ו':'ויו'}
def letters(s):
    return [F.get(c,c) for c in s if c in G or c in F]
def reg(s):
    return sum(G[c] for c in letters(s))
def ordinal(s):
    return sum(O[c] for c in letters(s))
def small(s):
    return sum(int(d) for c in letters(s) for d in str(G[c]))
def milui(s, m):
    return sum(reg(m[c]) for c in letters(s))
def check(s,g,o,k):
    got = (reg(s),ordinal(s),small(s))
    assert got == (g,o,k), (s,got,(g,o,k))
    print('PASS',s,got)

cycle = 'י יה יהו יהוה יהוה יהו יה י'
triple = ' '.join([cycle]*3)
assert Counter(letters(cycle)) == Counter({'י':8,'ה':8,'ו':4})
assert (reg(cycle), ordinal(cycle), small(cycle), milui(cycle,M)) == (144,144,72,296)
assert (reg(triple), ordinal(triple), small(triple), milui(triple,M)) == (432,432,216,888)
assert len(triple.split()) == 24
assert 888 - 2*432 == reg('דויד') == 24
assert reg('קדם') == 144 and reg('צור') == 296

check('ביתך',432,45,9)
check('בייית',432,54,9)
check('איש פלאי',432,72,18)
assert milui('בייית',{'ב':'בית','י':'יוד','ת':'תיו'}) == 888
assert milui('איש פלאי',{'א':'אלף','י':'יוד','ש':'שין','פ':'פא','ל':'למד'}) == 777

assert reg('שלמות א') == 777 == 7*111
assert reg('שלמות אלפא') == 888 == 8*111
assert reg('אלפא') - reg('א') == 111
assert reg('ביתך') + reg('משה') == 777
assert reg('ביתך') + reg('ימד זרע דוד') + reg('מי אני') == 888
assert prod((21,12,13,6,22,1)) == 432432 == 432*1001
assert 1001 == 7*11*13

assert reg('עולם ועד בשחק נאמן') == 777  # Ps 89:38
assert reg('יהוה אתה הוא האלהים ודבריך') == 777  # 2 Samuel 7:28
assert reg('מי אני יהוה') == 137  # 1 Chronicles 17:16
assert (reg('כה אמר כסא ישראל'),ordinal('כה אמר כסא ישראל'),small('כה אמר כסא ישראל')) == (888,141,33)
assert (reg('אני אהיה לו'),ordinal('אני אהיה לו'),small('אני אהיה לו')) == (118,64,28)
assert (reg('איה חסדיך'),ordinal('איה חסדיך'),small('איה חסדיך')) == (118,64,28)
print('ALL PASS: arithmetic verified; interpretive meaning remains separate.')
