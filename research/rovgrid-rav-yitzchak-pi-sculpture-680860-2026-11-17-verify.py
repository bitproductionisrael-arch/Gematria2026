#!/usr/bin/env python3
"""Exact π digits 1-based after decimal; run: pip install mpmath && python this_file.py"""
import mpmath as mp
POS=[19,54,55,56,68,86,97,208,209,680,790,860,970,6886,8668,680860]
N=680865
mp.mp.dps=N+35
pi=str(mp.pi).split('.')[1][:N]
assert len(pi)==N and pi[:22]=='1415926535897932384626'
d=lambda n:pi[n-1]
window=lambda a,b:pi[a-1:b]
checks=0
def eq(a,b,label):
 global checks
 assert a==b, (label,a,b)
 checks+=1
for n,v in {19:'4',54:'0',55:'9',56:'7',68:'1',86:'3',97:'0',208:'9',209:'7',680:'7',790:'8',860:'3',970:'6',6886:'3',8668:'0',680860:'2'}.items():
 eq(d(n),v,f'd[{n}]')
for s,a,b in [
 ('097',54,56),('097',207,209),
 ('816',67,69),('816',790,792),
 ('034',85,87),('137',859,861),('371',679,681),
 ('067',97,99),('613',970,972),
 ('913',680856,680858),('221',680859,680861),
 ('913221',680856,680861)
]: eq(window(a,b),s,f'pi[{a}:{b}]')
eq(''.join(d(n) for n in [97,790,970]),'086','086 address digits')
for n,v in {
 68:('781','816','164'),86:('803','034','348'),
 680:('537','371','710'),860:('313','137','378'),
 6886:('323','233','334'),8668:('930','304','045'),
 680860:('322','221','213')
}.items():eq((window(n-2,n),window(n-1,n+1),window(n,n+2)),v,f'windows:{n}')
eq(window(54,56),window(207,209),'same 097')
eq(window(67,69),window(790,792),'same 816')
eq(window(680856,680861),'913221','Genesis 913 + Hagvura 221')
HE='אבגדהוזחטיכלמנסעפצקרשת'
vals={c:(i+1 if i<9 else 10*(i-8) if i<18 else 100*(i-17)) for i,c in enumerate(HE)}
for f,b in zip('ךםןףץ','כמנפצ'):vals[f]=vals[b]
G=lambda word:sum(vals[c] for c in word.replace(' ',''))
for word,v in [
 ('יהוה',26),('אלהים',86),('שמע ישראל יהוה אלהינו יהוה אחד',1118),
 ('אור',207),('רוב',208),('הגבורה',221),('בראשית',913),
 ('בינה',67),('תריג',613),('יפי',100)
]:eq(G(word),v,'gematria '+word)
for a,b,label in [
 (26*86,2236,'26*86'),(2*1118,2236,'2*Shema'),
 (1414+1732,3146,'sqrt2+sqrt3, first four digits'),
 (3146+2236,5382,'+sqrt5 first four digits'),
 (26*207,5382,'26*Or'),(207+1,208,'Or+1=Rov'),
 (int(mp.sqrt(5)*1000),2236,'sqrt5 first four digits'),
 (int(mp.sqrt(2)*1000),1414,'sqrt2 first four digits'),
 (int(mp.sqrt(3)*1000),1732,'sqrt3 first four digits'),
]:eq(a,b,label)
# Video-derived numeral addresses: same backward / center / forward protocol.
video_windows={
 5:('9','159','592','926'),
 22:('6','626','264','643'),
 26:('8','338','383','832'),
 100:('9','679','798','982'),
 207:('0','810','109','097'),
  208:('9','109','097','975'),
 314:('1','631','315','155'),
 535:('2','952','522','224'),
 618:('0','560','608','082'),
 1118:('9','069','695','959'),
 1618:('1','491','919','192'),
 2236:('4','594','943','431'),
 3146:('3','073','732','325'),
 5382:('6','926','263','636')
}
for n,(digit,left,center,right) in video_windows.items():
 eq((d(n),window(n-2,n),window(n-1,n+1),window(n,n+2)),(digit,left,center,right),'video-address n='+str(n))
eq(G('רוב'),208,'Rov original address')
# Atbash 22-character flip: ר→ג3, ו→פ80, ב→ש300.
eq(3+80+300,383,'Rov Atbash centered on address 26')
eq(window(25,27),'383','d25..27')
eq(window(313,315),'315','Shaddai address 314, center')
eq(913 ^ 682,315,'913 XOR 682')
eq(window(2236,2238),'431','sqrt5 address 2236, forward')
eq(G('שדי פאי יהוה'),431,'Shaddai Pi YHWH')

print('PASS',checks,'checks for',N,'digits of Pi')
for n in POS:
 print(n,d(n),window(n-2,n),window(n-1,n+1),window(n,n+2))
