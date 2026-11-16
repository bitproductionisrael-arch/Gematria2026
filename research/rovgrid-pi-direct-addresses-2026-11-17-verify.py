#!/usr/bin/env python3
"""Reproduce π digit-address claims and 900k fixed-prefix searches.
Run: pip install mpmath && python research/rovgrid-pi-direct-addresses-2026-11-17-verify.py
"""
import mpmath as mp
from collections import Counter

mp.mp.dps=100030
N=100000
names=["π","e","φ","√2","√3","√5","√37","√73","√888"]
values=[
    mp.pi,mp.e,(1+mp.sqrt(5))/2,mp.sqrt(2),mp.sqrt(3),
    mp.sqrt(5),mp.sqrt(37),mp.sqrt(73),mp.sqrt(888)
]
const=dict(zip(names,values))
ab="אבגדהוזחטיכלמנסעפצקרשת"
regular={c:(i+1 if i<9 else (i-8)*10 if i<18 else (i-17)*100) for i,c in enumerate(ab)}
small={c:1+i%9 for i,c in enumerate(ab)}
ordinal={c:i+1 for i,c in enumerate(ab)}
atord={c:22-i for i,c in enumerate(ab)}
def gem(w,m):
    return sum(m[c] for c in w.replace(" ",""))
def seqdec(x):
    d=str(x).split(".")[1][:N]
    assert len(d)==N
    return d
def find_count(d,p):
    n=0; at=0
    while True:
        i=d.find(p,at)
        if i<0: return n
        n+=1;at=i+1
def addr(d,w,method):
    return "".join(d[method[ch]-1] for ch in w.replace(" ",""))
dec={name:seqdec(value) for name,value in const.items()}
p=dec["π"]
def eq(actual,expected,label):
    assert actual==expected,(label,actual,expected)
eq([p[0],p[299],p[399]],["1","3","4"],"position 1,300,400")
eq("".join(p[i-1] for i in [300,1,400]),"314","mixed address 300-1-400")
eq(addr(p,"שית",regular),"354","Shit uniform regular")
eq(addr(p,"שית",small),"115","Shit uniform small")
eq(addr(p,"שית",ordinal),"256","Shit uniform ordinal")
eq(addr(p,"שדי",regular),"355","Shaddai uniform regular")
eq(addr(p,"שדי",small),"151","Shaddai uniform small")
eq(addr(p,"שדי",ordinal),"255","Shaddai uniform ordinal")
eq(addr(p,"עמית",regular),"4154","Amit uniform regular")
eq(addr(p,"עמית",small),"6515","Amit uniform small")
eq(addr(p,"עמית",ordinal),"2756","Amit uniform ordinal")
eq(addr(p,"פאי",ordinal),"315","Pai ordered digit address")
eq(913^682,315,"Genesis 913 xor Merkabah 682")
hist=Counter(p[:22])
eq(hist["3"]*hist["1"]*hist["5"],18,"315 candidate triples across 22 pi digits")

eq(gem("עמית",regular),520,"Amit regular")
eq(gem("פאי",regular),91,"Pai regular")
eq(gem("עמית פאי",regular),611,"Amit Pai regular")
eq(gem("תורה",regular),611,"Torah regular")
eq(gem("עמית פאי",small),26,"Amit Pai reduced")
eq(gem("עמית פאי",atord),72,"Amit Pai Atbash ordinal")
eq(gem("עמית פאי",regular),13*47,"611 factorization")
eq(gem("עמית",regular),13*40,"520 factorization")
eq(gem("פאי",regular),13*7,"91 factorization")
eq(gem("שדי",regular),314,"Shaddai")
eq(gem("פאי",ordinal),28,"Pai ordinal")
eq(gem("פאי",small),10,"Pai small")
eq(gem("פאי",atord),41,"Pai Atbash ordinal")
eq(gem("פאי",regular)*3,273,"3 times Pai regular")
eq(gem("פאי",regular)*8,728,"8 times Pai regular")

