# -*- coding: utf-8 -*-
"""Independent deterministic verification for RG-SY-43-44-11-20261106."""
HEB = dict(zip("אבגדהוזחטיכלמנסעפצקרשת", [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
HEB.update({"ך":20,"ם":40,"ן":50,"ף":80,"ץ":90})
def heb(s): return sum(HEB[c] for c in s if c in HEB)
def eng(s): return sum(ord(c)-64 for c in s.upper() if "A" <= c <= "Z")
def count(s): return [len(x) for x in s.split()]
assert count("עמית מייק רוב") == [4,4,3]
assert count("Amit Mike Rov") == [4,4,3]
assert sum(count("עמית מייק רוב")) == 11
assert eng("Amit") == 43
assert (heb("יהוה"), heb("חי"), heb("יהוה חי")) == (26,18,44)
assert (heb("טוב"), heb("אלהים"), heb("יחידה")) == (17,86,37)
assert 14+10+10+8+1 == 43
assert 43+1 == 44
assert 4+5 == 9
assert 11*4 == 44
assert 11*4-1 == 43
assert 8+16 == 24
assert (8+16)*37 == 888
assert heb("עמית מייק רוב") == 888
assert eng("Amit Mike Rov") == 136
assert heb("השם") == heb("משה") == 345
assert [4,9,11,48,11,9,4] == list(reversed([4,9,11,48,11,9,4]))
assert sum([4,9,11,48,11,9,4]) == 96
print("PASS: 43/44/11/24/888 arithmetic and bilingual name-letter count")
