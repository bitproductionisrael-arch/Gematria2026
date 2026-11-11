#!/usr/bin/env python3
"""RovGrid 37 x (3,6,9): executable integer arithmetic audit, 2026-11-12.
Standard library only. Run: python3 03_verify_37x369.py
"""
from itertools import combinations, permutations
from math import gcd
import json
from pathlib import Path

results=[]
def test(name,actual,expected):
    passed=(actual==expected)
    results.append({'id':len(results)+1,'name':name,'actual':actual,'expected':expected,'passed':passed})
    if not passed: raise AssertionError(f'{name}: {actual!r} != {expected!r}')

def T(n): return n*(n+1)//2

def sigma(n): return sum(d for d in range(1,n+1) if n%d==0)

def prime(n): return n>1 and all(n%d for d in range(2,int(n**.5)+1))

def nth_prime(n):
    a=[]; k=2
    while len(a)<n:
        if prime(k): a.append(k)
        k+=1
    return a[-1]

EN='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
SIMPLE={x:i for i,x in enumerate(EN,1)}
AGR={x:y for x,y in zip(EN,[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500])}
HE='אבגדהוזחטיכלמנסעפצקרשת'
HV={x:10**(i//9)*(i%9+1) for i,x in enumerate(HE)}
# 0..8 -> 1..9; 9..17 -> 10..90; 18..21 -> 100..400
FIN=dict(zip('ךםןףץ','כמנפצ'))
def hw(w): return ''.join(FIN.get(x,x) for x in w if x!=' ')
def regular(w): return sum(HV[x] for x in hw(w))
def ordinal(w): return sum(HE.index(x)+1 for x in hw(w))
def atbash_ordinal(w): return sum(22-HE.index(x) for x in hw(w))
def es(w): return sum(SIMPLE[c] for c in w.upper() if c in SIMPLE)
def ag(w): return sum(AGR[c] for c in w.upper() if c in AGR)
def small(w): return sum((SIMPLE[c]-1)%9+1 for c in w.upper() if c in SIMPLE)

# 369 and triangular pair identities
A=(3,6,9); R=sum(A); Q=sum(n*n for n in A)
L=sum(T(n-1) for n in A); U=sum(T(n) for n in A)
for name,v,expect in [
 ('R',R,18),('Q',Q,126),('L',L,54),('U',U,72),
 ('U+L',U+L,126),('U-L',U-L,18),('U from square sum',(Q+R)//2,72),
 ('L from square sum',(Q-R)//2,54),
 ('ratio L/18',L//18,3),('ratio U/18',U//18,4),('ratio Q/18',Q//18,7),
 ('product',3*6*9,162),('product versus squares',3*6*9-Q,36),
 ('corrected squares',3**2+2*6**2+9**2,162),
 ('37 from R',2*R+1,37),('37 from U',U//2+1,37),
 ('24 from U',U//3,24),('24 from difference',R+(U-L)//3,24),
 ('37 x 24',(U//2+1)*(U//3),888),
 ('369 integer x 37',369*37,13653),
 ('37 x 3',37*3,111),('37 x 6',37*6,222),('37 x 9',37*9,333),
 ('111+222+333',111+222+333,666),('666+222',666+222,888),
 ('extra6 from difference',(U-L)//3,6),
 ('37 times split three and extra',37*(3+6+9+(U-L)//3),888),
 ('Q+R',Q+R,144),('Q+R+4',Q+R+4,148),
 ('37 from Q+R+4',(Q+R+4)//4,37),('24 from Q+R',(Q+R)//6,24),
 ('master Q R formula',(Q+R)*(Q+R+4)//24,888),
 ('milui compared to Q R',6*(Q+R+4),888),
]: test(name,v,expect)

for n in range(1,51):
    test(f'triangular plus previous is square n={n}',T(n)+T(n-1),n*n)
    test(f'triangular minus previous is n={n}',T(n)-T(n-1),n)

for k in range(1,31):
    tr=sum(T(i*k) for i in (1,2,3))
    pfx=24*k
    test(f'7k²+3k for k={k}',tr,7*k*k+3*k)
    test(f'24k bidirectional prefix k={k}',pfx,24*k)
    test(f'unique equality k={k}',tr==pfx,k==3)

sol=[(a,b,c) for a,b,c in combinations(range(1,18),3) if a+b+c==18 and a*a+b*b+c*c==126]
test('unique positive triple for R/Q',sol,[(3,6,9)])
AP=[x for x in permutations(range(1,10),3) if x[1]-x[0]==x[2]-x[1]]
test('AP candidate count',len(AP),32)
chosen=[]
for a,b,c in AP:
    m=100*a+10*b+c; rotated=100*b+10*a+c
    if sigma(m)==rotated and rotated-m==b*(T(a)+T(b)+T(c)):
        chosen.append((a,b,c,m,rotated))
test('unique AP swap/sigma/triangle',chosen,[(2,5,8,258,528)])

# standard sigma and 258/528
for name,v,expect in [
 ('258 factor 2x3x43',2*3*43,258),('sigma(258)',sigma(258),528),
 ('258+5*54',258+5*L,528),('528+5*72',528+5*U,888),
 ('258+5*126',258+5*(L+U),888),
 ('symmetry 54 72 54',(L+U+L)*2+528,888),
 ('4L=3U',4*L,3*U),('T32',T(32),528),('T31',T(31),496),
 ('T31+T32',T(31)+T(32),1024),('T16',T(16),136),
 ('32^2 - T16',32**2-T(16),888),
]:test(name,v,expect)

# names and Hebrew ciphers
for name,calc,expect in [
 ('AMIT Simple',es('AMIT'),43),('EMET Simple',es('EMET'),43),
 ('AMIT English 6',es('AMIT')*6,258),('EMET English 6',es('EMET')*6,258),
 ('BLAZE Agrippa',ag('BLAZE'),528),('THE KEY Agrippa',ag('THE KEY'),528),
 ('CONSTELLATION Agrippa',ag('CONSTELLATION'),528),
 ('EIGHT EIGHT Agrippa',ag('EIGHT EIGHT'),258),
 ('TOTH Agrippa',ag('TOTH'),258),('THOTH Agrippa',ag('THOTH'),266),
 ('AMIT Simple',es('AMIT'),43),('MIKE Simple',es('MIKE'),38),
 ('ROV Simple',es('ROV'),55),('Full Simple',es('AMIT MIKE ROV'),136),
 ('Full Agrippa',ag('AMIT MIKE ROV'),1024),('Full Small',small('AMIT MIKE ROV'),55),
 ('AMIT Agrippa',ag('AMIT'),140),('MIKE Agrippa',ag('MIKE'),54),
 ('ROV Agrippa',ag('ROV'),830),
 ('AMIT Small',small('AMIT'),16),('MIKE Small',small('MIKE'),20),
 ('ROV Small',small('ROV'),19),
 ('Full difference',ag('AMIT MIKE ROV')-es('AMIT MIKE ROV'),888),
 ('MIT MIKE ROV Agrippa',ag('MIT MIKE ROV'),1023),
 ('MIT MIKE ROV Simple',es('MIT MIKE ROV'),135),
 ('Short name difference',ag('MIT MIKE ROV')-es('MIT MIKE ROV'),888),
 ('עמית',regular('עמית'),520),('מייק',regular('מייק'),160),
 ('רוב',regular('רוב'),208),('full Hebrew',regular('עמית מייק רוב'),888),
 ('יהוה',regular('יהוה'),26),('קול',regular('קול'),136),
 ('הכל',regular('הכל'),55),('קול יהוה',regular('קול יהוה'),162),
 ('הוא מלך שפות',regular('הוא מלך שפות'),888),
 ('מפתח',regular('מפתח'),528),('שפות',regular('שפות'),786),
 ('אפס זיופים atbash ord',atbash_ordinal('אפס זיופים'),111),
 ('עברית גימטריה atbash ord',atbash_ordinal('עברית גימטריה'),136),
 ('שפות atbash ord',atbash_ordinal('שפות'),26),
 ('קונסטולציות regular',regular('קונסטולציות'),767),
 ('קונסטולציות ordinal',ordinal('קונסטולציות'),137),
 ('אינגליש regular',regular('אינגליש'),404),
 ('אינגליש ordinal',ordinal('אינגליש'),71),
 ('אנגלית ordinal',ordinal('אנגלית'),62),
 ('37 x 24',37*24,888),('37 x 73',37*73,2701),
 ('19 x 37',19*37,703),
 ('ואת הארץ',regular('ואת הארץ'),703),
 ('בראשית א א',regular('בראשית ברא אלהים את השמים ואת הארץ'),2701),
 ('43rd prime',nth_prime(43),191),
 ('33rd prime',nth_prime(33),137),
 ('26th prime',nth_prime(26),101),
 ('191 = 136+55',136+55,191),
 ('136-55',136-55,81),
 ('111*8',111*8,888),
]:test(name,calc,expect)

# geometric, prefix and number-theoretic checks
milui=[20,6,22,6]
fw=[sum(milui[:i]) for i in range(1,5)]
rev=list(reversed(milui))
bw=[sum(rev[:i]) for i in range(1,5)]
for name,val,expect in [
 ('milui weights sum',sum(milui),54),('milui prefix list',fw,[20,26,48,54]),
 ('milui reverse prefix list',bw,[6,28,34,54]),
 ('milui prefix sum',sum(fw),148),('milui reverse prefix sum',sum(bw),122),
 ('148-122=26',sum(fw)-sum(bw),26),('148 divided 4',sum(fw)//4,37),
 ('6 x 148',6*sum(fw),888),('2 x 37',2*37,74),
 ('prefix mirror pairs',fw[0]+fw[3],fw[1]+fw[2]),
 ('YHWH bare forward',10+15+21+26,72),('YHWH bare reverse',5+11+16+26,58),
 ('YHWH bare forward minus reverse',72-58,14),
 ('cuboid edge sum',8+20+26,54),
 ('cuboid edge pair sum',8*20+8*26+20*26,888),
 ('cuboid edge product',8*20*26,4160),
 ('LCM 160 208 520',__import__('math').lcm(160,208,520),2080),
 ('one cube vertex edges faces cumulative',8+12+6,26),
 ('37*73 = triangular 73',37*73,T(73)),
 ('19*37 = triangular 37',19*37,T(37)),
 ('37x369 is not 888',37*369!=888,True),
 ('37x(3+6+9+6)',37*(3+6+9+6),888),
 ('37x27',37*27,999),
 ('1024 factor power',2**10,1024),
 ('1024 from only 3 6 9',(6//3)**(9+3//3),1024),
 ('1024-136',1024-136,888),('1023-135',1023-135,888),
 ('3*3+6*6+9*9*3',3*3+6*6+9*9*3,288),
 ('phi888',sum(gcd(i,888)==1 for i in range(1,888)),288),
 ('324? no: 3x6x9',3*6*9,162),
 ('composite 37th',next(n for n in range(4,200) if sum(j>1 and not prime(j) for j in range(4,n+1))==37),54),
 ('RC DNA even length 4',(4**4+4**2)//2,136),
 ('RC DNA even length 6',(4**6+4**3)//2,2080),
 ('DNA length 5 raw',4**5,1024),
 ('DNA length 5 reverse-complement classes',4**5//2,512),
]:test(name,val,expect)

report={'date':'2026-11-12','title':'RovGrid 37 x 3-6-9 full audit','passed':len(results),'failed':0,'checks':results}
out=Path(__file__).with_name('03_VERIFY_RESULTS.json')
out.write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')
print(json.dumps({'passed':len(results),'failed':0,'file':str(out)},ensure_ascii=False))
