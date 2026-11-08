#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Map every fractional decimal digit's cube, S1/S2/S3 and F1000, for 9 constants."""
from math import comb
from pathlib import Path
import csv
import json
import mpmath as mp

N = 10000
CHECKPOINTS = [16,23,24,32,37,73,79,82,88,111,136,160,208,240,252,520,888,1024,2520,10000]
TARGETS = [136,160,208,520,888,1024,1496,2520,2701,4160,6888,17000,18496]
mp.mp.dps = 10080
CONSTANTS = {"pi":mp.pi, "e":mp.e, "phi":mp.phi,
             "sqrt2":mp.sqrt(2), "sqrt3":mp.sqrt(3), "sqrt5":mp.sqrt(5),
             "sqrt37":mp.sqrt(37), "sqrt73":mp.sqrt(73), "sqrt888":mp.sqrt(888)}
def fold(x):
    return 0 if x == 0 else 1 + (x - 1) % 999

r = {"index_base":1, "n_decimal_digits":N, "digit_cube_map":{str(d):d**3 for d in range(10)},
     "checkpoints":CHECKPOINTS, "targets":TARGETS, "constants":{}}
with Path("rovgrid_power_gimel_10000_every_digit.csv").open("w", encoding="utf-8", newline="") as f:
    w=csv.writer(f)
    w.writerow(["constant","fractional_index_1based","digit","digit_cube","S1_prefix","S2_prefix","S3_prefix","F1000_S3"])
    for name,x in CONSTANTS.items():
        s=str(x).split(".",1)[1][:N]
        assert len(s) == N
        p1,p2,p3=[0],[0],[0]
        for i,ch in enumerate(s,1):
            d=int(ch)
            p1.append(p1[-1]+d)
            p2.append(p2[-1]+d*d)
            p3.append(p3[-1]+d**3)
            w.writerow([name,i,d,d**3,p1[-1],p2[-1],p3[-1],fold(p3[-1])])
        r["constants"][name] = {
            "first_24_digits":s[:24],
            "prefix":{str(n):{"S1":p1[n],"S2":p2[n],"S3":p3[n],"F1000_S3":fold(p3[n])} for n in CHECKPOINTS},
            "hits":{str(t):{"positions":[i for i in range(1,N+1) if p3[i]==t]} for t in TARGETS},
            "first_16":[{"index":i,"digit":int(s[i-1]),"cube":int(s[i-1])**3,"prefix_S3":p3[i]} for i in range(1,17)]
        }
        if name=="pi":
            assert p2[82]==2701 and p2[79]==2520 and p3[144]==31080 and fold(p3[144])==111
        if name=="phi":
            assert p2[23]==888 and p2[82]==2520
        if name=="sqrt37":
            assert s[:3]=="082" and p3[3]==520

assert sum(range(1,17))==136
assert sum(i*i for i in range(1,17))==1496
assert sum(i**3 for i in range(1,17))==18496==136**2
assert 18496-1496==17000==136*125==17*1000
assert [(name,t,record["positions"]) for name,v in r["constants"].items()
        for t,record in v["hits"].items() if record["positions"]] == [("sqrt37","520",[3])]

Path("rovgrid_power_gimel_summary.json").write_text(
    json.dumps(r,ensure_ascii=False,indent=2), encoding="utf-8")
print("PASS: 90,000 digit rows; T16, historical P2/P3 checks and √37 hit")
