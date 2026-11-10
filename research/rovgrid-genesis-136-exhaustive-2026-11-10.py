#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""RovGrid Genesis 136: exact counts and streaming exhaustive enumeration.

Requires Python 3.9+; no third-party packages.
Inputs: the four saved WLC Genesis JSON shards under research/data/.

Examples (from repository root):
  python research/rovgrid-genesis-136-exhaustive-2026-11-10.py --verify
  python research/rovgrid-genesis-136-exhaustive-2026-11-10.py --verse 1:3 --all
  python research/rovgrid-genesis-136-exhaustive-2026-11-10.py --verse 1:2 --mode positive --all
  python research/rovgrid-genesis-136-exhaustive-2026-11-10.py --verse 8:21 --max-output 10
  python research/rovgrid-genesis-136-exhaustive-2026-11-10.py --verse 1:2 --all > verse-1-2.tsv

Term occurrences are identified by 1-based word positions. For instance, two
occurrences of an identical word may be chosen separately, but each occurrence
gets only one of three signs: +, -, or omitted. Algebraic reordering is NEVER
counted again. In general there are too many signed witnesses to materialize
(838550888815 over the book); --all is deliberately an explicit choice.
"""
import argparse
import json
from collections import defaultdict
from pathlib import Path

DATA = Path(__file__).resolve().parent / "data"
SEGMENTS = ["01-10", "11-25", "26-40", "41-50"]
AB = "אבגדהוזחטיכלמנסעפצקרשת"
VALUE = {c: (i+1 if i < 9 else (i-8)*10 if i < 18 else (i-17)*100)
         for i,c in enumerate(AB)}
for final, initial in {"ך":"כ", "ם":"מ", "ן":"נ", "ף":"פ", "ץ":"צ"}.items():
    VALUE[final] = VALUE[initial]

def value(word):
    unknown = set(word) - set(VALUE)
    if unknown:
        raise ValueError(f"Unknown consonants {unknown!r} in {word!r}")
    return sum(VALUE[c] for c in word)

def corpus():
    for seg in SEGMENTS:
        fn = DATA / f"genesis-kol-136-2026-11-10-chapters-{seg}.json"
        j = json.loads(fn.read_text(encoding="utf-8"))
        yield from j["verses"]

def count_signed(values, target=136):
    dp = {0: 1}
    for v in values:
        newer = dp.copy()    # omit each occurrence
        for subtotal, ways in dp.items():
            newer[subtotal+v] = newer.get(subtotal+v,0) + ways
            newer[subtotal-v] = newer.get(subtotal-v,0) + ways
        dp = newer
    return dp.get(target,0)

def count_plus(values, target=136):
    dp = [0] * (target+1)
    dp[0] = 1
    for v in values:
        if v <= target:
            for t in range(target,v-1,-1):
                dp[t] += dp[t-v]
    return dp[target]

def suffix_reachability(values, mode="signed", target=136):
    n = len(values)
    if mode == "positive":
        masks=[0]*(n+1)
        masks[n]=1
        limit=(1<<(target+1))-1
        for i in range(n-1,-1,-1):
            masks[i]=(masks[i+1]|(masks[i+1]<<values[i]))&limit
        return masks,0
    span = sum(values)
    masks=[0]*(n+1)
    masks[n]=1<<span
    for i in range(n-1,-1,-1):
        v=values[i]
        masks[i]=masks[i+1] | (masks[i+1]<<v) | (masks[i+1]>>v)
    return masks,span

def enumerate_witnesses(words, mode="signed", target=136, max_output=None):
    vals=[value(w) for w in words]
    masks,offset=suffix_reachability(vals,mode=mode,target=target)
    chosen=[]
    emitted=0
    def possible(i,remaining):
        position=offset+remaining
        return position>=0 and ((masks[i]>>position)&1)==1
    def dfs(i,remaining):
        nonlocal emitted
        if max_output is not None and emitted>=max_output:
            return
        if not possible(i,remaining):
            return
        if i == len(words):
            if remaining==0:
                emitted += 1
                yield chosen.copy()
            return
        # Skip, add, subtract, in that deterministic order; one decision per index.
        yield from dfs(i+1,remaining)
        chosen.append((i+1,words[i],"+",vals[i]))
        yield from dfs(i+1,remaining-vals[i])
        chosen.pop()
        if mode=="signed":
            chosen.append((i+1,words[i],"-",vals[i]))
            yield from dfs(i+1,remaining+vals[i])
            chosen.pop()
    yield from dfs(0,target)

def as_equation(chosen,target=136):
    pos=[w for _,w,s,_ in chosen if s=="+"]
    neg=[w for _,w,s,_ in chosen if s=="-"]
    text=" + ".join(pos)
    if neg:
        text+=" - "+" - ".join(neg)
    return text+f" = {target}"

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument("--verse",help="Specify chapter:verse (e.g., 1:2) for enumeration.")
    p.add_argument("--mode",choices=("signed","positive"),default="signed")
    p.add_argument("--max-output",type=int,default=1000)
    p.add_argument("--all",action="store_true",help="Disable output cap; beware huge results!")
    p.add_argument("--verify",action="store_true",help="Recompute whole-book totals.")
    args=p.parse_args()
    if args.verify:
        signed=0
        positive=0
        direct=0
        hits=0
        zeros=0
        for verse in corpus():
            words=verse["text"].split()
            vals=[value(w) for w in words]
            s=count_signed(vals)
            a=count_plus(vals)
            signed+=s
            positive+=a
            direct+=sum(v==136 for v in vals)
            hits+=bool(s)
            zeros+=not bool(s)
        print("verses",hits+zeros,"hits",hits,"no_hits",zeros)
        print("signed",signed,"positive",positive,"direct_occurrences",direct)
        assert (hits,zeros,signed,positive,direct)==(
            1451,82,838550888815,1141,59)
        print("PASS: all totals are exact")
    if args.verse:
        try:
            ch,vs=map(int,args.verse.split(":"))
        except ValueError as exc:
            raise SystemExit("--verse must be chapter:verse") from exc
        target_verse=next((v for v in corpus()
                           if (v["chapter"],v["verse"])==(ch,vs)),None)
        if target_verse is None:
            raise SystemExit(f"Verse {args.verse} not found")
        words=target_verse["text"].split()
        vals=[value(w) for w in words]
        total=count_signed(vals) if args.mode=="signed" else count_plus(vals)
        print(f"# Genesis {args.verse}; mode={args.mode}; exact solutions={total}")
        print("# position:word:sign:value columns; each occurrence used once")
        cap=None if args.all else args.max_output
        for solution in enumerate_witnesses(words,mode=args.mode,max_output=cap):
            print(as_equation(solution)+"\t"+
                  ",".join(f"{i}:{w}:{sgn}:{v}" for i,w,sgn,v in solution))
        if cap is not None and total>cap:
            print(f"# displayed {cap} of {total}. Use --all to stream the rest.")
    elif not args.verify:
        p.error("Choose --verse chapter:verse or --verify")

if __name__=="__main__":
    main()
