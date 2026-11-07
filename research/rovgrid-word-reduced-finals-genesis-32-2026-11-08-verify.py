#!/usr/bin/env python3
"""Check Hebrew Word Reduced (Finals), standard Word Reduced and magnet word subtotals."""
HE="אבגדהוזחטיכלמנסעפצקרשת"
VAL=list(range(1,10))+list(range(10,100,10))+list(range(100,500,100))
REG=dict(zip(HE,VAL))
BASE_FINAL=dict(zip("ךםןףץ","כמנפצ"))
for f,base in BASE_FINAL.items():REG[f]=REG[base]
SMALL={c:(v-1)%9+1 for c,v in REG.items()}
SMALL_FINALS=dict(SMALL)
for i,c in enumerate("ךםןףץ"):SMALL_FINALS[c]=i+5
def dr(n):return (n-1)%9+1 if n else 0
def value(word,m):return sum(m.get(c,0) for c in word)
def word_reduced(phrase,m):
    return sum(dr(value(w,m)) for w in phrase.split())
verse="בראשית ברא אלהים את השמים ואת הארץ"
words=verse.split()
normal=[value(w,SMALL) for w in words]
finals=[value(w,SMALL_FINALS) for w in words]
folds_normal=[dr(n) for n in normal]
folds_finals=[dr(n) for n in finals]
assert normal==[13,5,14,5,17,11,17]
assert finals==[13,5,16,5,19,11,17]
assert folds_normal==[4,5,5,5,8,2,8]
assert folds_finals==[4,5,7,5,1,2,8]
assert sum(normal)==82 and sum(finals)==86
assert word_reduced(verse,SMALL)==37
assert word_reduced(verse,SMALL_FINALS)==32
assert value("לב",REG)==32 and value("יחידה",REG)==37
assert [SMALL_FINALS[c] for c in "ךםןףץ"]==[5,6,7,8,9]
assert word_reduced("אלהים",SMALL)==5 and word_reduced("אלהים",SMALL_FINALS)==7
assert word_reduced("השמים",SMALL)==8 and word_reduced("השמים",SMALL_FINALS)==1
assert word_reduced(verse,SMALL_FINALS)==32 != dr(32)
print("PASS: Genesis 1:1 wordwise reduced finals = 32, normal = 37")
print("PASS: final letter assignments + word breakdown")
