"""Fast regression tests; no giant modular exponentiation required."""
import importlib.util
from pathlib import Path
import math
source=Path(__file__).resolve().parents[1]/"prime_clock.py"
spec=importlib.util.spec_from_file_location("prime_clock",source)
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
chain=m.seed_chain()
assert len(chain)==8
assert chain[-1][2].bit_length()==31620
assert all(q*q>n and n==2*k*q+1 for q,k,n in chain)
assert m.check_candidate(127,9,5,[])[0:]==("P",2)
assert m.check_candidate(127,10,6,[]) [0]=="C"
print("PASS deterministic chain structure and small Pocklington fixture")
