#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Independent reproducible arithmetic audit of initials and alternate spelling.
RovGrid 2026-11-10. Values follow the current calculator.html mappings.
No network access or dependencies needed.
"""
from math import factorial

LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
AGRIPPA = dict(zip(LETTERS,
    [1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500]))
CONSTANT_DIGITS = {
 "pi": "1415926535897932384626433832795028841971693993751058209",
 "e": "7182818284590452353602874713526624977572470936999595749",
 "phi": "6180339887498948482045868343656381177203091798057628621",
 "root2": "4142135623730950488016887242096980785696718753769480731",
 "root3": "7320508075688772935274463415058723669428052538103806280",
 "root5": "2360679774997896964091736687312762354406183596115257242",
 "golden9": "4376941012509463661587184907092569405172173817481342407",
 "root37": "0827625302982196889996842452020670620849700947864111864",
 "root73": "5440037453175311678716483262397064345944553295332822419",
 "root888": "7993288515026794386636320922479022804690433243624946761",
 "inv2701": "000370233246945575712699000370233246945575712699000370233246945575712699",
 "inv37": "027027027027027027027027027027027027027027027027027027027027",
 "inv73": "0136986301369863013698630136986301369863013698630136986301369863"
}
HEBREW = dict(zip("אבגדהוזחטיכלמנסעפצקרשת",
    [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))

def characters(s):
    return [c for c in s.upper() if c in LETTERS]

def ordinal(c):
    return LETTERS.index(c)+1

def extended(c):
    i=LETTERS.index(c)
    return i+1 if i < 9 else (i-8)*10 if i < 18 else (i-17)*100

def calculate(s):
    chars=characters(s)
    simp=sum(map(ordinal,chars))
    avg=sum(extended(LETTERS[ordinal(c)%26]) for c in chars)
    power={name:sum(int(digits[ordinal(c)-1]) for c in chars) for name,digits in CONSTANT_DIGITS.items()}
    return {"simple":simp, "sumerian":6*simp,
            "atbash":27*len(chars)-simp, "avgad":avg,
            "jewish":sum(AGRIPPA[c] for c in chars), "power":power}

EXPECTED = {
 "Amit M. R.": (74,444,88,512,250, [32,26,38,14,35,29,34,21,34,34,27,16,25]),
 "A. M. R.": (32,192,49,152,111, [16,12,22,12,18,15,19,10,17,21,14,7,10]),
 "Miik. Rov": (97,582,92,770,888, [38,33,45,30,42,46,35,34,30,31,35,30,27]),
}
for s,(simple,sumerian,atbash,avgad,jewish,constant_values) in EXPECTED.items():
    result=calculate(s)
    assert [result[k] for k in ("simple","sumerian","atbash","avgad","jewish")] == [simple,sumerian,atbash,avgad,jewish], s
    assert list(result["power"].values()) == constant_values, s

full=calculate("Amit Mike Rov")
abbrev=calculate("Amit M. R.")
initials=calculate("A. M. R.")
alternative=calculate("Miik. Rov")

assert full["simple"] == 136
assert full["jewish"] == 1024
assert alternative["jewish"] == 888
assert full["jewish"] - alternative["jewish"] == full["simple"] == 136
assert 2*(abbrev["avgad"]-abbrev["sumerian"]) == 136
assert abbrev["power"]["golden9"] == abbrev["power"]["root73"] == abbrev["power"]["root888"] == 34
assert 4*34 == 136
assert initials["simple"]**2 - 8*initials["jewish"] == 136
assert initials["jewish"] == 111
assert 8*111 == 888
assert abbrev["sumerian"] == 444 and 2*444 == 888
assert abbrev["avgad"] == 512 and 2*512 == 1024
assert initials["power"]["pi"] == 16 and abbrev["power"]["pi"] == 32
assert 16*32 == 512 and 32**2 == 1024

# For this site, Word Position × weights each letter by the number of letters in its word.
def word_position_simple(s):
    return sum(len(characters(w))*sum(ordinal(c) for c in characters(w)) for w in s.split())
assert word_position_simple("Miik Rov") == 333
assert 6*word_position_simple("Miik Rov") == 1998 == 37*54
assert 333 == 3*111
assert 111+333 == 444 and 111+333+444 == 888
assert alternative["avgad"] == 770 == 7*(37+73)
assert alternative["simple"] == 97
assert sum((ordinal(c)-1)%9+1 for c in characters("Miik Rov")) == 43
assert 43 == calculate("Amit")["simple"]

# The English cumulative alphabet is the sum of extended A..letter for EACH letter.
def cumulative(s):
    return sum(sum(extended(x) for x in LETTERS[:ordinal(c)]) for c in characters(s))
assert cumulative("Miik Rov") == 2555
assert factorial(7)//factorial(2) == 2520
assert 2555-2520 == alternative["power"]["golden9"] == alternative["power"]["inv2701"] == 35

def hebrew_regular(s):
    return sum(HEBREW[c] for c in s if c in HEBREW)
assert hebrew_regular("עמית מ. ר.") == hebrew_regular("מר.עמית") == 760
assert hebrew_regular("עמית מייק רוב") == 888
assert 888-760 == 128 == 8*16
assert 136-128 == 8
assert 760 == 8*95 and 888 == 8*111

assert 74**2 == 5476 == 37*148
assert (1024-888) == 136
print("PASS: 54 cipher/constant tests, doubled readings, 136 bridges, 37/111 ladder, permutations, cumulative, Hebrew contraction.")
