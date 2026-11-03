#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""RovGrid 2026-11-04 — reproducible arithmetic audit.
No external packages; does not infer causation/uniqueness from a gematria match.
Run: python3 research/rovgrid-self-map-2026-11-04-verify.py
"""
from math import gcd

HEB = dict(zip("אבגדהוזחטיכלמנסעפצקרשת", [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
FINAL = {"ך":"כ","ם":"מ","ן":"נ","ף":"פ","ץ":"צ"}
ORD = {c:i+1 for i,c in enumerate("אבגדהוזחטיכלמנסעפצקרשת")}
ATBASH = dict(zip("אבגדהוזחטיכלמנסעפצקרשת", "תשרקצפעסנמלכיטחזוהדגבא"))
ALBAM = dict(zip("אבגדהוזחטיכלמנסעפצקרשת","למנסעפצקרשתאבגדהוזחטיכ"))
# Greek/English variants below are explicitly local maps and not general-language claims.
ENG = {chr(65+i):i+1 for i in range(26)}
JEWISH_OVERRIDE = {"V":700,"O":50}
ISOPSEPHY_OVERRIDE = {"V":400,"O":60}
# Other Latin letters are A1Z26 when used in the displayed ABA VOICE OF GOD example.

def norm(s):
    return "".join(FINAL.get(c,c) for c in s if c not in " \n\t'׳״־")

def regular(s):
    return sum(HEB[c] for c in norm(s))

def ordinal(s):
    return sum(ORD[c] for c in norm(s))

def atbash_regular(s):
    return sum(HEB[ATBASH[c]] for c in norm(s))

def atbash_ordinal(s):
    return sum(ORD[ATBASH[c]] for c in norm(s))

def final_small(s):
    final_digits={"ך":5,"ם":6,"ן":7,"ף":8,"ץ":9}
    return sum(final_digits.get(c,HEB[norm(c)]%9 or 9) for c in s if c not in " \n\t")

def albam_regular(s):
    return sum(HEB[ALBAM[c]] for c in norm(s))

def eng_simple(s):
    return sum(ENG[c] for c in s.upper() if c in ENG)

def eng_small(s):
    return sum(((ENG[c]-1)%9)+1 for c in s.upper() if c in ENG)

def eng_atbash(s):
    return sum(27-ENG[c] for c in s.upper() if c in ENG)

def eng_building(s):
    # Word boundaries reset the prefix sum.
    return sum(sum(sum(ENG[c] for c in word[:i]) for i in range(1,len(word)+1))
               for word in s.upper().split())

def eng_map(s,overrides):
    return sum(overrides.get(c,ENG[c]) for c in s.upper() if c in ENG)

def q(n,b=10):
    return n*(b-n)

def mirror_number(n,b=10):
    return b*n + (b-n)

def n_A_build(n):
    return n*(n+1)//2

def n_A_add_sub(n):
    return n*(n+1)

def n_A_run_return(n):
    return n*n

def check():
    assert regular("הכל")==55
    assert regular("קול")==136 and ordinal("קול")==37
    assert regular("היכל")==regular("אדני")==65
    assert regular("כלי")==regular("הכלה")==60
    assert regular("כלה")==regular("האדמה")==55
    assert regular("אדמה")==regular("האדם")==regular("כל")==regular("לך")==50
    assert regular("אדם")==45 and regular("דם")==regular("מד")==44
    assert regular("אמת")==441==10*44+1==21**2
    assert regular("צלם")==regular("מייק")==regular("קיים")==160
    assert regular("אור")==regular("אין סוף")==207
    assert regular("אין סוף אור")==414
    assert regular("ין סוף אור")==413
    assert regular("א אור")==regular("רוב")==208
    assert final_small("ין סוף אור")==37
    assert albam_regular("ין סוף אור")==512
    assert regular("נקודה")==165==3*55
    assert regular("רוח האבן")==272==2*136
    assert regular("רוח אב בן")==269
    assert regular("ראו בן")==regular("ראובן")==regular("רוב אנ")==259
    assert regular("יראו בן")==regular("רוב אני")==regular("אני רוב")==269
    assert regular("אב")+regular("בן")==55
    assert regular("אבן")==53 and regular("האבן")==58
    assert atbash_regular("עמית רוב")==regular("אמת")==441
    assert ordinal("עמית")==regular("אני")==61
    assert ordinal("עמית מייק רוב")==141==regular("אפס")
    assert ordinal("הצלב")==37 and atbash_ordinal("הצלב")==55
    assert regular("אני הצלב")==188 and ordinal("אני הצלב")==62
    assert eng_simple("AMIT")==eng_simple("I AM T")==43
    assert eng_small("HEAVEN")==28 and eng_small("SPIRIT")==37
    assert eng_simple("HEAVEN")==55 and eng_simple("SPIRIT")==91
    assert eng_small("HEAVEN SPIRIT")==65 and eng_simple("HEAVEN SPIRIT")==146
    assert eng_simple("ABA")==4 and eng_atbash("ABA")==77==regular("מזל")
    assert eng_map("ABA VOICE OF GOD",JEWISH_OVERRIDE)==888
    assert eng_map("ABA VOICE OF GOD",ISOPSEPHY_OVERRIDE)==618
    assert eng_building("ABA VOICE OF GOD")==307
    assert eng_map("ABA GOD",JEWISH_OVERRIDE)==65
    assert eng_small("ABA GOD")==21
    assert sum(ENG[c]**2 for c in "ABAGOD")==296
    assert [mirror_number(i) for i in range(1,10)]==[19,28,37,46,55,64,73,82,91]
    for i in range(1,10):
        assert mirror_number(i)+mirror_number(10-i)==110
        assert mirror_number(i)*mirror_number(10-i)==1000+81*q(i)
    assert [q(i) for i in range(1,10)]==[9,16,21,24,25,24,21,16,9]
    assert sum(q(i) for i in range(1,10))==165
    assert sum(q(i)**2 for i in range(1,10))==3333
    assert sum(q(i)**2 for i in range(1,10))==(10**5-10)//30
    assert 37*73==2701==55**2-18**2==50*(8+20+26)+1
    assert 19*91==1729==8*216+1==1**3+12**3==9**3+10**3
    assert 136+296+408+888==1728==32*(8+20+26)
    assert 136*888==296*408
    assert 1**2+2**2+3**2+4**2+5**2==sum(range(1,11))==55
    assert [i for i in range(1,200) if sum(j*j for j in range(1,i+1))==sum(range(1,2*i+1))]==[5]
    for b in (6,8,10,12,16,20):
        for n in range(1,b):
            assert mirror_number(n,b)+mirror_number(b-n,b)==b*(b+1)
    assert n_A_build(8)==36 and 6*n_A_build(8)==216
    assert n_A_build(520)==135460 and 6*n_A_build(520)==812760
    assert n_A_add_sub(520)==270920 and n_A_run_return(520)==270400
    assert 65*n_A_build(8)==2340 and n_A_build(520)-2340==133120==64*2080
    assert 65*n_A_run_return(8)==4160 and n_A_run_return(520)==270400
    assert n_A_build(512)+n_A_build(8)+512*8==135460
    assert q(4)*mirror_number(3)==888
    # Rank-one outer product: M^2 = (v dot v) M.
    v=[q(i) for i in range(1,10)]
    m=[[a*b for b in v] for a in v]
    scalar=sum(x*x for x in v)
    assert scalar==3333
    assert sum(sum(row) for row in m)==165**2
    assert all(sum(m[i][k]*m[k][j] for k in range(9))==scalar*m[i][j]
               for i in range(9) for j in range(9))
    print("PASS — arithmetic checks, no external packages")

if __name__=="__main__":
    check()
