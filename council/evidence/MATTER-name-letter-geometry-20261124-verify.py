from itertools import product
from collections import Counter
from math import gcd, isqrt, acos, degrees
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import DecomposingRecordingPen
from pathlib import Path
from hashlib import sha256
H='עמית מייק רוב'; E='AMIT MIKE ROV'
he=dict(zip('אבגדהוזחטיכלמנסעפצקרשת',[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
ordhe={c:i+1 for i,c in enumerate(he)}
S={c:i+1 for i,c in enumerate('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}
J=dict(zip(S,[1,2,3,4,5,6,7,8,9,600,10,20,30,40,50,60,70,80,90,100,200,700,900,300,400,500]))
def sums(w,m):return [sum(m[c] for c in t) for t in w.split()]
assert [len(w) for w in H.split()]==[len(w) for w in E.split()]==[4,4,3]
assert H.replace(' ','')[5]=='י' and E.replace(' ','')[5]=='I'
assert sums(H,he)==[520,160,208] and sums(H,ordhe)==[61,52,28]
assert sums(E,S)==[43,38,55] and sums(E,J)==[140,54,830]
A,B,C=sums(H,he);d=gcd(gcd(A,B),C);assert d==8
assert [A//d,B//d,C//d]==[65,20,26]
assert B*C==d*d*A
assert (sum(sums(E,S))//d,sum(sums(E,J))//d)==(17,128)
assert (d, B//d,C//d)==(8,20,26)
def key(bits):
 x=int(''.join(map(str,bits[:5][::-1])),2); y=int(''.join(map(str,bits[5:])),2)
 return tuple(sorted((min(x,31-x),min(y,31-y))))
assert Counter(Counter(key(b) for b in product((0,1),repeat=10)).values())=={4:16,8:120}
assert [i for i in range(1,11) if i not in (4,8)]==[1,2,3,5,6,7,9,10]
assert 2**3+2**7==136 and 2**3*2**7==1024
assert B*C//A==64 and isqrt(B*C//A)==8
assert 8*20==B and 8*26==C and 20*26==A
assert 111&17==1 and 111|17==127 and 111^17==126
assert 888&136==8 and 888|136==1016 and 888^136==1008
def measure(fontpath,word):
 font=TTFont(fontpath); gs=font.getGlyphSet(); cmap=font.getBestCmap(); result={}
 for ch in dict.fromkeys(word.replace(' ','')):
  pen=DecomposingRecordingPen(gs);gs[cmap[ord(ch)]].draw(pen)
  start=last=None; seg=[];right=other=0
  def finish(seg):
   r=o=0
   for (p,q,l),(u,v,m) in zip(seg,seg[1:]+seg[:1]):
    if not(l and m and q==u):continue
    a=(q[0]-p[0],q[1]-p[1]);b=(v[0]-u[0],v[1]-u[1])
    if a==(0,0) or b==(0,0):continue
    dot=a[0]*b[0]+a[1]*b[1];cross=a[0]*b[1]-a[1]*b[0]
    if dot==0:r+=1
    elif cross!=0:o+=1
   return r,o
  for op,pts in pen.value:
   if op=='moveTo':start=last=pts[0];seg=[]
   elif op=='lineTo':
    if last!=pts[0]:seg.append((last,pts[0],True))
    last=pts[0]
   elif op in ('qCurveTo','curveTo'):
    end=pts[-1] or start;seg.append((last,end,False));last=end
   elif op=='closePath':
    if last!=start:seg.append((last,start,True))
    r,o=finish(seg);right+=r;other+=o
   elif op=='endPath':raise ValueError('open contour')
  result[ch]=(right,other)
 totals=[tuple(sum(result[c][i] for c in w) for i in range(2)) for w in word.split()]
 return sha256(Path(fontpath).read_bytes()).hexdigest(),result,totals
base=Path('/usr/share/fonts/truetype')
for f,w in [(base/'noto/NotoSansHebrew-Regular.ttf',H),(base/'noto/NotoSerifHebrew-Regular.ttf',H),(base/'dejavu/DejaVuSans.ttf',E),(base/'dejavu/DejaVuSerif.ttf',E)]:
 print(f.name,measure(f,w))
print('cuboid diagonal angles',[degrees(acos(x/(8**2+20**2+26**2)**.5)) for x in (8,20,26)])
print('PASS')
