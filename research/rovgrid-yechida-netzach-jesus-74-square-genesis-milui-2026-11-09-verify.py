"""Reproduce Genesis 1:1 Talmudic Milui using canonical RovGrid spellings.
Runs without dependencies. Source: calculator.html MILUI_NAMES_TALMUDIC.
"""
from itertools import accumulate
M={
 'א':'אלף','ב':'בית','ג':'גימל','ד':'דלת','ה':'הא','ו':'ויו','ז':'זין',
 'ח':'חית','ט':'טית','י':'יוד','כ':'כף','ל':'למד','מ':'מם','נ':'נון',
 'ס':'סמך','ע':'עין','פ':'פא','צ':'צדי','ק':'קוף','ר':'ריש','ש':'שין','ת':'תו'}
V=dict(zip("אבגדהוזחטיכלמנסעפצקרשת",[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
FINAL=dict(zip("ךםןףץ","כמנפצ"))
def normalize(ch): return FINAL.get(ch,ch)
def value(s): return sum(V.get(normalize(ch),0) for ch in s)
def milui(s): return sum(value(M[normalize(ch)]) for ch in s if normalize(ch) in M)
words="בראשית ברא אלהים את השמים ואת הארץ".split()
regular=[value(w) for w in words]
filled=[milui(w) for w in words]
assert regular==[913,203,86,401,395,407,296]
assert filled==[1819,1033,291,517,546,539,731]
assert sum(regular)==2701
assert sum(filled)==5476
assert value("יחידה")==37
assert value("נצח")==148
assert value("עד")==74
jesus=sum(ord(c)-64 for c in "JESUS")
assert jesus==74
assert 37*148==jesus**2==5476
assert 2701==37*73==37*72+37
assert 5476==2*2701+74==37*(73+75)==73*75+1
assert 5476-2701==37*75==2775
assert 2701==55**2-18**2==26**2+45**2
# Standard RovGrid variant switches three Tav spellings from תו 406 to תיו 416.
assert sum(filled)+10*sum(w.count("ת") for w in words)==5506
print("PASS | regular =",sum(regular), "talmudic milui =",sum(filled))
print("Words:",list(zip(words,regular,filled)))
print("יחידה×נצח = JESUS² = Genesis talmudic milui = 5476")
print("Genesis talmudic milui = 2×Genesis regular + JESUS Simple")
