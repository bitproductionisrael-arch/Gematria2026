#!/usr/bin/env python3
"""Reproducible checks: two 8^3 cubes, names, Hebrew ciphers, star numbers, Genesis 1:1."""
from collections import Counter
from itertools import product
from math import isqrt

ALPHABET = "אבגדהוזחטיכלמנסעפצקרשת"
VALUES = dict(zip(ALPHABET, (1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400)))
ORDINAL = dict(zip(ALPHABET, range(1,23)))
FINALS = str.maketrans("ךםןףץ", "כמנפצ")
ATBASH = dict(zip(ALPHABET, ALPHABET[::-1]))
ALBAM = {c: ALPHABET[(i+11) % 22] for i,c in enumerate(ALPHABET)}
VERSE = "בראשית ברא אלהים את השמים ואת הארץ"

def norm(s):
    return "".join(c for c in s.translate(FINALS) if c in VALUES)

def gem(s, mode="regular", cipher=None):
    s = norm(s)
    if cipher is not None:
        s = "".join(cipher[c] for c in s)
    vals = VALUES if mode == "regular" else ORDINAL if mode == "ordinal" else {
        c: sum(map(int, str(v))) for c,v in VALUES.items()}
    return sum(vals[c] for c in s)

def final_gem(s):
    t = {"ך":500,"ם":600,"ן":700,"ף":800,"ץ":900}
    return sum(t[c] if c in t else VALUES[c] for c in s if c in VALUES or c in t)

def nth_prime(n):
    found = 0
    i = 1
    while found < n:
        i += 1
        if i >= 2 and all(i % d != 0 for d in range(2, isqrt(i)+1)):
            found += 1
    return i

def star(n):
    return 6*n*(n-1)+1

def triangular(n):
    return n*(n+1)//2

def build_cubes():
    shell = {}
    for x,y,z in product(range(4),repeat=3):
        c=(x,y,z)
        if all(v in (0,3) for v in c):
            shell[c]="M"
        elif x in (1,2) and y in (0,3) and z in (0,3):
            shell[c]="G"
        elif y in (1,2) and x in (0,3) and z in (0,3):
            shell[c]="R"
        elif any(v in (0,3) for v in c):
            shell[c]="B"
    assert len(shell)==56 and Counter(shell.values())==Counter({"B":32,"M":8,"R":8,"G":8})
    core_coords = sorted(set(product((1,2),repeat=3)))
    assert len(core_coords)==8
    layers = []
    for colors in (list("BMMRRRRG"), list("MMRRRRRR")):
        cube = dict(shell)
        cube.update(zip(core_coords, colors))
        assert len(cube)==64 and len(set(cube))==64
        layers.append(cube)
    assert Counter(layers[0].values())==Counter({"B":33,"M":10,"R":12,"G":9})
    assert Counter(layers[1].values())==Counter({"B":32,"M":10,"R":14,"G":8})
    total=Counter(layers[0].values())+Counter(layers[1].values())
    assert total==Counter({"B":65,"M":20,"R":26,"G":17})
    assert len(layers)*64*8 == 1024
    assert {p:layers[0][p] for p in shell}=={p:layers[1][p] for p in shell}
    return total

def verify():
    assert gem("עמית")==520 and gem("מייק")==160 and gem("רוב")==208
    assert 65+20+26+17==128 and 128*8==1024 and 520+160+208==888
    assert build_cubes()==Counter({"B":65,"M":20,"R":26,"G":17})
    assert [(gem(s,"ordinal",ATBASH),gem(s,"ordinal",ALBAM)) for s in ("עמר עליון","עמר תחתון")] == [(77,63),(63,77)]
    assert gem("עמר")==310 and gem("עמר","ordinal",ATBASH)==gem("עמר","regular",ATBASH)==20
    assert gem("עמר","ordinal",ALBAM)==gem("עמר","regular",ALBAM)==16
    assert all(VALUES[ATBASH[c]]<=10 and VALUES[ALBAM[c]]<=10 for c in "מנסעפצקרש")
    assert len(norm("מנסעפצקרש"))==9
    assert [gem("יון","regular",ATBASH),gem("יון","regular",ALBAM)]==[129,383]
    assert [gem("רוב","regular",ALBAM),gem("רוב","regular",ATBASH)]==[129,383]
    assert 129+383==512
    assert [gem(s) for s in ("מפת","שפע","יודהאויוהא")]==[520,450,54]
    assert len(norm("מפת שפע יודהאויוהא"))==16
    assert gem("מפת שפע יודהאויוהא")==1024
    assert gem("מפת שפע יודהאויוהא","ordinal")==160
    assert gem("מפת שפע יודהאויוהא","ordinal",ATBASH)==208
    assert gem("מפת שפע","regular",ATBASH)==gem("מפת שפע","ordinal",ATBASH)==32
    assert 3*520+3*450+10*54==3450
    phrase="מפץ גדול"
    assert len(norm(phrase))==7
    assert [gem(phrase),gem(phrase,"ordinal"),gem(phrase,"small")]==[253,73,37]
    assert [gem(phrase,"regular",ATBASH),gem(phrase,"ordinal",ATBASH)]==[421,88]
    assert [gem(phrase,"regular",ALBAM),gem(phrase,"ordinal",ALBAM)]==[206,62]
    assert final_gem(phrase)==1063 and final_gem("אבא מפץ")==1024
    assert nth_prime(82)==421
    assert len(norm(VERSE))==28 and gem(VERSE)==2701 and gem(VERSE,"small")==82
    assert star(3)==37 and star(4)==73
    assert star(3)==1+3*3*2+6*triangular(2)==37
    assert star(4)==1+3*4*3+6*triangular(3)==73
    assert triangular(7)==28 and 37*73==2701
    print("PASS | geometric tiling, 128 colored units, both shells, ciphers, 37/73/28/82/421/1024")
    print("NOT TESTED: 'מילוי מים'=888; source method not specified")
if __name__=="__main__":
    verify()
