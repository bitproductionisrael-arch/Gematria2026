#!/usr/bin/env python3
# RovGrid Hebrew matrix: independent, exact, finite audit. Python 3.10+, no dependencies.
# Caveat: all candidate layouts share the original 11 Hebrew-letter multiset and row sums.
from collections import Counter
from itertools import combinations, permutations

VALUES=(1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400)
ORD={v:i+1 for i,v in enumerate(VALUES)}
NAME=((70,40,10,400),(40,10,10,100),(200,6,2,0))
BAG=tuple(v for row in NAME for v in row if v)
SUMS=(520,160,208)
assert len(BAG)==11 and sum(BAG)==888
assert tuple(sum(r) for r in NAME)==SUMS

def pair(v):
    if not v:return 0
    p=ORD[v]
    return p-1 if p%2==0 else p+1

def forward(v):
    return VALUES[ORD[v]%22] if v else 0

def phi(n):
    result=n
    d=2
    while d*d<=n:
        if n%d==0:
            while n%d==0:n//=d
            result-=result//d
        d+=1
    return result-result//n if n>1 else result

def det3(rows):
    (a,b,c),(d,e,f),(g,h,i)=rows
    return a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g)

def matrix(rows):
    return [[pair(v) for v in row] for row in rows]

def properties(rows):
    U=matrix(rows)
    M=[row[1:] for row in U]
    tr=M[0][0]+M[1][1]+M[2][2]
    det=det3(M)
    cols=[sum(row[j] for row in rows) for j in range(4)]
    mx=sum(j*cols[j] for j in range(4))
    my=sum(i*sum(row) for i,row in enumerate(rows))
    ocols=[sum(ORD.get(row[j],0) for row in rows) for j in range(4)]
    integral=2*ocols[1]+3*ocols[2]+4*ocols[3]
    f=cols[0]-cols[2]==phi(888) and cols[1]-cols[3]==-444
    fs=[[forward(v) for v in row] for row in rows]
    shift_det=det3([row[1:] for row in fs])
    diags=sum((rows[0][0],rows[1][1],rows[2][2],
               rows[0][1],rows[1][2],rows[2][3],
               rows[0][2],rows[1][1],rows[2][0],
               rows[0][3],rows[1][2],rows[2][1]))
    return tr,det,mx-my,integral,f,shift_det,diags

U=matrix(NAME)
M=[r[1:] for r in U]
assert [sum(r) for r in U]==[59,52,25]
assert sum(map(sum,U))==136
assert det3(M)==-136
assert sum(M[0][i]*M[0][i] for i in ())==0 # no-op sanity
assert sum(M[i][i] for i in range(3))==23
# Characteristic polynomial: t^3 - tr t^2 + (sum principal 2x2 minors)t - det
principal=sum(M[i][i]*M[j][j]-M[i][j]*M[j][i] for i in range(3) for j in range(i+1,3))
assert principal==-80
assert properties(NAME)==(23,-136,1024,288,True,-2080,768)
assert phi(888)==288
assert sum(ORD[v] for v in BAG)==141
assert sum((23-ORD[v]) for v in BAG)==112
assert sum(pair(v) for v in BAG)==136

# Two distinct 4+4+3 groupings of the entire 11-letter multiset satisfy the row sums.
groups=set()
for A in combinations(range(11),4):
    if sum(BAG[i] for i in A)!=SUMS[0]:continue
    remaining=tuple(i for i in range(11) if i not in A)
    for B in combinations(remaining,4):
        if sum(BAG[i] for i in B)!=SUMS[1]:continue
        C=tuple(i for i in remaining if i not in B)
        if sum(BAG[i] for i in C)!=SUMS[2]:continue
        groups.add((tuple(sorted(BAG[i] for i in A)),
                    tuple(sorted(BAG[i] for i in B)),
                    tuple(sorted(BAG[i] for i in C))))
assert len(groups)==2

stats=Counter()
winner=[]
for A,B,C in groups:
    for a in set(permutations(A)):
        for b in set(permutations(B)):
            for c in set(permutations(C+(0,))):
                rows=(a,b,c)
                tr,det,moment,integral,f,shift_det,diags=properties(rows)
                stats['all']+=1
                stats['trace23']+=(tr==23)
                stats['det_minus136']+=(det==-136)
                stats['trace_and_det']+=(tr==23 and det==-136)
                stats['moment1024']+=(moment==1024)
                stats['fourier']+=f
                stats['integral288']+=(integral==288)
                stats['fourier_integral']+=(f and integral==288)
                stats['forward_det_minus2080']+=(shift_det==-2080)
                stats['diag768']+=(diags==768)
                if tr==23 and det==-136:winner.append(rows)

expected={
'all':10368,'trace23':864,'det_minus136':6,'trace_and_det':1,
'moment1024':21,'fourier':2,'integral288':78,'fourier_integral':1,
'forward_det_minus2080':3,'diag768':1152
}
assert dict(stats)==expected,(stats,expected)
assert winner==[NAME],winner
print('136 = sum(U) =',sum(map(sum,U)))
print('-136 = det(M) =',det3(M))
print('trace(M)=23; characteristic polynomial t^3-23*t^2-80*t+136')
print('row sums:',SUMS,'; matrix:',NAME)
print('scope: original 11 letters, fixed row sums, 4+4+3 cells, variable blank position')
print('groups:',groups)
print('counts:',dict(stats))
print('All reproducible assertions passed.')
