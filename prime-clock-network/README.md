# PRIME CLOCK NETWORK — Volunteer distributed prime research

An open collaborative **prime-certificate search**. Every volunteer runs an independent copy of the clock, works on an assigned interval, and contributes append-only results to a shared GitHub corpus. No GitHub token or central compute server is needed to calculate locally.

## Join

1. Fork / clone this public repository. On Linux / WSL install Python 3; optionally `python3 -m pip install gmpy2` for faster modular exponentiation.
2. Pick a job from `jobs/` and claim it in an Issue to minimize duplicated work.
3. Run (from this folder):

```sh
python3 prime_clock.py verify-seed
python3 prime_clock.py run --job jobs/g09-000348-000448.json --worker your-nickname --seconds 300
```

4. Resume with the same command whenever you like. Each completed candidate is safely appended to `contributions/<job>--<nickname>.jsonl`. An interrupted candidate is automatically repeated.
5. Check results: `python3 prime_clock.py verify --path contributions/<file>.jsonl --full`. Without `--full`, the program **fully verifies every claimed prime proof** but only checks metadata for negative results.
6. Commit only your JSONL file to your fork and open a GitHub **Pull Request**. No one needs write access to the main repository.

## Scientific rules

- Current parent: generation 8, 31,620-bit, independently certified Pocklington prime. The seed chain is represented compactly by 8 deterministic offsets; use `verify-seed` to reconstruct and verify every link, starting from the known prime `2^127-1`.
- Generation 9 tests `N = 2kq+1`, where `q` is the proven parent and `k=2^(bit_length(q)-5)+offset`. When `q^2 > N`, a witness `a` with `a^(N-1) ≡ 1 (mod N)` and `gcd(a^((N-1)/q)-1,N)=1` proves N prime (Pocklington).
- `S`: small prime factor. `C`: Fermat witness proves composite. `U`: unresolved (not assumed composite). `P`: a candidate proof, **must be independently rechecked**.
- Jobs have a fixed index interval, generation, and SHA-256 parent identity. Results for different generations cannot be mixed.
- Compositeness scan claims are not an accepted fully-verified corpus result until independently rerun / audited. A validated proof may be promoted into the certified corpus; non-hits stay in a separate archive.
- A predicted prime is **never** equivalent to a proven prime. Distributed search helps compute more candidates but does not bypass arithmetic cost or guarantee a record-sized discovery.

## Volunteer safety

The software consumes your local CPU only **when you explicitly run it**. Do not include names, machine IDs, passwords or tokens in result logs. Review code before executing it. GitHub stores code and results, not a persistent background process. Running 24/7 requires volunteers to opt into launching and supervising the worker on their own computers.

Project code is under MIT license. This is a pilot; avoid promoting a certificate until multiple independent verifiers accept it.
