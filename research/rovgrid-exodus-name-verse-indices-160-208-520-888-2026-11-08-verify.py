#!/usr/bin/env python3
"""Reproduce Exodus book-local verse indices and word-position findings."""
HE="אבגדהוזחטיכלמנסעפצקרשת"
REG=dict(zip(HE,list(range(1,10))+list(range(10,100,10))+list(range(100,500,100))))
ORD={c:i+1 for i,c in enumerate(HE)}
for f,b in dict(zip("ךםןףץ","כמנפצ")).items():
    REG[f]=REG[b]; ORD[f]=ORD[b]
SMALL={c:(v-1)%9+1 for c,v in REG.items()}
COUNTS=[22,25,22,31,23,30,29,28,35,29,10,51,22,31,27,36,16,27,25,23,37,30,33,18,40,37,21,43,46,38,18,35,23,35,35,38,29,31,43,38]
assert len(COUNTS)==40 and sum(COUNTS)==1210
def value(t,mp):return sum(mp.get(c,0) for c in t)
def split(t):return t.replace("־"," ").split()
def reduction(t):
    return sum((value(w,SMALL)-1)%9+1 for w in split(t))
def weighted(t,mp,maqqef_join=False):
    words=t.split() if maqqef_join else split(t)
    return sum(value(w,mp)*sum(c in mp for c in w) for w in words)
def index(ch,verse):return sum(COUNTS[:ch-1])+verse
verses={
    160:(7,7,"ומשה בן־שמנים שנה ואהרן בן־שלש ושמנים שנה בדברם אל־פרעה"),
    208:(8,26,"ויצא משה מעם פרעה ויעתר אל־יהוה"),
    520:(20,1,"וידבר אלהים את כל־הדברים האלה לאמר"),
    888:(31,3,"ואמלא אתו רוח אלהים בחכמה ובתבונה ובדעת ובכל־מלאכה"),
}
checks={
    160:(12,44,3577,517,166,67,689,857),
    208:(7,25,1700,287,107,35,413,463),
    520:(7,28,1332,252,81,36,369,435),
    888:(9,42,1967,356,158,41,783,908),
}
for n,(chapter,verse,t) in verses.items():
    assert index(chapter,verse)==n
    got=(len(split(t)),sum(c in REG for c in t),value(t,REG),value(t,ORD),value(t,SMALL),reduction(t),weighted(t,SMALL),weighted(t,SMALL,True))
    assert got==checks[n],(n,got,checks[n])
    print("PASS",n,chapter,verse,got)
assert sum(COUNTS[:6])==153 and sum(COUNTS[:7])==182
assert sum(COUNTS[:19])==519 and sum(COUNTS[:30])==885
assert 160==8*20==2*80
assert value(verses[160][2],SMALL)==166==2*83
assert value(verses[160][2],REG)==3577==49*73
assert 208==8*26 and value(verses[208][2],REG)==1700==100*17
assert weighted(verses[208][2],SMALL)==413==7*59
assert 520==20*26 and value(verses[520][2],REG)==1332==36*37
assert weighted(verses[520][2],REG)==5256==72*73
assert weighted(verses[520][2],REG,True)==6078
assert value(verses[520][2],ORD)==252==7*36
assert value(verses[520][2],SMALL)==81==9**2
assert reduction(verses[520][2])==36==6**2
assert 888==160+208+520==24*37
assert (8*20,8*26,20*26)==(160,208,520)
print("ALL CHECKS PASSED")
