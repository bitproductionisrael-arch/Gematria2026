#!/usr/bin/env python3
"""Exact labelled-bone validation: 36|1|36, 37/73, 888, Pell. No biology-code claim."""
from math import isqrt
def indexed(s,n): return {f'{s}{i}' for i in range(1,n+1)}
skull = indexed('cranial',8)|indexed('facial',14)
cervical = indexed('cervical',7)
thoracic = indexed('thoracic',12)
lumbar = indexed('lumbar',5)
spine = cervical|thoracic|lumbar|{'sacrum','coccyx'}
ribs = {f'rib_{s}{i}' for s in ('left','right') for i in range(1,13)}
sternum = {'sternum'}
ossicles = {f'ear_{s}_{x}' for s in ('left','right') for x in ('malleus','incus','stapes')}
aux = ossicles|{'hyoid'}
cage = ribs|sternum
principal = skull|spine|cage
axial = principal|aux
A = ribs|thoracic
B = sternum
C = skull|cervical|lumbar|{'sacrum','coccyx'}
X = A|B
Y = C|B
assert list(map(len,(skull,spine,ribs,sternum,aux,cage,principal,axial))) == [22,26,24,1,7,25,73,80]
assert list(map(len,(A,B,C,X,Y))) == [36,1,36,37,37]
assert not A&B and not B&C and not A&C
assert X&Y==sternum and X|Y==principal
assert 37+37-1==73 ==36+1+36==3*24+1
assert 24*37==888
assert 37*73 == (24+12)*37+37+(22+14)*37 ==3*888+37 ==2701
assert 73**2-37*12**2==1 and 73**2-1==6*888
assert all(isqrt(37*y*y+1)**2 != 37*y*y+1 for y in range(1,12))
outside_thorax=axial-X
outside_cage=axial-cage
assert len(outside_thorax)==43 and len(outside_cage)==55
assert outside_thorax < outside_cage and outside_cage-outside_thorax==thoracic
assert X&outside_cage==thoracic and X|outside_cage==axial
assert 37+55-12==80
assert 33-26==80-73==7
assert 2*(8+5+14)+2*(7+5+14)==106==73+33==80+26
print('PASS: labelled axial bones 80; principal 73=36|1|36; thorax 37')
print('PASS: two 37-member sets intersect at sternum; union 73')
print('PASS: 2701=3*888+37; Pell 73^2-37*12^2=1, minimal y=12')
print('PASS: subset complement 43/55, overlap 12, independent 7 balances')
