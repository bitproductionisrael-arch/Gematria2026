#!/usr/bin/env python3
# Usage: pip install mpmath && python research/rovgrid-shaddai-constant-literal-scan-2026-11-17.py
# Literal overlapping substring search in fixed decimal/binary prefixes.
# Positions are one-based, beginning with the first digit after the decimal/binary point.
import json
from pathlib import Path
import mpmath as mp

N=100000
mp.mp.dps=N+100
values={
    "pi":mp.pi, "e":mp.e, "phi":(1+mp.sqrt(5))/2,
    "sqrt2":mp.sqrt(2), "sqrt3":mp.sqrt(3), "sqrt5":mp.sqrt(5),
    "sqrt37":mp.sqrt(37), "sqrt73":mp.sqrt(73), "sqrt888":mp.sqrt(888),
}
patterns="314 341 431 682 104 136 888 1024 2701 221 535 816 1256 1332 1480 420 144 288 528 640 494592 145008 144144 19440 20688 2208 2112 8160 1008".split()
binary_patterns="1010101010 0101010101 1110010001".split()
def occurrences(s,pattern):
    result=[];start=0
    while True:
        pos=s.find(pattern,start)
        if pos<0:return result
        result.append(pos+1)
        start=pos+1  # IMPORTANT: allow overlap

report={"N_decimal_each":N,"N_binary_each":N,
        "positions_1based":True,"patterns":patterns,"binary_patterns":binary_patterns,"constants":{}}
for key,x in values.items():
    dec=str(x).split(".")[1][:N]
    assert len(dec)==N,(key,len(dec))
    frac=x-mp.floor(x)
    bit_number=int(mp.floor(frac*(mp.mpf(2)**N)))
    bits=format(bit_number,f"0{N}b")
    assert len(bits)==N
    c={"decimal_prefix":dec[:55],"binary_prefix":bits[:55],
        "counts":{},"first_positions_1based":{},
        "binary_counts":{},"binary_first_positions_1based":{}}
    for p in patterns:
        matches=occurrences(dec,p)
        c["counts"][p]=len(matches)
        c["first_positions_1based"][p]=matches[0] if matches else None
    for p in binary_patterns:
        matches=occurrences(bits,p)
        c["binary_counts"][p]=len(matches)
        c["binary_first_positions_1based"][p]=matches[0] if matches else None
    report["constants"][key]=c
report["aggregate_counts"]={p:sum(r["counts"][p] for r in report["constants"].values()) for p in patterns}
report["aggregate_binary_counts"]={p:sum(r["binary_counts"][p] for r in report["constants"].values()) for p in binary_patterns}
assert report["aggregate_counts"]["314"]==888
assert report["aggregate_counts"]["341"]==913
assert report["aggregate_counts"]["682"]==894
assert report["aggregate_counts"]["494592"]==2
assert report["aggregate_binary_counts"]["1010101010"]==873
assert report["aggregate_binary_counts"]["0101010101"]==885
out=Path("shaddai-constants-100k-result.json")
out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("PASS: 9 constants × 100000 decimal digits and 100000 binary bits")
print("Decimal counts:",report["aggregate_counts"])
print("Binary counts:",report["aggregate_binary_counts"])
print("Detailed positions:",out)
