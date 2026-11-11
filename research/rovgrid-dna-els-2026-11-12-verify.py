#!/usr/bin/env python3
"""Reproducible tests for DNA reverse-complement orbits and local Hebrew passage witnesses.
No Torah-wide scan or statistical-significance claim is made.
"""
from itertools import product
from math import lcm
import re

COMP = str.maketrans('ACGT','TGCA')
ALPHABET = 'ACGT'

def rc(s):
    return s.translate(COMP)[::-1]

def theory(n):
    fixed = 4**(n//2) if n % 2 == 0 else 0
    return (4**n + fixed)//2, fixed

for n in range(1,9):
    words = [''.join(t) for t in product(ALPHABET, repeat=n)]
    fixed = sum(rc(w) == w for w in words)
    classes = {min(w,rc(w)) for w in words}
    expected, expected_fixed = theory(n)
    assert (len(classes), fixed) == (expected, expected_fixed), n
    print(f'DNA n={n}: total={4**n}, fixed={fixed}, orbits={len(classes)}')

assert theory(4) == (136,16)
assert theory(5) == (512,0)
assert theory(6) == (2080,64)
assert 136 == 16*17//2
assert 2080 == 64*65//2 == lcm(520,160,208) == (8*20*26)//2
assert 1024-136 == 888
a = [(16**n+4**n)//2 for n in range(5)]
assert a == [1,10,136,2080,32896]
assert all(a[i+2] == 20*a[i+1]-64*a[i] for i in range(3))

HVAL=dict(zip('אבגדהוזחטיכלמנסעפצקרשת',
              [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
for x,y in {'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'}.items():
    HVAL[x] = HVAL[y]
value = lambda s: sum(HVAL[x] for x in s if x in HVAL)
assert [value(x) for x in ['עמית','מייק','רוב']] == [520,160,208]
assert value('עמיתמייקרוב') == 888
assert value('מיכאל') == 101 and value('בלייז') == 59
assert sum(ord(c)-64 for c in 'AMITMIKEROV') == 136

VERSES = {
    'Gen31:24': 'ויבא אלהים אל לבן הארמי בחלם הלילה ויאמר לו השמר לך פן תדבר עם יעקב מטוב עד רע',
    'Gen31:29': 'יש לאל ידי לעשות עמכם רע ואלהי אביכם אמש אמר אלי לאמר השמר לך מדבר עם יעקב מטוב עד רע',
}
def letters(s):
    return ''.join(re.findall(r'[א-ת]', s))

for v,start in [('Gen31:24',51),('Gen31:29',56)]:
    seq = letters(VERSES[v])
    indexes = [start + 3*j for j in range(4)]
    assert ''.join(seq[p-1] for p in indexes) == 'עמבר'
    assert [p for p in range(1,len(seq)-8)
            if ''.join(seq[p-1+3*j] for j in range(4)) == 'עמבר'] == [start]
    print(f'ELS {v}: letters={len(seq)}, positions={indexes}, skip=+3')

GEN26 = {
    '25': 'ויבן שם מזבח ויקרא בשם יהוה ויט שם אהלו ויכרו שם עבדי יצחק באר',
    '26': 'ואבימלך הלך אליו מגרר ואחזת מרעהו ופיכל שר צבאו',
    '27': 'ויאמר אלהם יצחק מדוע באתם אלי ואתם שנאתם אתי ותשלחוני מאתכם',
    '28': 'ויאמרו ראו ראינו כי היה יהוה עמך ונאמר תהי נא אלה בינותינו בינינו ובינך ונכרתה ברית עמך',
}
words = ' '.join(GEN26.values()).split()
positions = [12,20,28,36]
assert [words[p-1] for p in positions] == ['עבדי','מרעהו','באתם','ראו']
assert ''.join(words[p-1][0] for p in positions) == 'עמבר'
assert all(positions[i+1]-positions[i] == 8 for i in range(3))
print('WORD_HEAD Genesis26:25-28:', positions, 'skip=+8 words => עמבר')
print('ALL TESTS PASSED — no whole-Torah significance claim')
