"""Verify third-depth Talmudic Milui of Genesis 1:1 against canonical RovGrid map.
No dependencies. Applies the SAME spelling map at every expansion stage.
"""
M={
 'א':'אלף','ב':'בית','ג':'גימל','ד':'דלת','ה':'הא','ו':'ויו',
 'ז':'זין','ח':'חית','ט':'טית','י':'יוד','כ':'כף','ל':'למד',
 'מ':'מם','נ':'נון','ס':'סמך','ע':'עין','פ':'פא',
 'צ':'צדי','ק':'קוף','ר':'ריש','ש':'שין','ת':'תו'}
V=dict(zip('אבגדהוזחטיכלמנסעפצקרשת',
 [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
FIN=dict(zip('ךםןףץ','כמנפצ'))
def norm(ch): return FIN.get(ch,ch)
def gem(s): return sum(V.get(norm(c),0) for c in s)
def expand(s): return ''.join(M[norm(c)] for c in s)
words='בראשית ברא אלהים את השמים ואת הארץ'.split()
all_rows=[]
for w in words:
    x=w; row=[]
    for depth in range(4):
        row.append((len(x),gem(x)))
        x=expand(x)
    all_rows.append((w,row))
totals=[
 (sum(r[d][0] for _,r in all_rows),sum(r[d][1] for _,r in all_rows))
 for d in range(4)
]
assert totals==[(28,2701),(75,5476),(204,11667),(561,29869)],totals
assert [(w,r[3]) for w,r in all_rows]==[
 ('בראשית',(137,7782)),('ברא',(70,4640)),('אלהים',(88,4865)),
 ('את',(35,1538)),('השמים',(82,3673)),('ואת',(62,2142)),
 ('הארץ',(87,5229))]
assert 561==33*34//2==17*33
assert 29869==53*561+136
assert divmod(29869,561)==(53,136)
assert 136==16*17//2
assert 5476==75*73+1==74**2
assert 11667==108**2+3
assert 29869==173**2-60
print("PASS: full Genesis Talmudic Milui depths 0..3",totals)
for word,row in all_rows:print(word,row)
print("PASS: 561=T33; 53=P16; 136=T16; quotient=53 remainder=136")
