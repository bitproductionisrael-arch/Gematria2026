#!/usr/bin/env python3
"""Verify RovGrid positional concatenation, decimal carries, and name variants."""
from math import isqrt

ALPHABET="אבגדהוזחטיכלמנסעפצקרשת"
VALUES=list(range(1,10))+list(range(10,100,10))+list(range(100,500,100))
REG=dict(zip(ALPHABET, VALUES))
REG.update({s:REG[b] for s,b in zip("ךםןףץ","כמנפצ")})

def hebrew(s):
    return sum(REG.get(c,0) for c in s)

def english(s):
    return sum(ord(c.upper())-64 for c in s if c.isalpha())

def add_base10(nums):
    result=sum(nums)
    last_power=max(len(str(n)) for n in nums)+2
    carry=0
    history=[]
    for p in range(last_power):
        raw=sum((n//(10**p))%10 for n in nums)
        total=raw+carry
        digit=total%10
        carry_next=total//10
        history.append(dict(power=p,raw_column_sum=raw,incoming_carry=carry,digit=digit,outgoing_carry=carry_next))
        carry=carry_next
    assert sum(x["digit"]*10**x["power"] for x in history)==result
    assert carry==0
    return result,history,sum(x["outgoing_carry"] for x in history)

assert [hebrew(s) for s in ("עמית","מייק","רוב","מיכאל","בלייז")]==[520,160,208,101,59]
assert [english(s) for s in ("Amit","Mike","Rov","Michael","Blaze")]==[43,38,55,51,46]
assert add_base10([520,160,208])[0::2]==(888,0)
assert add_base10([520,101,59,208])[0::2]==(888,1)
assert add_base10([43,38,55])[0::2]==(136,2)
assert add_base10([43,51,46,55])[0::2]==(195,2)
# Jewish/Agrippa values grounded in the established RovGrid corpus.
assert add_base10([140,54,830])[0::2]==(1024,2)
assert 1024-136==888
assert [sum((n//(10**p))%10 for n in (520,160,208)) for p in [2,1,0]]==[8,8,8]
assert [hebrew("עמית"),hebrew("מייק"),hebrew("רוב")]==[520,160,208]
assert 5*10**2+2*10==2*16**2+8==20**2+6*20==520
assert sum([120,136])==256
assert add_base10([120,136])[2]==0
assert 136+3*120==496
assert add_base10([136,360])[2]==0
assert 256*2==8*8*8
assert 195-136==59
for title, parts in [
    ("Hebrew short", [520,160,208]),
    ("Hebrew full", [520,101,59,208]),
    ("English Simple short", [43,38,55]),
    ("English Simple full", [43,51,46,55]),
    ("English Jewish short", [140,54,830]),
    ("T15+T16", [120,136]),
    ("T16+3xT15", [136,360]),
]:
    total, cols, carries=add_base10(parts)
    print(title, " + ".join(map(str,parts)),"=",total,"carries=",carries)
    for x in cols:
        if x["raw_column_sum"] or x["incoming_carry"] or x["outgoing_carry"]:
            print("  ",x)
print("PASS: positional names and zero/carry tests")
