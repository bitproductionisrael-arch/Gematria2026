#!/usr/bin/env python3
# RovGrid | 12 Nov 2026 | Arithmetic verifier, no external libraries.
# Definitions of ciphers are fixed and explicit. Results do not establish any metaphysical claim.
import json
from math import gcd
from itertools import combinations
from functools import reduce
from pathlib import Path

HE_LETTERS='אבגדהוזחטיכלמנסעפצקרשת'
HE_BASE=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
HE_REG=dict(zip(HE_LETTERS,HE_BASE))
HE_ORD={x:i+1 for i,x in enumerate(HE_LETTERS)}
HE_FINAL={'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'}
AGR={'A':1,'B':2,'C':3,'D':4,'E':5,'F':6,'G':7,'H':8,'I':9,'J':600,'K':10,'L':20,'M':30,'N':40,'O':50,'P':60,'Q':70,'R':80,'S':90,'T':100,'U':200,'V':700,'W':900,'X':300,'Y':400,'Z':500}

def heb(s,method='regular'):
    s=[HE_FINAL.get(ch,ch) for ch in s if ch in HE_REG or ch in HE_FINAL]
    if method=='regular':return sum(HE_REG[ch] for ch in s)
    if method=='ordinal':return sum(HE_ORD[ch] for ch in s)
    if method=='atbash_ordinal':return sum(23-HE_ORD[ch] for ch in s)
    if method=='zero_cut_1':return sum(HE_REG[ch]//10 if HE_REG[ch]%10==0 and HE_REG[ch]>=10 else HE_REG[ch] for ch in s)
    if method=='zero_cut_2':
        return sum(int(str(HE_REG[ch]).replace('0','')) for ch in s)
    raise ValueError(method)

def eng(s,method='simple'):
    s=''.join(ch for ch in s.upper() if 'A'<=ch<='Z')
    if method=='simple':return sum(ord(ch)-64 for ch in s)
    if method=='small':return sum((ord(ch)-65)%9+1 for ch in s)
    if method=='jewish':return sum(AGR[ch] for ch in s)
    if method=='english':return 6*eng(s)
    raise ValueError(method)

def T(n):return n*(n+1)//2

def sigma(n):return sum(d for d in range(1,n+1) if n%d==0)

def totient(n):return sum(gcd(k,n)==1 for k in range(1,n+1))

def lcm(a,b):return a*b//gcd(a,b)

def prime(n):return n>1 and all(n%d for d in range(2,int(n**.5)+1))

def pindex(n):return sum(prime(i) for i in range(1,n+1))

def check(v,label,checks):
    assert v,label
    checks.append(label)


def main():
 checks=[]
 expect=[
  (heb('עמית'),520,'עמית=520'),(heb('מייק'),160,'מייק=160'),(heb('רוב'),208,'רוב=208'),
  (heb('יהוה'),26,'יהוה=26'),(heb('יוד הא ויו הא'),54,'מילוי יהוה=54'),
  (heb('קול'),136,'קול=136'),(heb('הכל'),55,'הכל=55'),(heb('דויד'),24,'דויד=24'),
  (heb('מפתח'),528,'מפתח=528'),(heb('שפות'),786,'שפות=786'),
  (heb('הוא מלך'),102,'הוא מלך=102'),(heb('הוא מלך שפות'),888,'הוא מלך שפות=888'),
  (heb('קונסטולציות'),767,'קונסטולציות=767'),
  (heb('קונסטולציות','ordinal'),137,'קונסטולציות סדרי=137'),
  (heb('קונסטולציות','zero_cut_1'),101,'קונסטולציות אפס#1=101'),
  (heb('קונסטלציות'),761,'כתיב אחר קונסטלציות=761'),
  (heb('אפס זיופים','atbash_ordinal'),111,'אפס זיופים אתבש סדרי=111'),
  (heb('עברית גימטריה','atbash_ordinal'),136,'עברית גימטריה אתבש סדרי=136'),
  (heb('שפות','atbash_ordinal'),26,'שפות אתבש סדרי=26'),
  (heb('אנגלית','ordinal'),62,'אנגלית סדרי=62'),
  (heb('אינגליש'),404,'אינגליש רגיל=404'),
  (heb('אינגליש','ordinal'),71,'אינגליש סדרי=71'),
  (heb('אינגליש','zero_cut_2'),17,'אינגליש צמצום אפס#2=17'),
  (eng('AMIT MIKE ROV'),136,'שם Simple=136'),
  (eng('AMIT MIKE ROV','small'),55,'שם Small=55'),
  (eng('AMIT MIKE ROV','jewish'),1024,'שם Jewish=1024'),
  (eng('MIT MIKE ROV','jewish'),1023,'שם ללא A Jewish=1023'),
  (eng('MIT MIKE ROV'),135,'שם ללא A Simple=135'),
  (eng('AMIT'),43,'Amit simple=43'),
  (eng('AMIT','english'),258,'Amit English=258'),
  (eng('EMET','english'),258,'EMET English=258'),
  (eng('ROV'),55,'Rov simple=55'),
  (eng('BLAZE','jewish'),528,'BLAZE Jewish=528'),
  (eng('THE KEY','jewish'),528,'THE KEY Jewish=528'),
  (eng('CONSTELLATION','jewish'),528,'CONSTELLATION Jewish=528'),
  (eng('EIGHT EIGHT','jewish'),258,'EIGHT EIGHT Jewish=258'),
  (eng('TOTH','jewish'),258,'TOTH Jewish=258'),
  (eng('THOTH','jewish'),266,'THOTH Jewish=266'),
 ]
 for v,target,label in expect:check(v==target,label,checks)
 identities=[
  (sum(T(x) for x in (2,5,8))==54,'T2+T5+T8=54'),
  (sum(T(x) for x in (3,6,9))==72,'T3+T6+T9=72'),
  (sum(x*x for x in (3,6,9))==126,'sum squares=126'),
  (3*6*9==162,'product=162'),
  (3**2+2*6**2+9**2==162,'weighted squares=162'),
  (3+6+9==18,'sum 3+6+9=18'),
  (sum(T(x) for x in (2,5,8))+sum(T(x) for x in (3,6,9))==126,'T(n-1)+T(n)=n² 369'),
  (258+5*(54+72)==888,'258+5*(54+72)=888'),
  ((54+72+54)*2+528==888,'(54+72+54)*2+528=888'),
  (sigma(258)==528,'sigma(258)=528'),
  (528-258==5*54,'528-258=5×54'),
  (888-528==5*72,'888-528=5×72'),
  (T(32)==528,'T32=528'),(T(16)==136,'T16=136'),(T(10)==55,'T10=55'),
  (136+55==191 and prime(191) and pindex(191)==43,'136+55=prime #43'),
  (888-288==600 and totient(888)==288,'Euler totient 888=288'),
  (8+20+26==54,'cuboid e1=54'),
  (8*20+8*26+20*26==888,'cuboid e2=888'),
  (8*20*26==4160,'cuboid e3=4160'),
  (lcm(lcm(520,160),208)==2080,'LCM faces=2080'),
  (T(73)==2701 and 37*73==2701,'T73=37×73=2701'),
  (T(37)==703 and 19*37==703,'T37=19×37=703'),
  (24*37==888,'24×37=888'),(148==20+26+48+54==4*37,'Milui prefixes=148'),
  (148-(6+28+34+54)==26,'forward−reverse milui=26'),
  (72-(5+11+16+26)==14,'forward−reverse YHWH=14'),
  (7*3*3+3*3==24*3,'7k²+3k=24k for k=3'),
  (816+72==888 and 888+111==999 and 999+25==1024,'816→888→999→1024 sums'),
  (2**10==1024 and (6//3)**(9+3//3)==1024,'1024 from 369 with division exponent'),
  (1024-136==888 and 1023-135==888,'A cancellation preserves 888'),
  (136-55==81 and 136+26==162,'136,55,26 closure'),
  (258+528==786 and 786+102==888,'name+key+king of languages'),
  (59*13==767,'Blaze times Echad'),
 ]
 for v,label in identities:check(v,label,checks)
 # 3,6,9 are the unique unordered distinct positive triple with sum 18 and sum squares 126.
 sols=[(a,b,c) for a in range(1,19) for b in range(a+1,19) for c in range(b+1,19) if a+b+c==18 and a*a+b*b+c*c==126]
 check(sols==[(3,6,9)],'unique triple under fixed sum and squares',checks)
 # Unique AP digit tuple among positive distinct three-digit APs meeting both transformations.
 sols2=[];cnt=0
 for a in range(1,10):
  for b in range(1,10):
   c=2*b-a
   if not (1<=c<=9 and a!=b):continue
   cnt+=1
   n=100*a+10*b+c;m=100*b+10*a+c
   if sigma(n)==m and m-n==b*(T(a)+T(b)+T(c)):sols2.append((a,b,c))
 check(cnt==32 and sols2==[(2,5,8)],'unique 258 under 32 arithmetic-progression candidates',checks)
 # Three-gematria English-Rov Hebrew link, no identity claim.
 check(eng('AMIT MIKE ROV','jewish')-eng('AMIT MIKE ROV')==888,'English difference invariant 888',checks)
 check(eng('MIT MIKE ROV','jewish')-eng('MIT MIKE ROV')==888,'English difference invariant after A',checks)
 # DNA reverse complement Burnside values, not biological identity
 dna=lambda k:(4**(2*k)+4**k)//2
 check(dna(2)==136 and dna(3)==2080,'DNA RC orbit count L4=136 L6=2080',checks)
 check(4**5==1024 and 4**5//2==512,'DNA length 5 raw vs orbit counts',checks)
 print(json.dumps({'date':'2026-11-12','verified_checks':len(checks),'candidate_APs':cnt,'unique_triplet':sols,'unique_AP_digit':sols2,'labels':checks},ensure_ascii=False,indent=2))
 if __file__:
  Path(__file__).with_suffix('.results.json').write_text(json.dumps({'verified_checks':len(checks),'candidate_APs':cnt,'unique_triplet':sols,'unique_AP_digit':sols2,'labels':checks},ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':main()