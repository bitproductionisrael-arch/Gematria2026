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

# Genesis 6:6 — maqaf-sensitive reductions and new triangular-name links
gen6="וינחם יהוה כי־עשה את־האדם בארץ ויתעצב אל־לבו"
gen6_sep=gen6.replace("־"," ")
gen6_join=gen6.replace("־","")
check("Genesis 6:6 small",value(gen6,SMALL),136)
check("Genesis 6:6 reduced with maqaf",reduced(gen6),37)
check("Genesis 6:6 reduced split",reduced(gen6_sep),46)
check("Genesis 6:6 weighted small split",weighted(gen6_sep),576)
check("Genesis 6:6 weighted small joined",weighted(gen6_join),697)
check("Genesis 6:6 segmentation delta",697-576,121)
check("small word values split",tuple(value(w,SMALL) for w in gen6_sep.split()),(24,17,3,15,5,14,14,29,4,11))
check("T13",t(13),91)
check("T16",t(16),136)
check("T16 minus T13 = Adam",t(16)-t(13),value("אדם",REG))
check("Amen 91",value("אמן",REG),91)
check("Echad 13",value("אחד",REG),13)
check("Kol 136",value("קול",REG),136)
check("Bereshit small 13",value("בראשית",SMALL),13)
check("Amit small 16",value("עמית",SMALL),16)
check("136 = eight Tov",136,8*value("טוב",REG))
check("Blaze regular",value("בלייז",REG),59)
check("Michael regular",value("מיכאל",REG),101)
check("Blaze + Michael = Mike",value("בלייז",REG)+value("מיכאל",REG),value("מייק",REG))
check("YHWH + Tov = Amit English Simple",value("יהוה",REG)+value("טוב",REG),1+13+9+20)
def prime_index(n):
    idx=0
    for x in range(2,n+1):
        if all(x%y for y in range(2,int(x**0.5)+1)):
            idx+=1
    return idx
check("prime index of Blaze 59",prime_index(59),17)
check("prime index of Michael 101",prime_index(101),26)

print("All checks passed.")
