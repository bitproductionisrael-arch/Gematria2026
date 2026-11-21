#!/usr/bin/env python3
# RovGrid / Gematria2026 — exhaustive +24-digit left-extension with zero allowed.
# Requires: pip install sympy
# Caution: for >2^64, SymPy uses BPSW; passing is NOT a formal prime certificate.
from sympy import isprime

ROOT = "357686312646216567629137"
PREFIX = "209001069090000000000000"
SECOND = "403000009090000000000000"

def suffixes_are_probable_prime(s: str) -> bool:
    return all(isprime(int(s[i:])) for i in range(len(s)))

def miller_rabin(n: int, bases=(2,3,5,7,11,13,17,19,23,29,31,37,41,43)) -> bool:
    if n < 2: return False
    if n in bases: return True
    if any(n % p == 0 for p in bases): return False
    d, shifts = n-1, 0
    while d % 2 == 0:
        d //= 2
        shifts += 1
    for a in bases:
        x = pow(a, d, n)
        if x in (1, n-1): continue
        for _ in range(shifts-1):
            x = x*x % n
            if x == n-1: break
        else: return False
    return True

def all_extensions(root=ROOT, digits=24):
    # Retain the *string*, including zero-padding.
    states = {(int(root), "")}
    for step in range(1, digits+1):
        place = 10 ** (len(root)+step-1)
        next_states = set()
        for n, prefix in states:
            next_states.add((n, "0"+prefix))
            for d in range(1, 10):
                nn = n + d*place
                if isprime(nn):
                    next_states.add((nn, str(d)+prefix))
        states = next_states
    return sorted(prefix+root for _,prefix in states if prefix[0] != "0")

def run():
    assert len(ROOT) == len(PREFIX) == 24
    assert "0" not in ROOT
    assert suffixes_are_probable_prime(ROOT)
    assert sum(map(int, ROOT)) == 112
    for d in range(1,10):
        assert not isprime(int(str(d)+ROOT))
    results = all_extensions()
    assert len(results) == 7, (len(results), results)
    a, b = PREFIX+ROOT, SECOND+ROOT
    assert a in results and b in results
    assert len(a) == len(b) == 48
    assert sum(map(int, PREFIX)) == 36
    assert sum(map(int, a)) == 148 == 4*37
    assert sum(map(int, b)) == 137
    for s in results:
        assert suffixes_are_probable_prime(s), s
        for start in range(48):
            assert miller_rabin(int(s[start:])), (s, start)
    active_counts = [sum(c != "0" for c in s[:24]) for s in results]
    assert max(active_counts) == 6 and active_counts.count(6) == 1
    print("PASS — BPSW + independent Miller-Rabin witnesses on each suffix")
    print("Seven candidate 48-digit continuations:")
    for s in results:
        print(s, "digit sum", sum(map(int,s)))
    print("Best: 24 added digits =", PREFIX)
    print("Best: 48-digit probable prime =", a)
    print("Best: digit sum = 148 = 4×37")
    print("Other: digit sum = 137 =", b)
    print("Active left additions: ")
    for step in range(1,25):
        if PREFIX[-step] != "0":
            print("step",step,"digit",PREFIX[-step],"value",int(PREFIX[-step:]+ROOT))
    print("NOTE: certificate of primality for all >2^64 stages still needed.")

if __name__ == "__main__":
    run()
