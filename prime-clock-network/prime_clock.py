#!/usr/bin/env python3
"""Prime Clock Network: resumeable distributed primality-certificate search.

Standalone reference worker. Optionally pip install gmpy2 for much faster powmod.
Run --help for commands. Not a continuous cloud service.
"""
import argparse, hashlib, json, math, os, pathlib, re, sys, time

ROOT = pathlib.Path(__file__).resolve().parent
OFFSETS = (109, 69, 290, 469, 1807, 111, 786554, 131)
EXPECTED_HASH = "a7e2cb479d2eed2423dd804521f9e36d7358ef7005d0be415f3c2927f2cc0e5b"
try:
    import gmpy2
    def mpow(a, e, n): return int(gmpy2.powmod(a, e, n))
except ImportError:
    def mpow(a, e, n): return pow(a, e, n)

def seed_chain():
    q = (1 << 127) - 1
    generations = []
    for offset in OFFSETS:
        k = (1 << (q.bit_length() - 5)) + offset
        n = 2*k*q + 1
        generations.append((q, k, n))
        q = n
    assert hashlib.sha256(format(q, "x").encode()).hexdigest() == EXPECTED_HASH
    return generations

def verify_seed():
    chain = seed_chain()
    parent = (1 << 127) - 1
    s = 4
    for _ in range(125):
        s = (s*s-2) % parent
    assert s == 0, "Lucas-Lehmer seed failed"
    for q, k, n in chain:
        assert q == parent and q*q > n
        assert mpow(2, n-1, n) == 1
        assert math.gcd(mpow(2, 2*k, n)-1, n) == 1
        parent = n
    print("PASS: 8 certified generations, final bits:", parent.bit_length())

def sieve_roots(q, k0, limit):
    flags = bytearray(b"\x01") * (limit+1)
    flags[:2] = b"\x00\x00"
    for p in range(2,math.isqrt(limit)+1):
        if flags[p]:
            flags[p*p::p] = b"\x00"*((limit-p*p)//p+1)
    roots = []
    for p in range(3,limit+1,2):
        if flags[p] and (2*q) % p:
            roots.append((p, (-pow((2*q)%p,-1,p)-k0)%p))
    return roots

def check_candidate(q, k, offset, roots):
    for p, root in roots:
        if offset % p == root:
            return "S", 0
    n = 2*k*q+1
    if mpow(2,n-1,n) != 1:
        return "C", 2
    for a in range(2,33):
        if a != 2 and mpow(a,n-1,n) != 1: continue
        if math.gcd(mpow(a,2*k,n)-1,n) == 1:
            return "P", a
    return "U", 0

def append_durable(path, obj):
    with open(path,"ab") as f:
        f.write((json.dumps(obj,sort_keys=True,separators=(",",":"))+"\n").encode())
        f.flush()
        os.fsync(f.fileno())

def read_resume(path, job, worker):
    next_i = job["start"]
    if not path.exists(): return next_i, False
    lines = path.read_text().splitlines()
    assert lines, "empty log"
    head = json.loads(lines[0])
    assert head["type"] == "job" and head["job"] == job["id"] and head["worker"] == worker
    assert head["parent_sha256"] == EXPECTED_HASH
    proof = False
    for line in lines[1:]:
        record = json.loads(line)
        assert record["index"] == next_i, "gap or duplicate in checkpoint log"
        assert record["status"] in ("S","C","U","P")
        next_i += 1
        proof |= record["status"] == "P"
    return next_i, proof

def run(args):
    job = json.loads(pathlib.Path(args.job).read_text())
    assert job["generation"] == 9 and job["parent_sha256"] == EXPECTED_HASH
    assert 0 <= job["start"] < job["end"]
    assert 3 <= args.sieve <= 200000
    assert args.seconds > 0
    worker = re.sub("[^a-zA-Z0-9_-]","_",args.worker)[:32]
    output = ROOT / "contributions" / (job["id"] + "--" + worker + ".jsonl")
    output.parent.mkdir(exist_ok=True)
    index, proof = read_resume(output,job,worker)
    if not output.exists():
        append_durable(output,{"type":"job","job":job["id"],"worker":worker,
                               "generation":9,"parent_sha256":EXPECTED_HASH,
                               "start":job["start"],"end":job["end"],"sieve":args.sieve})
    if index >= job["end"] or proof:
        print("No more work:",output,"next:",index); return
    q = seed_chain()[-1][2]
    k0 = 1 << (q.bit_length()-5)
    roots = sieve_roots(q,k0,args.sieve)
    t0 = time.monotonic()
    print("Starting",job["id"],"index",index,"through",job["end"]-1,flush=True)
    while index < job["end"]:
        if time.monotonic()-t0 >= args.seconds: break
        k = k0 + index
        if 2*k >= q: raise RuntimeError("q^2 > N condition no longer holds")
        status, witness = check_candidate(q,k,index,roots)
        append_durable(output,{"index":index,"status":status,"witness":witness})
        index += 1
        if status == "P":
            print("CERTIFICATE CANDIDATE at index",index-1,"a =",witness)
            break
        if index % 10 == 0: print("saved index",index,flush=True)
    print("Result saved:",output,"next index:",index,"elapsed:",round(time.monotonic()-t0,2))
    print("Submit this JSONL file through a GitHub Pull Request.")

def verify_result(args):
    path = pathlib.Path(args.path)
    records = [json.loads(s) for s in path.read_text().splitlines() if s.strip()]
    assert records and records[0]["type"] == "job"
    h = records[0]
    job = json.loads((ROOT/"jobs"/(h["job"]+".json")).read_text())
    assert h["parent_sha256"] == job["parent_sha256"] == EXPECTED_HASH
    assert h["start"] == job["start"] and h["end"] == job["end"]
    assert h["generation"] == 9
    q = seed_chain()[-1][2]
    k0 = 1 << (q.bit_length()-5)
    roots = sieve_roots(q,k0,h["sieve"]) if args.full else None
    index = job["start"]
    proofs = []
    for r in records[1:]:
        assert r["index"] == index and index < job["end"]
        index += 1
        status,a = r["status"],r["witness"]
        assert status in ("S","C","U","P")
        k=k0+r["index"]; n=2*k*q+1
        assert 2*k < q
        if status == "P":
            assert 2<=a<=32 and q*q>n
            assert mpow(a,n-1,n)==1
            assert math.gcd(mpow(a,2*k,n)-1,n)==1
            proofs.append(r["index"])
        elif args.full:
            if status == "S": assert any(r["index"] % p == root for p,root in roots)
            if status == "C": assert mpow(2,n-1,n)!=1
            if status == "U": assert mpow(2,n-1,n)==1
    print(json.dumps({"result":"PASS","checked":index-job["start"],"full":args.full,
                      "proof_indices":proofs},sort_keys=True))

def main():
    p=argparse.ArgumentParser()
    sub=p.add_subparsers(dest="mode",required=True)
    r=sub.add_parser("run")
    r.add_argument("--job",required=True)
    r.add_argument("--worker",default="volunteer")
    r.add_argument("--seconds",type=int,default=300)
    r.add_argument("--sieve",type=int,default=20000)
    v=sub.add_parser("verify")
    v.add_argument("--path",required=True)
    v.add_argument("--full",action="store_true")
    sub.add_parser("verify-seed")
    args=p.parse_args()
    if args.mode=="run":run(args)
    elif args.mode=="verify":verify_result(args)
    else:verify_seed()
if __name__=="__main__":main()
