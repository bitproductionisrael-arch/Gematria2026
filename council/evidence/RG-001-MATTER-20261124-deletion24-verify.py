from itertools import combinations
from math import comb
W = "AMITMIKEROV"
A = dict(zip("ABCDEFGHIJKLMNOPQRSTUVWXYZ",[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500]))
S = {c:i+1 for i,c in enumerate(A)}
def val(w,m): return sum(m[c] for c in w)
assert (val(W,A),val(W,S))==(1024,136)
hits=[]
for k in range(len(W)+1):
    for p in combinations(range(len(W)),k):
        r=''.join(W[i] for i in p)
        if val(r,A)==24:
            t=''.join(c for i,c in enumerate(W) if i not in p)
            hits.append((tuple(i+1 for i in p),r,t,val(t,A),val(t,S)))
expected={((1,3,6,8),'AIIE','MTMKROV',1000,112),((3,7,8),'IKE','AMTMIROV',1000,111),((6,7,8),'IKE','AMITMROV',1000,111)}
assert set(hits)==expected, hits
assert comb(23,3)-4*comb(14,3)+6*comb(5,3)==375
g='ιησουσ'
def ordinal(w,a): return sum(a.index(c)+1 for c in w)
assert ordinal(g,'αβγδεζηθικλμνξοπρστυφχψω')==87
assert ordinal(g,'αβγδεϝζηθικλμνξοπϙρστυφχψωϡ')==96
h=dict(zip('אבגדהוזחטיכלמנסעפצקרשת',[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
h.update({'ם':40,'ן':50,'ך':20,'ף':80,'ץ':90})
assert [val(w,h) for w in ['דויד','דוד','יחידה','אחרית','הימים']]==[24,14,37,619,105]
assert sum([10,8,200,70,400,200])==888
assert sum([1,8,2,7,4,2])==24
print(hits)
print('PASS')
