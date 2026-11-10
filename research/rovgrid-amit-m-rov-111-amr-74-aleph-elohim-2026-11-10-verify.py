#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Independent audit of Amit M Rov / Amit M R and three Hebrew gate phrases.
Definitions copied as maps from calculator.html on 2026-11-10.
"""
import math
ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
AGR = dict(zip(ALPHA, [1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500]))
HEB = dict(zip("אבגדהוזחטיכלמנסעפצקרשת",
               [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
FIN = {'ך':('כ',500),'ם':('מ',600),'ן':('נ',700),'ף':('פ',800),'ץ':('צ',900)}
MILUI = dict(zip("אבגדהוזחטיכלמנסעפצקרשת",
["אלף","בית","גימל","דלת","הא","ויו","זין","חית","טית","יוד","כף","למד","מם","נון","סמך","עין","פא","צדי","קוף","ריש","שין","תיו"]))
# Note: thence ף is normalized to פ for milui, and ם to מ.

def alpha(s):
    return [c for c in s.upper() if c in ALPHA]

def simple(s):
    return sum(ALPHA.index(c)+1 for c in alpha(s))

def agr(s):
    return sum(AGR[c] for c in alpha(s))

def extended(c):
    i=ALPHA.index(c)
    return (i+1) if i<9 else (i-8)*10 if i<18 else (i-17)*100

def avgad(s):
    return sum(extended(ALPHA[(ALPHA.index(c)+1)%26]) for c in alpha(s))

def regular(s, finals=False):
    return sum((FIN[c][1] if finals else HEB[FIN[c][0]]) if c in FIN else HEB.get(c,0) for c in s)

def small(s, finals=False):
    return sum((v-1)%9+1 for c in s if (v:= (FIN[c][1] if finals else HEB[FIN[c][0]]) if c in FIN else HEB.get(c,0)))

def digit_root(n):
    return 0 if n==0 else 1+(n-1)%9

def reduced_finals(s):
    return sum(digit_root(small(w,True)) for w in s.split())

def expand(s):
    return ' '.join(''.join(MILUI.get(FIN[c][0] if c in FIN else c,'') for c in w) for w in s.split())

def milui_value(s):
    return regular(expand(s))

def letters(s):
    return sum(c in HEB or c in FIN for c in s)

# The crucial distinction: R is not Rov.
assert simple("Amit M Rov")==111 and simple("Amit M R")==74
assert 6*simple("Amit M Rov")==666 and 6*simple("Amit M R")==444
assert simple("Rov")-simple("R")==37
assert 666-444==222==4*10+4*13+10*13==6*37
assert agr("Amit M Rov")==1000 and agr("Amit M R")==250
assert avgad("Amit M R")==512
assert simple("A M R")==32 and 6*simple("A M R")==192
assert 444+222==666 and 666+222==888
assert 74==2*37 and 111==3*37 and 148==4*37
assert 444==2*222 and 666==3*222 and 888==4*222

# Base phrases in standard Hebrew.
assert regular("את")==401
assert regular("אלף")==111
assert regular("אלהים")==86
assert regular("בראשית")==913
assert regular("את אלף")==512
assert regular("את אלף את")==913
assert regular("את אלף את אלף")==1024
assert regular("את אלהים את")==888
assert 1024-913==111 and 913-888==25 and 111+25==136
assert 111-86==25 and 1024-888==136
assert regular("את אלף")==avgad("Amit M R")==512
assert regular("את אלהים את")==2*6*simple("Amit M R")==888
assert regular("את אלף את אלף")==2*avgad("Amit M R")==1024

# All six user's outputs for 'את אלהים את':
s="את אלהים את"
assert [regular(s),regular(s,True),small(s,True),reduced_finals(s),small(s),milui_value(s)] == [888,1448,26,17,24,1345]
assert 24*37==888 and 17*8==136 and 26+17==simple("Amit")==43
assert regular(s,True)-regular(s)==560  # ם=600 instead of מ=40
assert letters(s)==9 and letters(expand(s))==25
assert regular("את אלף את")-regular(s)==25
assert regular("תשע עשרה")==milui_value(s)==1345

# Milui secondary observations; no alternative spellings substituted.
assert milui_value("את אלף")==793==13*61
assert milui_value("את אלף את")==1320==24*55
assert milui_value("את אלף את אלף")==1586==26*61
assert letters(expand("את אלף את אלף"))==28
assert small("את אלף את אלף")==34
assert reduced_finals("את אלף את אלף")==16
assert letters("בראשית ברא אלהים את השמים ואת הארץ")==28

print("PASS: name distinctions, 512 gate, 888 / 913 / 1024 ladder, all six Hebrew methods, regular milui, expanded-letter counts.")
