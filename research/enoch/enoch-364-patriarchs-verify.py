#!/usr/bin/env python3
# coding: utf-8
"""RovGrid / Enoch: verify the 22 patriarchs, 364-day cycles and port symmetries.
Only Python standard library. Run: python3 research/enoch/enoch-364-patriarchs-verify.py
"""
from math import gcd

HEBREW = "אבגדהוזחטיכלמנסעפצקרשת"
REGULAR_VALUES = [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
REGULAR = dict(zip(HEBREW, REGULAR_VALUES))
ORDINAL = {ch: i + 1 for i,ch in enumerate(HEBREW)}
FINAL = {"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"}
NAMES = [
    "אדם","שת","אנוש","קינן","מהללאל","ירד","חנוך","מתושלח","למך",
    "נח","שם","ארפכשד","שלח","עבר","פלג","רעו","שרוג","נחור","תרח",
    "אברהם","יצחק","ישראל"
]
IMAGE_REGULAR = [
    45,700,357,210,136,214,84,784,90,58,340,605,338,272,113,
    276,509,264,608,248,208,541
]
IMAGE_ORDINAL = [
    18,43,42,57,55,34,39,82,36,22,34,74,41,38,32,
    42,50,48,50,41,55,64
]
IMAGE_SMALL = [
    9,7,15,12,19,7,21,28,9,13,7,20,14,11,14,
    15,14,21,14,14,19,10
]

def letters(s):
    return [FINAL.get(ch,ch) for ch in s if ch.strip()]

def regular(s):
    return sum(REGULAR[ch] for ch in letters(s))

def ordinal(s):
    return sum(ORDINAL[ch] for ch in letters(s))

def small(s):
    return sum(int(str(REGULAR[ch]).rstrip("0")) for ch in letters(s))

assert len(NAMES) == 22
assert [regular(s) for s in NAMES] == IMAGE_REGULAR
assert [ordinal(s) for s in NAMES] == IMAGE_ORDINAL
assert [small(s) for s in NAMES] == IMAGE_SMALL

assert sum(map(regular,NAMES)) == 7000
assert sum(map(ordinal,NAMES)) == 997
assert sum(map(small,NAMES)) == 313
assert sum(map(regular,NAMES[:19])) == 6003
assert sum(map(regular,NAMES[19:])) == 997
assert sum(map(ordinal,NAMES[:4])) == 160
assert sum(map(ordinal,NAMES[4:19])) == 677
assert sum(map(ordinal,NAMES[19:])) == 160

assert regular("חנוך") == 84
assert NAMES[6] == "חנוך"
assert 7000 == 19*364 + regular("חנוך")
assert 7000 % 364 == 84
assert 7000 % 365 == 65
assert 7000 == 1000*7

assert regular("אברם") == 243
assert regular("אברהם") == 248
assert regular("יעקב") == 182
assert regular("ישראל") == 541
assert regular("אברהם")-regular("אברם") == 5
assert regular("ישראל")-regular("יעקב") == 359
assert 5+359 == 364
assert 7000-364 == 6636

assert regular("יצחק") == 8*26 == 208
assert regular("יעקב") == 7*26 == 182
assert regular("יוסף") == 6*26 == 156
assert regular("אברה") == regular("רוב") == 208
assert ordinal("יצחק") == 55

# Qumran 364-day schematic calendar.
MONTH_DAYS = [30,30,31]*4
PORTALS = [4,5,6,6,5,4,3,2,1,1,2,3]
DAY_PARTS = [10,11,12,11,10,9,8,7,6,7,8,9]
NIGHT_PARTS = [18-d for d in DAY_PARTS]
assert len(MONTH_DAYS)==len(PORTALS)==len(DAY_PARTS)==12
assert sum(MONTH_DAYS) == 364
assert [sum(MONTH_DAYS[i:i+3]) for i in (0,3,6,9)] == [91]*4
assert 364 == 4*91 == 2*182 == 52*7 == 14*26
assert 91 == regular("אמן") == regular("יהוה")+regular("אדני")
assert 182 == regular("יעקב")
for i in range(6):
    assert PORTALS[i] + PORTALS[i+6] == 7
    assert DAY_PARTS[i] + DAY_PARTS[i+6] == 18
assert sum(DAY_PARTS) == sum(NIGHT_PARTS) == 108
assert sum(DAY_PARTS)+sum(NIGHT_PARTS)==216

# 24 priestly weekly courses meet 52 weeks after LCM(24,52)=312 weeks, or six years.
def lcm(a,b): return a*b//gcd(a,b)
assert lcm(24,52) == 312
assert 6*364 == 312*7 == 24*13*7 == 2184
assert 294 == 49*6
assert 294*364 == 107016
assert (294*364)//7 == 24*637 == 24*49*13
assert (294*364) % (24*7) == 0

# Idealized three-year lunar model, not actual astronomical months.
assert 3*364 == 37*29 + 19 == 19*30 + 18*29 == 1092
assert 6*364 == 2184

# Greek gematria, input-based operator comparisons (not proof of historical connection).
assert 808+80 == 888
assert 16+8 == 24
assert (10+3+800)+(2*80) == 973
assert (10+3+8)+(2*8) == 37
assert 973-888 == regular("פה") == 85
assert 37-24 == regular("אחד") == 13
assert regular("פה")+regular("אחד") == regular("חץ") == 98
assert 2*regular("פ") == regular("מייק") == 160

# 328->888 because of ם final in the five documented phrases (one control).
FINAL_VALUES = {"ך":500, "ם":600, "ן":700, "ף":800, "ץ":900}
def final_gematria(s):
    return sum(FINAL_VALUES.get(ch, REGULAR.get(ch,0)) for ch in s)
for phrase in ["רחם יסוד","ברוח יהוה אלהים","אלהינו עולם ועד","יראה יהוה אלהים"]:
    assert regular(phrase)==328
    assert final_gematria(phrase)==888
assert regular("אור ללא כלי")==final_gematria("אור ללא כלי")==328

def isprime(n):
    if n<2:return False
    for k in range(2,int(n**0.5)+1):
        if n%k==0:return False
    return True

def prime_index(n):
    return sum(isprime(k) for k in range(2,n+1))
for p,idx in [(313,65),(677,123),(997,168)]:
    assert isprime(p) and prime_index(p)==idx

print("OK — 22 names, 7000/997/313, Enoch=84, names +364, 4 quarters, gates, 6/294-year cycles, 328->888.")
for label,value in [
 ("sum regular",sum(map(regular,NAMES))),
 ("sum ordinal",sum(map(ordinal,NAMES))),
 ("sum small",sum(map(small,NAMES))),
 ("7000 mod 364",7000%364),
 ("six-year days",6*364),
 ("294-year days",294*364),
]:
    print(f"{label}: {value}")
