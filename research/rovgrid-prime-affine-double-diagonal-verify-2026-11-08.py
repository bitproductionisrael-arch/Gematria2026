#!/usr/bin/env python3
"""Audit affine 2x3 prime progression and all lattice arithmetic-progression triples."""
from itertools import combinations
P=[2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89]
G=[P[i:i+6] for i in range(0,24,6)]
def pos(p):
    i=P.index(p);return(i%6,i//6)
found=[]
for a,b,c in combinations(P,3):
    A,B,C=pos(a),pos(b),pos(c)
    if a+c==2*b and all(A[k]+C[k]==2*B[k] for k in (0,1)):
        found.append((a,b,c))
assert found==[(3,5,7),(11,29,47),(13,37,61),(23,53,83),(29,59,89),(47,53,59)]
patches=[]
all_windows=0
for slope in (1,-1):
    for r in (0,1):
        for c in range(6):
            left,right=[],[]
            for k in range(3):
                x=c+slope*k
                if not (0<=x<5):break
                left.append(G[r+k][x]);right.append(G[r+k][x+1])
            if len(left)!=3:continue
            all_windows+=1
            steps=[left[1]-left[0],left[2]-left[1],right[1]-right[0],right[2]-right[1]]
            gaps=[right[k]-left[k] for k in range(3)]
            if len(set(steps))==1 and len(set(gaps))==1:
                patches.append((r,c,slope,left,right,steps[0],gaps[0]))
assert all_windows==12
assert patches==[(1,2,1,[23,53,83],[29,59,89],30,6)]
assert 23+83==2*53 and 29+89==2*59
assert 23+29==52 and 53+59==112 and 83+89==172
assert 52+172==2*112
assert sum([23,53,83,29,59,89])==336==24*14
assert [P.index(p)+1 for p in [23,53,83]]==[9,16,23]
assert [P.index(p)+1 for p in [29,59,89]]==[10,17,24]
assert [G[2][j]-G[1][j] for j in range(6)]==[24,24,24,24,28,24]
assert (13+61)==2*37
print("PASS: exactly 6 simultaneous prime-value/lattice AP triples and one affine adjacent 2x3 diagonal patch in 12 windows.")
print("Patch: 23 29 / 53 59 / 83 89; step +30 diagonally and +6 horizontally; sum 336 = 24*14.")
