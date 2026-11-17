#!/usr/bin/env python3
# 2026-11-17. Reproduce direct finite-prefix observations (not the external 1B digit web search).
# pip install mpmath
from itertools import permutations
from collections import defaultdict
import mpmath as mp

N=100000
mp.mp.dps=N+110
V={
 "pi":mp.pi,"e":mp.e,"phi":(1+mp.sqrt(5))/2,
 "sqrt2":mp.sqrt(2),"sqrt3":mp.sqrt(3),"sqrt5":mp.sqrt(5),
 "sqrt37":mp.sqrt(37),"sqrt73":mp.sqrt(73),"sqrt888":mp.sqrt(888),
}
D={k:str(v).split(".")[1][:N] for k,v in V.items()}
assert all(len(x)==N for x in D.values())

def findall(s,p):
 out=[];i=0
 while True:
  j=s.find(p,i)
  if j<0:return out
  out.append(j+1) # 1-based first decimal place
  i=j+1 # overlaps allowed

cnt={k:len(findall(s,"676")) for k,s in D.items()}
assert cnt=={
 "pi":107,"e":104,"phi":85,"sqrt2":99,"sqrt3":123,
 "sqrt5":94,"sqrt37":106,"sqrt73":100,"sqrt888":104
}
assert sum(cnt.values())==922
repeated=defaultdict(list)
for k,s in D.items():
 for n in findall(s,"676"):repeated[n].append(k)
same={n:ks for n,ks in repeated.items() if len(ks)>1}
assert same=={
 66060:["e","sqrt73"],90095:["e","sqrt2"],
 33788:["sqrt5","sqrt73"],63835:["sqrt37","sqrt888"]
}
assert {k:findall(s,"258528") for k,s in D.items() if findall(s,"258528")}=={
 "phi":[90504,97624],"sqrt3":[30240],"sqrt5":[8791],"sqrt73":[86493]
}
assert {k:findall(s,"528258") for k,s in D.items() if findall(s,"528258")}=={
 "pi":[76909]
}
three_digit_rotations=[''.join(t) for t in permutations("258")]
six_digit_patterns={a+b for a in three_digit_rotations for b in three_digit_rotations}
counts={p:sum(len(findall(s,p)) for s in D.values()) for p in six_digit_patterns}
assert len(counts)==36 and counts["258528"]==5
assert [p for p in counts if counts[p]==max(counts.values())]==["258528"]
assert counts["285258"]==3 and counts["528825"]==3
assert D["pi"][76889-1:76889+2]=="676"
assert D["pi"][76909-1:76909+5]=="528258"
assert D["phi"][90483-1:90483+2]=="676"
assert D["phi"][90504-1:90504+5]=="258528"
assert D["sqrt3"][30265-1:30265-1+6]=="160888"
assert D["sqrt5"][8835-1:8835+2]=="208"
assert D["sqrt73"][86448-1:86448+2]=="314"
assert 258==6*43 and 528==6*88
assert 258528//6==43088 and 528258//6==88043

# Independent 1M decimal prefix of pi: the six name permutations.
mp.mp.dps=1_000_080
pi=str(mp.pi).split(".")[1][:1_000_000]
assert len(pi)==1_000_000 and pi[:32]=="14159265358979323846264338327950"
names=["520","160","208"]
perms=[''.join(items) for items in permutations(names)]
assert all(findall(pi,s)==[] for s in perms)
assert findall(pi,"528258")==[76909,385766]
print("PASS 9 constants * 100k: 676 counts and exact matches, 258528 highest of 36 permutations.")
print("PASS 1 million pi digits: six permutations of 520 160 208 absent in this smaller sample; reversed 528258 twice.")
print("1B pi browser search is a different data source and NOT independently certified by this script.")