power={name:{c:int(d[i]) for i,c in enumerate(ab)} for name,d in dec.items()}
for phrase,checks in {
    "עמית":{"√37":16,"√2":9,"√888":21,"√73":15,"π":20},
    "פאי":{"π":9,"e":14,"φ":17,"√2":11,"√3":21,"√5":15,
         "√37":10,"√73":14,"√888":15},
    "עמית פאי":{"√37":26,"√888":36,"√73":29,"φ":45,"e":22,"π":29},
    "שדי":{"π":12,"√37":18,"√888":11}
}.items():
    for k,v in checks.items():
        eq(gem(phrase,power[k]),v,phrase+" mapped on "+k)
eq(48*gem("עמית",power["√37"]),768,"48 Amit root37")
eq(48*gem("עמית",power["√2"]),432,"48 Amit root2")
eq(48*gem("עמית",power["√888"]),1008,"48 Amit root888")
eq(48*gem("עמית",power["√73"]),720,"48 Amit root73")
eq(48*gem("עמית פאי",power["√37"]),1248,"48 Amit Pi root37")
eq(48*gem("עמית פאי",power["√888"]),1728,"48 Amit Pi root888")
eq(48*gem("עמית פאי",power["√73"]),1392,"48 Amit Pi root73")
eq(48*gem("עמית פאי",power["φ"]),2160,"48 Amit Pi phi")
eq(48*gem("עמית פאי",power["e"]),1056,"48 Amit Pi e")
eq(48*gem("עמית פאי",atord),3456,"48 Amit Pi atbash ordinal")
eq(8*gem("פאי",power["φ"]),136,"8 Pai phi")
eq(64*gem("פאי",power["√37"]),640,"64 Pai sqrt37")
eq(16*gem("פאי",power["π"]),144,"16 Pai π")
eq(32*gem("פאי",power["π"]),288,"32 Pai π")
eq(64*gem("פאי",power["π"]),576,"64 Pai π")
eq(48*(gem("עמית",power["√37"])+gem("פאי",power["√37"])),1248,"root37 additive")

expected={"314":888,"341":913,"431":918,"682":894,"888":954,"1024":79,"2701":85,"494592":2}
counts={key:sum(find_count(d,key) for d in dec.values()) for key in expected}
eq(counts,expected,"900k decimal digits overlapping")
bp=["1010101010","0101010101","1110010001"]
bcounts={key:0 for key in bp}
for name,x in const.items():
    frac=x-mp.floor(x)
    binstr=format(int(mp.floor(frac*mp.power(2,N))),f"0{N}b")
    eq(len(binstr),N,name+" binary bit length")
    for key in bp:
        bcounts[key]+=find_count(binstr,key)
eq(bcounts,{"1010101010":873,"0101010101":885,"1110010001":884},"900k binary bits overlapping")
# 13 HomePower alphabets: concatenation and digit-sum are distinct operations.
extra = {
    "1/2701": "000370233246945575712699000370233246945575712699",
    "1/37": "027027027027027027027027027027027027027027027027",
    "1/73": "013698630136986301369863013698630136986301369863",
    "golden9": "437694101250946366158718490709256940517217381748",
}
prefixes={**{name:d[:22] for name,d in dec.items()},**{name:d[:22] for name,d in extra.items()}}
expected_halves={
    "π":("461","256",24),
    "e":("167","042",20),
    "φ":("106","475",23),
    "√2":("104","136",15),
    "√3":("327","754",28),
    "√5":("302","941",19),
    "√37":("890","926",34),
    "√73":("475","136",26),
    "√888":("967","356",36),
    "1/2701":("010","226",11),
    "1/37":("220","700",11),
    "1/73":("160","918",25),
    "golden9":("354","827",29),
}
for name,expected_value in expected_halves.items():
    d=prefixes[name]
    left=addr(d,"ברא",ordinal)
    right=addr(d,"שית",ordinal)
    total=sum(map(int,left+right))
    eq((left,right,total),expected_value,name+" Bereshit mapped halves")
