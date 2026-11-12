#!/usr/bin/env python3
"""Verify nested centered square anatomy and distinct 55-bone sets."""
from math import comb
spine_t={f"T{i}" for i in range(1,13)}
spine_rest={f"C{i}" for i in range(1,8)}|{f"L{i}" for i in range(1,6)}|{"sacrum","coccyx"}
spine=spine_t|spine_rest
sternum={"sternum"}
L={f"left-rib-{i}" for i in range(1,13)}
R={f"right-rib-{i}" for i in range(1,13)}
girdle={"left-clavicle","left-scapula","right-clavicle","right-scapula"}
C=spine_t|sternum
A3=C
A4=C|L
A5=C|L|R|girdle
X=A5|spine_rest
centered_square=lambda n:n*n+(n-1)*(n-1)
assert len(spine_t)==12 and len(spine_rest)==14 and len(spine)==26
assert [len(x) for x in (A3,A4,A5,X)]==[13,25,41,55]
assert [centered_square(n) for n in (3,4,5)]==[13,25,41]
assert A3<=A4<=A5<=X
assert len(A4-A3)==12 and len(A5-A4)==16 and len(X-A5)==14
assert len(X)==26+24+1+4==55
skull={f"skull-{i}" for i in range(1,23)}
ossicles={f"ear-{i}" for i in range(1,7)}
hyoid={"hyoid"}
Y=skull|ossicles|hyoid|spine
axial=skull|ossicles|hyoid|spine|L|R|sternum
cage=L|R|sternum
assert len(axial)==80 and len(cage)==25
assert Y==axial-cage and len(Y)==55
assert X&Y==spine and len(X&Y)==26
assert len(X|Y)==55+55-26==84==len(axial|girdle)
assert len(X|Y)==len(axial)+len(girdle)
assert comb(11,2)==55 and 10*11//2==55
fib=[0,1]
for _ in range(2,11):fib.append(fib[-1]+fib[-2])
assert fib[10]==55
primes=[x for x in range(2,42) if all(x%p for p in range(2,int(x**.5)+1))]
assert primes[12]==41
assert 14+41==55
print("PASS: 13→25→41 centered squares, each a genuine nested inventory")
print("PASS: 41+14=55 distinct bones, connected full adult spinal/thoracic/girdle inventory")
print("PASS: two distinct 55 bone inventories overlap in 26 spine bones")
print("PASS: 55+55−26=84=80 axial+4 pectoral")
print("PASS: T10=F10=55; prime-index 41=P13; scoreboard invariant 1+14+41=56")
