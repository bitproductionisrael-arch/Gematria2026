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

# Extension dated 2026-11-12: 74 lattice and verse count evidence.
factor74={73:5402,79:5846,74:5476,37:2738,23:1702,32:2368}
assert 2*37==74
for multiplier,expected in factor74.items():
    assert 2*37*multiplier==74*multiplier==expected
assert 5402==2*sum(regular)==74*73
assert 5476==sum(filled)==74**2==5402+74
assert 5846==5476+5*74==5402+6*74
assert 5846-5476==370==5*74
assert 5846-5402==444==6*74
assert 2738==2701+37
assert 1702==74*23
assert 2368==888+1480==74*32
assert 5476==73*75+1
# This records the Sefaria/MAM verse segmentation, not all Torah segmentations.
assert 5846==37*158==2*37*79
def is_prime(n):
    return n>1 and all(n%d for d in range(2,int(n**0.5)+1))
primes=[i for i in range(2,80) if is_prime(i)]
assert primes[20]==73 and primes[21]==79
print("PASS | factor-74 lattice:",factor74)
print("PASS | regular =",sum(regular), "talmudic milui =",sum(filled))
print("Words:",list(zip(words,regular,filled)))
print("יחידה×נצח = JESUS² = Genesis talmudic milui = 5476")
print("Genesis talmudic milui = 2×Genesis regular + JESUS Simple")
