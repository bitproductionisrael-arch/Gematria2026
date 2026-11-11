#!/usr/bin/env python3
"""Original Menger sponge 3D rule: 3^3->20, 9^3->400; face contacts 24 and 672."""
from itertools import product
def menger(level):
    N=3**level
    result=set()
    for x,y,z in product(range(N),repeat=3):
        a,b,c=x,y,z
        keep=True
        for _ in range(level):
            if (a%3==1)+(b%3==1)+(c%3==1)>=2:
                keep=False; break
            a//=3;b//=3;c//=3
        if keep:result.add((x,y,z))
    return result
def contacts(cells):
    return sum((x+dx,y+dy,z+dz) in cells
               for x,y,z in cells
               for dx,dy,dz in ((1,0,0),(0,1,0),(0,0,1)))
S1=menger(1)
assert len(S1)==20
assert contacts(S1)==24
assert [sum(z==layer for _,_,z in S1) for layer in range(3)]==[8,4,8]
S2=menger(2)
assert len(S2)==400 and 9**3-len(S2)==329
assert contacts(S2)==672==20*24+24*8
assert 27-len(S1)==7 and (20*27)-len(S2)==140
assert 1024==32**2 and 32%3!=0
print("PASS 27->20; second generation 729->400; face contacts 24->672; 32 is not divisible by 3.")
