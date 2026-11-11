#!/usr/bin/env python3
"""Exact reproducibility: canonical Sierpinski, adapted 32×32 holes, 2D and Gray Q10 edge inventories."""
from itertools import product
from collections import Counter
def carpet(n,depth):
    assert n % 3**depth == 0
    gone=set()
    for x,y in product(range(n),repeat=2):
        for level in range(1,depth+1):
            unit=n//(3**level)
            if (x//unit)%3==1 and (y//unit)%3==1:
                gone.add((x,y));break
    return gone
assert len(carpet(9,2))==17 and 9**2-len(carpet(9,2))==64
assert len(carpet(27,3))==217 and 27**2-217==512
def pixel_center_carpet32(depth):
    removed=set()
    for x,y in product(range(32),repeat=2):
        for level in range(1,depth+1):
            if ((2*x+1)*3**level//64)%3==1 and ((2*y+1)*3**level//64)%3==1:
                removed.add((x,y));break
    return removed
assert len(pixel_center_carpet32(1))==100
assert len(pixel_center_carpet32(2))==184

holes=((12,12,8),(4,4,3),(14,4,3),(25,4,3),(4,15,3),
       (25,14,3),(4,25,3),(15,25,3),(25,25,3))
def pixels(r):
    x,y,s=r
    return {(i,j) for i in range(x,x+s) for j in range(y,y+s)}
parts=[pixels(h) for h in holes]
gone=set()
for part in parts:
    assert not part & gone
    gone|=part
assert len(gone)==136 and len(gone)==64+8*9
keep=set(product(range(32),repeat=2))-gone
assert len(keep)==888
assert {(32-y-s,x,s) for x,y,s in holes}==set(holes)
assert all(0<x and 0<y and x+s<32 and y+s<32 for x,y,s in holes)

def edge2(v):
    return sum((x+1,y) in v for x,y in v)+sum((x,y+1) in v for x,y in v)
def cross2(a,b):
    return sum((x+dx,y+dy) in b for x,y in a for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)))
assert edge2(gone)==208 and edge2(keep)==1648 and cross2(gone,keep)==128
assert edge2(gone)+edge2(keep)+cross2(gone,keep)==1984

def gray(t):return t^(t>>1)
def label(x,y):return (gray(x)<<5)|gray(y)
assert {label(x,y) for x,y in product(range(32),repeat=2)}==set(range(1024))
for x,y in product(range(32),repeat=2):
    if x<31:assert (label(x,y)^label(x+1,y)).bit_count()==1
    if y<31:assert (label(x,y)^label(x,y+1)).bit_count()==1
def internal(v):return sum((p^(1<<k)) in v for p in v for k in range(10))//2
def crossing(a,b):return sum((p^(1<<k)) in b for p in a for k in range(10))
d={label(x,y) for x,y in gone}
a=set(range(1024))-d
assert internal(d)==336 and internal(a)==4096 and crossing(d,a)==688
assert internal(d)+internal(a)+crossing(d,a)==5120
assert 336+688==1024 and 4096==4*1024
assert [internal({label(x,y) for x,y in part}) for part in parts]==[192]+[12]*8
assert internal(d)==192+8*12+48

def rotate(r):return (32-r[1]-r[2],r[0],r[2])
def orbit(r):
    out=[]
    for _ in range(4):out.append(r);r=rotate(r)
    return out
counts=Counter()
for x,y,a1,b1 in product((4,5),(4,5),(14,15),(4,5)):
    hh=[(12,12,8)]+orbit((x,y,3))+orbit((a1,b1,3))
    modified=set().union(*(pixels(r) for r in hh))
    assert len(modified)==136
    dm={label(x,y) for x,y in modified}
    ii=internal(dm);cc=1360-2*ii;kk=5120-ii-cc
    counts[(ii,cc,kk)]+=1
assert counts==Counter({(336,688,4096):8,(316,728,4076):8}),counts

menger={(x,y,z) for x,y,z in product(range(3),repeat=3) if (x==1)+(y==1)+(z==1)<=1}
assert len(menger)==20
assert sum((x+dx,y+dy,z+dz) in menger for x,y,z in menger for dx,dy,dz in ((1,0,0),(0,1,0),(0,0,1)))==24

print("PASS: Sierpinski 9x9 -> 17 removed; adapted 32x32 -> 136 removed and 888 retained.")
print("PASS: planar edges (208,128,1648); Q10 edges (336,688,4096); 16-placement control.")
print("PASS: true Menger sponge level 1 has 20 cubes and 24 face contacts.")
