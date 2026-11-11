#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Independent arithmetic checks for the 19-37-73 / cube / stella source audit."""
from math import isqrt

axis = [1 + 9*k for k in range(9)]
assert axis == [1,10,19,28,37,46,55,64,73]
assert [axis[k] for k in (2,4,8)] == [19,37,73]
assert 2*19-1 == 37 and 2*37-1 == 73
assert (73-1)//2 == 37-1 and (37-1)//2 == 19-1
assert 37*19 == (37*38)//2 == 703
assert 73*37 == (73*74)//2 == 2701
assert [3*f+1 for f in (6,12,24)] == [19,37,73]
assert 8*3 == 24  # stella octangula: 8 tetrahedral peaks, 3 exposed triangles each
assert 24*37 == 888
V,E,F = 8,12,6
assert (V-E+F) == 2
a,b,c = V,V+E,V+E+F
assert (a,b,c) == (8,20,26)
p1 = a+b+c
p2 = a*b+a*c+b*c
p3 = a*b*c
assert (p1,p2,p3) == (54,888,4160)
assert p1 == 73-19 == 6*9
assert 12*30 == 360
assert 37*2 != 73 and 19*4 != 73  # raw values are not exact halves/quarters

def is_prime(n):
    return n >= 2 and all(n%d for d in range(2,isqrt(n)+1))
assert [n for n in axis if is_prime(n)] == [19,37,73]
print("PASS: axis, prime test, triangular identities, solids, polynomial, geometric counts")
