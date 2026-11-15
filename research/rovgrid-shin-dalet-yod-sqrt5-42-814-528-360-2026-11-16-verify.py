#!/usr/bin/env python3
# RovGrid independent verification, 2026-11-16. Requires mpmath.
# 1-based fractional indices; no leading integer part, zeros retained.
from collections import defaultdict, Counter
from bisect import bisect_left
import argparse, random
import mpmath as mp
ALPHA='אבגדהוזחטיכלמנסעפצקרשת'
FINALS=dict(zip('ךםןףץ','כמנפצ'))
HE_VALUES=[1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]
VAL=dict(zip(ALPHA,HE_VALUES))
FINAL_SMALL={'ך':5,'ם':6,'ן':7,'ף':8,'ץ':9}
SMALL={c:i%9+1 for i,c in enumerate(ALPHA)}
PHRASE='שין דלת יוד'
WORDS=PHRASE.split()
def norm(w): return ''.join(FINALS.get(c,c) for c in w)
def fold_word(w):
    v=sum(VAL[c] for c in norm(w))
    return 0 if v==0 else 1+(v-1)%9
def locate_chains(ds, max_len=80):
    # A chain means S2(window)=360 followed by 434 and literal two digits "42".
    pref=[0]
    for ch in ds:pref.append(pref[-1]+int(ch)**2)
    loc=defaultdict(list)
    for j,p in enumerate(pref):loc[p].append(j)
    hits=[]
    for k in range(1,len(ds)-1):
        if ds[k:k+2]!='42':continue
        for j in loc.get(pref[k]-434,()):
            if j>=k:break
            if k-j>max_len:continue
            for i in loc.get(pref[j]-360,()):
                if i>=j:break
                if j-i<=max_len:
                    hits.append((i+1,j,j+1,k,k+1,k+2))
    return hits
def digit_map(ds):
    return dict(zip(ALPHA,map(int,ds[:22])))
def method_value(phrase,mapping):
    return sum(mapping[c] for w in phrase.split() for c in norm(w))
def verify():
    mp.mp.dps=10100
    constants={
        'pi':mp.pi,'e':mp.e,'phi':mp.phi,
        'sqrt2':mp.sqrt(2),'sqrt3':mp.sqrt(3),'sqrt5':mp.sqrt(5),
        'sqrt7':mp.sqrt(7),'sqrt10':mp.sqrt(10),
        'sqrt37':mp.sqrt(37),'sqrt73':mp.sqrt(73),'sqrt888':mp.sqrt(888),
        'inv37':mp.mpf(1)/37,'inv73':mp.mpf(1)/73,
    }
    results={}
    for k,v in constants.items():
        d=str(v).split('.')[1][:10000]
        assert len(d)==10000,(k,len(d))
        results[k]=locate_chains(d)
    assert len(constants)==13
    assert results['sqrt5']==[
        (711,717,718,729,730,731),
        (1434,1448,1449,1460,1461,1462),
    ],results['sqrt5']
    assert all(len(v)==0 for k,v in results.items() if k!='sqrt5')
    sq5=str(constants['sqrt5']).split('.')[1][:10000]
    assert sq5[710:717]=='1946989'
    assert sq5[717:729]=='970180818952'
    assert sq5[729:731]=='42'
    assert sq5[1433:1448]=='509038577541004'
    assert sq5[1448:1460]=='219368498725'
    assert sq5[1460:1462]=='42'
    assert 731*2==1462
    for st,en,t in [(711,717,360),(718,729,434),(730,731,20),
                    (1434,1448,360),(1449,1460,434),(1461,1462,20)]:
        assert sum(int(ch)**2 for ch in sq5[st-1:en])==t
    home_words=[method_value(w,digit_map(sq5)) for w in WORDS]
    assert home_words==[21,10,11],home_words
    assert sum(home_words)==42
    normal_regular=sum(VAL[ch] for w in WORDS for ch in norm(w))
    assert normal_regular==814
    atbashord=sum(23-(ALPHA.index(ch)+1) for w in WORDS for ch in norm(w))
    assert atbashord==104
    smfinal=sum(FINAL_SMALL.get(ch,SMALL.get(ch,0)) for ch in PHRASE.replace(' ',''))
    assert smfinal==33
    assert sum(map(fold_word,WORDS))==13
    pi_digits=str(constants['pi']).split('.')[1]
    e_digits=str(constants['e']).split('.')[1]
    assert method_value(PHRASE,digit_map(pi_digits))==48
    assert method_value(PHRASE,digit_map(e_digits))==28
    assert 814==22*37
    assert 814+74==888==24*37
    assert 814+74+111==999==27*37
    assert 74+434+20==528
    assert 74+360==434
    assert 528+360==888
    all_42=sum(sq5[i:i+2]=='42' for i in range(9999))
    assert all_42==111
    return sq5,results,all_42
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--shuffle',type=int,default=0,help='Number of digit-permutation null controls; seed fixed')
    args=parser.parse_args()
    ds,results,all_42=verify()
    print('PASS: 13 constants × 10000 fractional digits; chain 360→434→[42], each initial window ≤80 digits')
    print('sqrt5 exact hit coordinates:',results['sqrt5'])
    print('Other 12 constants: 0 hits')
    print('sqrt5 occurrence count of literal 42:',all_42)
    print('Gematria: regular 814, atbash-ordinal 104, small-finals 33, word-reduced 13, sqrt5 alphabet 42')
    print('Verified: 111 + (74 + 434 + 20) + 360 = 999; 814→888→999 in 37-multiples')
    if args.shuffle:
        rng=random.Random(20261116)
        arr=list(ds)
        hist=Counter()
        for _ in range(args.shuffle):
            rng.shuffle(arr)
            hist[len(locate_chains(''.join(arr)))] +=1
        print('Digit-shuffle control:',args.shuffle,'P(>=1)=',sum(v for k,v in hist.items() if k>=1)/args.shuffle,'P(>=2)=',sum(v for k,v in hist.items() if k>=2)/args.shuffle,'counts:',dict(sorted(hist.items())))
if __name__=='__main__':main()
