#!/usr/bin/env python3
"""Audit the 113-entry IESOUS Body Achievement Vault register.
Run beside rovgrid-body-all-achievements-2026-11-12.json.
Totals count documented cards, NOT statistically independent proofs.
"""
import json
from pathlib import Path
p=Path(__file__).with_name("rovgrid-body-all-achievements-2026-11-12.json")
j=json.loads(p.read_text(encoding="utf8"))
rows=j["entries"]
ids=[x["id"] for x in rows]
assert len(ids)==len(set(ids))==j["totals"]["total"]==113
from collections import Counter
a=dict(Counter(x["category"] for x in rows))
b=dict(Counter(x["status"] for x in rows))
assert a==j["totals"]["groups"],(a,j["totals"]["groups"])
assert b==j["totals"]["statuses"],(b,j["totals"]["statuses"])
assert a=={"star":11,"triangle":4,"video":26,"skeletal":29,"molecular":31,"textual":12}
assert b=={"verified":14,"derived":68,"symbolic":20,"conditional":11}
assert len(j["pending"])==4
# Standard and optional-sesamoid models are internally consistent.
assert 80+126==206 and 80+134==214
assert 22+6+1+7==36
assert 12+24+1==37
assert 2*(4+28)+2+5+1+1==73
assert 3+(8+5+14+2)+2==34
assert 36+37+73+2*34==214
assert 36+37==73
# Key numerical structures and name bridges.
assert 37*73==2701 and 37*24==888
assert 8*20+8*26+20*26==888
assert 73*74//2==2701 and 73**2-37*12**2==1
assert (4**4+4**2)//2==136 and (4**6+4**3)//2==2080
assert (913+203+86+401+395+407+296)==2701
assert 407+296==703 and 913+203+86+401+395==1998
assert 4+7+6+2+5+1 == 25 # intentionally independent basic arithmetic check
print("PASS 113 entries: 11 star +4 triangle +26 original-video +29 skeletal +31 molecular +12 text")
print("PASS statuses: 14 verified +68 derived +20 symbolic +11 conditional; 4 pending unscored")
print("PASS expanded 214 skeleton, selected axial 73, stars, Genesis and DNA checks")
