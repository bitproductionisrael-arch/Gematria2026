from itertools import combinations
from math import comb, lcm, isqrt
from decimal import Decimal, localcontext
from collections import Counter
V=range(1024)
E={tuple(sorted((v,v^(1<<i)))) for v in V for i in range(10)}
def voxel_edges(gray=False):
    def enc(s,x,y,z):
        f=lambda t:t^(t>>1) if gray else t
        return (s<<9)|(f(x)<<6)|(f(y)<<3)|f(z)
    out=set()
    for s in range(2):
      for x in range(8):
       for y in range(8):
        for z in range(8):
         p=[x,y,z]
         for i in range(3):
          if p[i]<7:
           q=p.copy();q[i]+=1
           out.add(tuple(sorted((enc(s,*p),enc(s,*q)))))
    return out
B=voxel_edges();G=voxel_edges(True)
assert (len(E),len(B),len(E&B),len(E-B),len(B-E))==(5120,2688,1536,3584,1152)
assert len(G)==2688 and G<=E and len(E-G)==2432
R={v for v in V if (v>>7)==0 or (v&127)==0}|{1023}
C=set(V)-R
assert len(R)==136 and len(C)==888
r=sum(u in R and v in R for u,v in E);c=sum(u in C and v in C for u,v in E)
assert (r,c,len(E)-r-c)==(460,4220,440)
assert [v for v in C|{1023} if v>>7 in (0,7) and v&127 in (0,127)]==[1023]
layer=[comb(10,k) for k in range(11)]
assert all(sum(layer[k] for k in range(11) if m>>k&1)!=136 for m in range(2048))
def rep(v):
    x,y=v>>5,v&31
    return tuple(sorted((min(x,31-x),min(y,31-y))))
orbits=Counter(map(rep,V))
assert Counter(orbits.values())=={4:16,8:120}
Q={tuple(sorted((rep(u),rep(v)))) for u,v in E if rep(u)!=rep(v)}
assert len(Q)==640 and all(rep(u)!=rep(v) for u,v in E)
D=Counter(x for e in Q for x in e)
assert Counter(D.values())=={5:16,10:120}
assert [(a,1024//a) for a in range(1,33) if 1024%a==0 and a+1024//a==136]==[(8,128)]
sol=[]
for a in range(1,isqrt(888//3)+1):
 for b in range(a,889):
    q=888-a*b
    if q<=0:break
    if q%(a+b)==0 and q//(a+b)>=b:sol.append((a,b,q//(a+b)))
assert len(sol)==16 and [t for t in sol if sum(t)==54]==[(8,20,26),(10,16,28)]
assert layer[5]==252 and 10*252==lcm(*range(1,11))==lcm(*layer)==2520
assert [70//k for k in (2,5,7)]==[35,14,10]
with localcontext() as ctx:
 ctx.prec=110
 phi=(Decimal(5).sqrt()+1)/2
 d=str(phi).split('.')[1]
 assert [sum(int(x)**2 for x in d[:n]) for n in (23,82)]==[888,2520]
assert pow(2,332192822,62761537)==6973504
assert (9*pow(2,332192822,62761537)+1)%62761537==0
print('PASS',sol)
