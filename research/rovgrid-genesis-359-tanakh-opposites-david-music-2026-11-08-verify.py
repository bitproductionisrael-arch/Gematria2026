#!/usr/bin/env python3
# Reproducibility checks for RovGrid Tanakh / Genesis 359 note, 2026-11-08.
HE = "אבגדהוזחטיכלמנסעפצקרשת"
FINALS = dict(zip("ךםןףץ", "כמנפצ"))
VALUES = [*range(1,10), *range(10,100,10), *range(100,500,100)]
REG = dict(zip(HE, VALUES))
SMALL = {c:(v-1)%9+1 for c,v in REG.items()}
ORD = {c:i+1 for i,c in enumerate(HE)}
SMALL_FINALS = dict(SMALL)
for f,b in FINALS.items():
    for m in (REG, SMALL, ORD):
        m[f]=m[b]
for f,v in zip("ךםןףץ", (500,600,700,800,900)):
    SMALL_FINALS[f]=(v-1)%9+1

def value(s, m):
    return sum(m[c] for c in s if c in m)
def reduced(s):
    return sum((value(w,SMALL)-1)%9+1 for w in s.split())
def weighted(s, m=SMALL):
    return sum(len(w)*value(w,m) for w in s.split())
def t(n):return n*(n+1)//2
def check(name,actual,expected):
    assert actual==expected,(name,actual,expected)
    print("PASS",name,actual)

gen="בראשית ברא אלהים את השמים ואת הארץ"
check("Genesis 1:1 regular",value(gen,REG),2701)
check("Genesis 1:1 small",value(gen,SMALL),82)
check("Genesis 1:1 small finals",value(gen,SMALL_FINALS),86)
check("Genesis 1:1 word reduced",reduced(gen),37)
check("Genesis 1:1 weighted small",weighted(gen),359)
check("Genesis 1:1 counts",tuple(len(w) for w in gen.split()),(6,3,5,2,5,3,4))
check("Genesis 1:1 per word small",tuple(value(w,SMALL) for w in gen.split()),(13,5,14,5,17,11,17))
check("prefix suffix segment count",2*28-7,49)
check("atbash + reish yod",t(37)+t(20),913)
check("triangle 73",t(73),2701)

isa1="יוצר אור ובורא חשך"
isa2="עשה שלום ובורא רע"
isa3="אני יהוה עשה כל אלה"
check("Isaiah 45:7 first clause small",value(isa1,SMALL),57)
check("Isaiah 45:7 second clause small",value(isa2,SMALL),57)
check("Isaiah 45:7 final clause small",value(isa3,SMALL),53)
check("Isaiah 45:7 whole small",value(isa1+' '+isa2+' '+isa3,SMALL),167)
check("Isaiah 45:7 whole regular",value(isa1+' '+isa2+' '+isa3,REG),2840)
check("Deut 30:15 life small",value("החיים",SMALL),19)
check("Deut 30:15 death small",value("המות",SMALL),19)
check("Deut 30:15 life regular",value("החיים",REG),73)
check("Shalom equals Satan plus Tov",value("שלום",REG),value("שטן",REG)+value("טוב",REG))
check("Shatan small equals Tov small",value("שטן",SMALL),value("טוב",SMALL))
check("YHWH small equals Tov equals Satan", (value("יהוה",SMALL),value("טוב",SMALL),value("שטן",SMALL)),(17,17,17))
check("1Kings11:14 small",value("ויקם יהוה שטן לשלמה",SMALL),64)
name="עמית מייק רוב"
check("Name regular weighted",weighted(name,REG),3344)
check("Name ordinal weighted",weighted(name,ORD),536)
check("Name small weighted",weighted(name,SMALL),122)
check("Name difference normalized", (weighted(name,REG)-weighted(name,SMALL))//9,358)
check("Satan David regular",value("שטן דוד",REG),373)
check("Satan David small",value("שטן דוד",SMALL),31)
check("Satan David small finals",value("שטן דוד",SMALL_FINALS),33)
check("Five-name regular",value("שטן דוד יהוה אדני אלהים",REG),550)
check("Five-name small",value("שטן דוד יהוה אדני אלהים",SMALL),73)
check("Five-name small finals",value("שטן דוד יהוה אדני אלהים",SMALL_FINALS),77)
check("Five-name reduced",reduced("שטן דוד יהוה אדני אלהים"),28)
check("Music 1Sam16:16",weighted("ונגן בידו וטוב לך"),230)
check("Music 1Sam16:23",weighted("וסרה מעליו רוח הרעה"),305)
print("All checks passed.")
