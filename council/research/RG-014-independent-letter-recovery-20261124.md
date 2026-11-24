# Independent Hebrew multiset recovery
Executed Python exhaustive recursive enumeration of standard 22 Hebrew letter values, 11 letters, exact column histogram [0,6,3,6,1,3,3,2,1,0] ascending. Results: 12 multisets before multiplicity constraint; exactly 1 after requiring multiplicities [1,1,1,1,1,1,2,3]; small gematria33 redundant. Unique result [(2,1),(6,1),(10,3),(40,2),(70,1),(100,1),(200,1),(400,1)]. Conditional recovery only: histogram and multiplicity pattern derived from original name, not independently generated from English totals. Order not recovered. External report English claims not independently audited here.
Reproduce:
```python
v=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
target=[0,6,3,6,1,3,3,2,1,0]
sols=[]
def f(i,n,t,a):
 if n==0:
  if not any(t):sols.append(a)
  return
 if i==len(v):return
 x=v[i]; b=[(x>>j)&1 for j in range(10)]
 m=min([n]+[t[j] for j in range(10) if b[j]])
 for k in range(m+1):
  f(i+1,n-k,[z-k*w for z,w in zip(t,b)],a+([(x,k)] if k else []))
f(0,11,target,[])
print(len(sols))
print([a for a in sols if sorted(k for _,k in a)==[1]*6+[2,3]])
```
MATTER/JUDGE: replicate and audit minimal constraints; seek independent histogram generation and order-sensitive invariant. No formal lock.