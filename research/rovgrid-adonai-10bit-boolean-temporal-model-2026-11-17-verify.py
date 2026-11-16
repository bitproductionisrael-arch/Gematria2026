#!/usr/bin/env python3
"""Adonai Pi addresses, 10-bit two's complement, 16 Boolean functions and temporal reversibility.
Requires: pip install mpmath
Run: python research/rovgrid-adonai-10bit-boolean-temporal-model-2026-11-17-verify.py
"""
import mpmath as mp
from collections import Counter

assert 2**10==1024
assert 136+888==1024
bits136=format(136,"010b")
bits888=format(888,"010b")
assert bits136=="0010001000"
assert bits888=="1101111000"
assert int(bits888,2)-1024==-136
assert (~136)&1023==887
assert ((~136)&1023)+1==888
assert (136+888)&1023==0
assert 136==0x88
assert 888==0x378
assert 1024//8==128
assert 888//8==111
assert 888*8==7104
assert 1024*8==8192

# Four 2-input truth-table rows, ordered 00,01,10,11. Function ids 0..15.
def gate(k,a,b):
    return (k>>(3-(2*a+b)))&1

assert len({tuple(gate(k,a,b) for a,b in ((0,0),(0,1),(1,0),(1,1))) for k in range(16)})==16
for a in (0,1):
    for b in (0,1):
        assert gate(1,a,b)==(a & b), "AND"
        assert gate(6,a,b)==(a ^ b), "XOR"
        assert gate(7,a,b)==(a | b), "OR"
        assert gate(8,a,b)==(1-(a|b)), "NOR"
        assert gate(9,a,b)==(1-(a^b)), "XNOR"
        assert gate(14,a,b)==(1-(a&b)), "NAND"
        assert gate(3,a,b)==a
        assert gate(5,a,b)==b

# Format: 2-bit tag | 4-bit first operator | 4-bit second operator
accepted=[];rejected=[];causes=Counter()
for code in range(1024):
    tag=(code>>8)&3
    f=(code>>4)&15
    g=code&15
    if tag==0 and f<=g:
        accepted.append(code)
    else:
        rejected.append(code)
        causes["tag" if tag!=0 else "out_of_order"]+=1
assert len(accepted)==136
assert len(rejected)==888
assert causes=={"tag":768,"out_of_order":120}
assert len([c for c in accepted if ((c>>4)&15)==(c&15)])==16
assert len([c for c in accepted if ((c>>4)&15)<(c&15)])==120

# An arbitrary Boolean gate f can be evaluated reversibly if inputs are preserved.
for f in range(16):
    for a in (0,1):
        for b in (0,1):
            for r in (0,1):
                r1=r ^ gate(f,a,b)
                r2=r1 ^ gate(f,a,b)
                assert r2==r
# Whereas an AND output alone cannot reconstruct the input:
assert len([(a,b) for a in (0,1) for b in (0,1) if a&b==0])==3

# 4 function-selector bits + 6 contextual bits = 10 bits, 16*64 states.
assert len({f*64+ctx for f in range(16) for ctx in range(64)})==1024
# One state per function reserved => 16 states, 1008 free states (NOT bits).
assert 1024-16==1008==16*63

# Pi positions are one-based counting after the decimal point.
mp.mp.dps=144160
digits=str(mp.pi).split('.')[1]
assert len(digits)>=144102
d=lambda n: digits[n-1]
win=lambda a,b: digits[a-1:b]
assert win(8,10)=="535"
assert win(141,143)=="535"
assert win(1440,1442)=="028"
for n,digit,back,center,fwd in [
 (10,"5","535","358","589"),
 (29,"7","327","279","795"),
 (65,"0","230","307","078"),
 (141,"5","725","253","535"),
 (143,"5","535","359","594"),
 (1441,"2","302","028","286"),
 (141410,"3","473","736","368"),
 (144101,"3","223","233","337"),
]:
    assert d(n)==digit,(n,d(n),digit)
    assert (win(n-2,n),win(n-1,n+1),win(n,n+2))==(back,center,fwd),n

# Hebrew gematria regular and ordinal:
ab="אבגדהוזחטיכלמנסעפצקרשת"
reg={c:(i+1 if i<9 else (i-8)*10 if i<18 else (i-17)*100) for i,c in enumerate(ab)}
ordd={c:i+1 for i,c in enumerate(ab)}
small={c:i%9+1 for i,c in enumerate(ab)}
val=lambda w,m:sum(m[c] for c in w)
assert val("אדני",reg)==65
assert val("אדני",ordd)==29
assert val("אדני",small)==11
assert val("יהוה",reg)==26
assert val("פאי",reg)==91
assert val("אמן",reg)==91
assert 65&26==0 and (65|26)==91 and (65^26)==91
assert 1+4+4+1==10
assert "141410"=="".join(str(ordd[c]) for c in "אדני")
assert 6*16*15+1==1441
assert 8+120==128  # unrelated control identity, no inferential role
print("PASS: 1024 states enumerated, 136 accepted/888 rejected; 16 gates, 128 reversible tests")
print("PASS: two's-complement 136/888 and Pi addresses through 144101")
print("accepted",len(accepted),"rejected",len(rejected),"reasons",dict(causes))
