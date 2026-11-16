#!/usr/bin/env python3
"""Exhaustive ABC 3/6/9 Fibonacci-state proof: 8-state orbit + neutral fixed point."""
from itertools import product

S=(3,6,9)
def residue(n): return n%9
def abc(n):
    return n%9 or 9
def add(a,b):
    assert a in S and b in S
    return abc(a+b)
def step(pair):
    a,b=pair
    return (b,add(a,b))
def previous(pair):
    c,d=pair
    return (abc(d-c),c)

# Nine input pairs. Addition modulo9 is closed on three residues.
assert len({add(a,b) for a,b in product(S,repeat=2)})==3
assert [add(3,b) for b in S]==[6,9,3]
assert [add(6,b) for b in S]==[9,3,6]
assert [add(9,b) for b in S]==[3,6,9]
assert all(add(9,x)==x==add(x,9) for x in S)
assert add(3,6)==9 and add(6,3)==9

states=set(product(S,repeat=2))
assert len(states)==9
diagonal={(a,b) for a,b in states if a==b}
offdiagonal=states-diagonal
assert len(diagonal)==3 and len(offdiagonal)==6

orbit=[]
cur=(3,6)
while cur not in orbit:
    orbit.append(cur)
    cur=step(cur)
expected=[(3,6),(6,9),(9,6),(6,6),(6,3),(3,9),(9,3),(3,3)]
assert orbit==expected and cur==(3,6) and len(orbit)==8
assert states-set(orbit)=={(9,9)}
assert step((9,9))==(9,9)
assert sum(a==b for a,b in orbit)==2
assert sum(a!=b for a,b in orbit)==6

# The Fibonacci update map is invertible, even though the user may choose
# to *apply* it only in a forward direction with an increasing time counter.
assert all(previous(step(s))==s for s in states)
assert all(step(previous(s))==s for s in states)

# Standard Fibonacci F0=0,F1=1, scaled and shifted by 3:
F=[0,1]
for i in range(50): F.append(F[-1]+F[-2])
sequence=[abc(3*F[i+2]) for i in range(25)]
assert sequence[:10]==[3,6,9,6,6,3,9,3,3,6]
assert all(sequence[i]==sequence[i+8] for i in range(17))

# Explicit clock: identical phase at t and t+8, but cycle count advances.
for t in range(0,64):
    assert orbit[t%8]==orbit[(t+8)%8]
    assert (t+8)//8==t//8+1
    if t%8==0:
        assert orbit[t%8]==(3,6)

# Three semantic states may be represented in binary with 2 physical bits.
# Those semantic tags must not equate the 0 false value with the residue 0/9.
semantic={"false":0b10,"true":0b11,"neutral":0b00}
assert len(set(semantic.values()))==3
assert 0 not in (semantic["false"],semantic["true"])

# Four-step additive complement and eight-step identity across all nine states.
def iterate(s,k):
    for _ in range(k):
        s=step(s)
    return s
for s in states:
    inverse_pair=(abc(-s[0]),abc(-s[1]))
    assert iterate(s,4)==inverse_pair,(s,iterate(s,4),inverse_pair)
    assert iterate(s,8)==s
assert iterate((3,6),4)==(6,3)

print("PASS 9 ordered state pairs; 8-cycle + 1 neutral fixed point; 3 diagonal and 6 off-diagonal")
print("PASS invertibility, Fibonacci period 8 on multiples of 3 mod 9, unidirectional clock phase+lap")
for i,p in enumerate(orbit): print(f"t={i}: {p} -> {step(p)}")
