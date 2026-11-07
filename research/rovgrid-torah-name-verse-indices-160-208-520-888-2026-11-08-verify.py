#!/usr/bin/env python3
"""Check Torah verse indices and word-count-weighted gematria (8 Nov 2026)."""
from math import isqrt
HE="אבגדהוזחטיכלמנסעפצקרשת"
REG=dict(zip(HE, list(range(1,10))+list(range(10,100,10))+list(range(100,500,100))))
ORD={a:i+1 for i,a in enumerate(HE)}
for f,b in dict(zip("ךםןףץ","כמנפצ")).items():
    REG[f]=REG[b]
    ORD[f]=ORD[b]
SMALL={a:(v-1)%9+1 for a,v in REG.items()}
texts={
 160:"ויעש נח ככל אשר צוה אתו אלהים כן עשה",
 208:"ומוראכם וחתכם יהיה על כל חית הארץ ועל כל עוף השמים בכל אשר תרמש האדמה ובכל דגי הים בידכם נתנו",
 520:"ותאמר שרה צחק עשה לי אלהים כל השמע יצחק לי",
 888:"ותען רחל ולאה ותאמרנה לו העוד לנו חלק ונחלה בבית אבינו",
}
counts=[31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31]
def value(s,m):return sum(m.get(ch,0) for ch in s)
def reduced(s):return sum((value(w,SMALL)-1)%9+1 for w in s.split())
def weighted(s,m=SMALL):return sum(len(w)*value(w,m) for w in s.split())
def index(chapter,verse):return sum(counts[:chapter-1])+verse
expected={
 160:(6,22,9,28,2054,317,110,47,355),
 208:(9,2,20,74,4648,796,274,94,1123),
 520:(21,6,10,33,2564,413,125,44,462),
 888:(31,14,11,44,2435,437,185,68,806),
}
for n,t in texts.items():
    c,v,nw,nl,reg,ordv,small,red,wsm=expected[n]
    assert index(c,v)==n,("index",n)
    got=(len(t.split()),sum(len(w) for w in t.split()),value(t,REG),value(t,ORD),
         value(t,SMALL),reduced(t),weighted(t))
    assert got==(nw,nl,reg,ordv,small,red,wsm),(n,got)
    print("PASS",n,"Genesis",c,v,got)
assert value("יצחק",REG)==208
assert value("צחק",REG)==198
assert value("האדמה",REG)==value("הים",REG)==55
assert reduced(texts[208])==2*reduced(texts[160])==94
assert value("חית",REG)==418
assert value("דגי",REG)==17
assert (160%24,208%24,520%24)==(16,16,16)
assert 520-160==360
assert 160+208+520==888==24*37
assert (8*20,8*26,20*26)==(160,208,520)
assert value("עמית",REG)==520
assert value("מייק",REG)==160
assert value("רוב",REG)==208
print("All checks passed.")