eq(addr(prefixes["√2"],"בראשית",ordinal),"104136","√2 exact 104|136")
eq(addr(prefixes["π"],"בראשית",ordinal),"461256","π exact 461|256")
eq(136-104,32,"32 bridge")
eq(32**2-136,888,"888 bridge")
eq(sum(map(int,"461256")),24,"π Bereshit digit sum")
eq(24*37,888,"π Bereshit times 37")

# Supplement: the two squared sums use actual Pi digits.
eq(tuple(int(p[i-1]) for i in (300,1,400)),(3,1,4),"Pi literal positions 300/1/400")
eq(sum(int(p[i-1])**2 for i in (300,1,400)),26,"26 squared-digit sum")
eq(tuple(int(p[i-1]) for i in (21,4,10)),(2,5,5),"Pi ordinal Shaddai locations")
eq(sum(int(p[i-1])**2 for i in (21,4,10)),54,"54 squared-digit sum")
eq(gem("יהוה",regular),26,"YHWH regular")
eq(gem("יוד הא ויו הא",regular),54,"Yod He Viyo He regular 54")
eq(gem("יוד הא ואו הא",regular),45,"Vav written Vav-Alef-Vav = 45 spelling")
eq(gem("יסוד",regular),80,"Yesod regular 80")
eq(54-26,28,"Gen 1:1 letter count")
eq(54+26,80,"Yesod combined arithmetic")

# Digit 19 and Rov's two decimal addresses, including adjacent digits.
eq(tuple(int(p[i-1]) for i in (18,19,20)),(8,4,6),"Pi digits at 18-20")
eq(p[17:20],"846","Pi substring 18-20")
eq(8+4+6,18,"Pi three-digit sum 18")
eq(8*100+4*10+6,846,"846 concatenation")
eq(int(p[17]+p[19]),86,"outer-digit join 86; not contiguous")
eq(gem("אלהים",regular),86,"Elohim 86 regular")
eq(gem("בורא",regular),209,"Bore 209 regular")
eq(p[52:55],"209","53-55 Bore")
eq(p[53:56],"097","54-56 triple")
eq(p[206:209],"097","207-209 triple")
eq(p[52:57],"20974","53-57 window")
eq(p[205:210],"10975","206-210 window")
eq(207-54,153,"Pi location displacement")
eq(153,3*51,"153=3x51")
eq(153,17*18//2,"153=T17")
eq(p[54],p[207],"Rov value positions d55 and d208 both 9")

# Three sculptural decimal addresses, first digit and expanding 3-digit windows.
eq(tuple(int(p[i-1]) for i in (97,790,970)),(0,8,6),"Pi d97,d790,d970")
eq("".join(p[i-1] for i in (97,790,970)),"086","selected address digits 086")
eq(int("086"),gem("אלהים",regular),"086 = Elohim 86")
eq(p[96:99],"067","Pi 97..99")
eq(p[789:792],"816","Pi 790..792")
eq(p[969:972],"613","Pi 970..972")
eq(p[96:101],"06798","Pi 97..101")
eq(p[789:794],"81609","Pi 790..794")
eq(p[969:974],"61300","Pi 970..974")
eq(int(p[96:99]),gem("בינה",regular),"067 = Bina 67")
eq(int(p[789:792]),136*6,"816 = English Gematria 136x6")
eq(int(p[969:972]),gem("תריג",regular),"613 = Taryag")

print("PASS. Pi digit addresses, gematria mappings, 900k decimal digits, 900k binary bits")
print("Pi d1,d10,d17,d300,d400:",*[p[i-1] for i in [1,10,17,300,400]])
print("Decimal totals:",counts)
print("Binary totals:",bcounts)
