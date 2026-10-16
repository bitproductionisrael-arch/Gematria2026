"""Trusted-base contribution JSONL verifier. Never executes volunteer code."""
import pathlib, sys, importlib.util
root=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location("trusted_prime_clock",root/"prime_clock.py")
mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
folder=pathlib.Path(sys.argv[1]).resolve()
files=sorted(folder.glob("*.jsonl")) if folder.exists() else []
if not files: raise SystemExit("No contributions found")
if len(files)>100: raise SystemExit("Too many contributions")
for file in files:
    if file.is_symlink() or file.stat().st_size > 500_000: raise SystemExit("Unsafe or oversized file")
    import argparse
    mod.verify_result(argparse.Namespace(path=str(file),full=False))
print("PASS:",len(files),"contributions parsed; proof claims fully checked")
print("NOTE: negative scan results need independent confirmation before corpus promotion")
