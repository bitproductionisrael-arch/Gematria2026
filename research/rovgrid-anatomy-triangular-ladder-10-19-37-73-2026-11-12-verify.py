#!/usr/bin/env python3
"""The skeleton's triangular-number ladder and exact Genesis-gematria split."""
from math import isqrt
T=lambda n:n*(n+1)//2
S=lambda n:6*n*(n-1)+1
counts=[10,19,37,73]
assert all(counts[i+1]==2*counts[i]-1 for i in range(3))
assert [T(n) for n in counts]==[55,190,703,2701]
assert all(T(2*n-1)==T(n)+3*T(n-1) for n in (10,19,37))
assert [S(i) for i in (2,3,4)]==[13,37,73]
assert 80-(24+1)==55==22+6+1+26
assert 7+12==19
assert 12+24+1==37
assert 22+26+24+1==73
abc="אבגדהוזחטיכלמנסעפצקרשת"
numbers=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
v=dict(zip(abc,numbers))
for a,b in {'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'}.items():v[a]=v[b]
gem=lambda x:sum(v[y] for y in x if y in v)
words="בראשית ברא אלהים את השמים ואת הארץ".split()
assert [gem(w) for w in words]==[913,203,86,401,395,407,296]
assert sum(map(gem,words[:4]))==1603
assert sum(map(gem,words[:5]))==1998==3*T(36)
assert sum(map(gem,words[5:]))==703==T(37)
assert sum(map(gem,words))==2701==T(73)
assert (gem("אחד"),gem("יחידה"),gem("חכמה"))==(13,37,73)
print("OK: 10→19→37→73; T=55→190→703→2701")
print("OK: T73 = T37 + 3*T36; Genesis = 1998 + 703 = 2701")
print("OK: anatomical 55 and first 4 words Genesis 1603, not 703")
