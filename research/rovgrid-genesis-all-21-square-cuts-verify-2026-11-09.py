"""Genesis 1:1 — all 21 contiguous cuts, star-pair/3-square theorem.
Only integer arithmetic; fixed canonical gematria (regular Hebrew).
"""
from collections import Counter
from itertools import product
from math import isqrt

W=["בראשית","ברא","אלהים","את","השמים","ואת","הארץ"]
V=[913,203,86,401,395,407,296]
T=lambda n:n*(n+1)//2
S=lambda n:6*n*(n-1)+1
assert sum(V)==2701

windows=[(i+1,j+1,sum(V[i:j+1]))
         for i in range(7) for j in range(i+1,7)]
assert len(windows)==21

# Difference of two integer squares iff N is not 2 modulo 4.
diff_yes=[(i,j,n) for i,j,n in windows if n%4!=2]
diff_no=[(i,j,n) for i,j,n in windows if n%4==2]
assert len(diff_yes)==15 and len(diff_no)==6
assert [(i,j,n) for i,j,n in diff_no]==[
    (1,3,1202),(1,5,1998),(2,4,690),
    (3,5,882),(5,6,802),(5,7,1098)]

# Sum of >=2 strictly consecutive positive integer squares.
def consecutive_square_sums(n):
    results=[]
    for first in range(1,isqrt(n)+1):
        total=first*first
        for last in range(first+1,isqrt(n)+1):
            total+=last*last
            if total==n: results.append((first,last))
            if total>=n: break
    return results
hits=[(i,j,n,consecutive_square_sums(n))
      for i,j,n in windows if consecutive_square_sums(n)]
assert {(i,j) for i,j,_,_ in hits}=={(1,3),(1,4),(2,5)}
assert consecutive_square_sums(1202)==[(19,21)]
assert consecutive_square_sums(1603)==[(12,18)]
assert consecutive_square_sums(1085)==[(18,20)]

# Search all signed sums of 2 or 3 nonzero integer squares with roots <= M.
# Signs +/- can be chosen independently after the first positive term.
def representations(n,M):
    squares=[(a,a*a) for a in range(1,M+1)]
    two={}
    for a,aa in squares:
        for b,bb in squares:
            for s in (1,-1):
                two.setdefault(aa+s*bb,((a,1),(b,s)))
    if n in two: return two[n]
    for c,cc in squares:
        for s in (1,-1):
            if n-s*cc in two:
                return two[n-s*cc]+((c,s),)
    return None

assert all(representations(n,42) for _,_,n in windows)
assert not representations(1788,41)
assert min(m for m in range(1,43)
           if all(representations(n,m) for _,_,n in windows))==42

# Non-arbitrary, compact certificates of the main structural results.
assert S(10)+S(11)==1202==19**2+20**2+21**2
assert S(15)+S(16)==2702==29**2+30**2+31**2
assert all(S(n)+S(n+1)==(2*n-1)**2+(2*n)**2+(2*n+1)**2
           for n in range(1,2000))
assert 2701==26**2+45**2==55**2-18**2
assert 18**2+26**2+45**2==55**2
assert 1998==31**2+26**2+19**2==37*54
assert 1202+1203+296==2701
assert 1203==19**2+29**2+1**2
assert 2405==51**2-14**2==37*65
assert 296==39**2-35**2==8*37
assert (55**2-18**2)-(51**2-14**2)==296
assert 703==28**2-9**2==37*19
assert 1998+703==37*(54+19)==2701

print("PASS: 21 windows; 15 integer difference-of-squares; 6 impossible.")
print("PASS: 3 contiguous-square-sum windows; general consecutive-star theorem.")
print("PASS: all 21 in <=3 signed integer squares bounded by 42, minimal bound 42.")
for i,j,n in windows:
    print(f"{i}-{j}: {n}: {representations(n,42)}")
