#!/usr/bin/env python3
"""Verify RovGrid AIQ BKR cycle, 888 solar magic square, historical Kameas."""
from itertools import permutations
VAL=dict(zip("אבגדהוזחטיכלמנסעפצקרשת",[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
VAL.update({'ך':500,'ם':600,'ן':700,'ף':800,'ץ':900})
GROUPS=("איק","בכר","גלש","דמת","הנך","וסם","זען","חפף","טצץ")
T={c:g[(i+1)%3] for g in GROUPS for i,c in enumerate(g)}
assert len(T)==27 and len(set(T.values()))==27
def transform(s): return ''.join(T[c] for c in s)
def val(s): return sum(VAL[c] for c in s)
original=["עמית","מייק","רוב"]
sequence=[original]
for _ in range(3):sequence.append([transform(s) for s in sequence[-1]])
assert sequence[3]==sequence[0]
assert sequence[1]==["ןתקד","תקקא","בסכ"]
assert sequence[2]==["זדאמ","דאאי","כםר"]
fig=[[val(s) for s in row] for row in sequence]
assert fig==[[520,160,208],[1204,601,82],[52,16,820],[520,160,208]]
tot=[sum(row) for row in fig]
assert tot==[888,1887,888,888]
assert tot[1]-tot[0]==999==tot[1]-tot[2]
assert sum(tot[:3])==3663==33*111==99*37
assert [sum(fig[j][i] for j in range(3)) for i in range(3)]==[1776,777,1110]
assert 888+999==1887 and 888*9==999*8
assert 888==8*111==24*37
assert 999==9*111==27*37
assert 1887==17*111==51*37
assert 8+6==14 and 8*10+6==86==1+30+5+10+40==2*43
assert 8*10+6!=8+6
def grand_total(n):return n*n*(n*n+1)//2
def line_sum(n):return n*(n*n+1)//2
assert grand_total(6)==666 and grand_total(7)==1225
assert all(grand_total(n)!=888 for n in range(1,100))
assert line_sum(12)==870 and line_sum(13)==1105
assert all(line_sum(n)!=888 for n in range(1,100))
sun=[[6,32,3,34,35,1],[7,11,27,28,8,30],[19,14,16,15,23,24],
     [18,20,22,21,17,13],[25,29,10,9,26,12],[36,5,33,4,2,31]]
assert sorted(sum(sun,[]))==list(range(1,37))
assert all(sum(r)==111 for r in sun)
p=(0,2,3,1,5,4) # one per row/column; one on each major diagonal
assert len(set(p))==6 and sum(i==p[i] for i in range(6))==1
assert sum(i+p[i]==5 for i in range(6))==1
new=[[sun[i][j]+(37 if p[i]==j else 0) for j in range(6)] for i in range(6)]
assert new==[[43,32,3,34,35,1],[7,11,64,28,8,30],[19,14,16,52,23,24],
             [18,57,22,21,17,13],[25,29,10,9,26,49],[36,5,33,4,39,31]]
assert len(set(sum(new,[])))==36 and min(sum(new,[]))>0
assert all(sum(row)==148 for row in new)
assert all(sum(new[i][j] for i in range(6))==148 for j in range(6))
assert sum(new[i][i] for i in range(6))==148
assert sum(new[i][5-i] for i in range(6))==148
assert sum(map(sum,new))==888==6*148
# Agrippa and Fideler/RovGrid external anchors
assert 260*2==520 and 2080*2==4160==8*20*26
assert 64+9==73 and 64-9==55 and 64+9-36==37
assert 9*74==666 and 12*74==888 and 24*74==1776 and 32*74==2368
assert 1040==16*65 and 1111==10+800+300+1
assert 769**2==591361 and 666*888==591408 and 591408-591361==47
print("PASS: AIQ BKR 888 -> 1887 -> 888; 6x6 positive distinct-cell 888 magic square.")


# Proposed symbolic Earth designation of expanded solar square:
# "הארץ" and "צור" in regular Hebrew gematria, final ץ=90.
assert val("הארץ") == 296
assert val("ארץ") == 291
assert val("צור") == 296
assert 296 == 8*37 and 148 == 296//2 == 4*37
assert all(sum(new[i])+sum(new[i+1]) == 296 for i in (0,2,4))
assert all(sum(new[i][c]+new[i][c+1] for i in range(6)) == 296 for c in (0,2,4))
assert sum(new[i][i] for i in range(6)) + sum(new[i][5-i] for i in range(6)) == 296
assert sum(map(sum,new)) == 3*296 == 888 == 24*37
assert 666+6*37 == 888 and 6*37 == 222
print('PASS: proposed Earth square label: הארץ=צור=296; every row-pair=296; full sum 888.')
