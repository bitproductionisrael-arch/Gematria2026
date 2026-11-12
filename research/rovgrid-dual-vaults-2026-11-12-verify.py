#!/usr/bin/env python3
"""Audit exclusive Genesis/Tevah assignment of 113 RovGrid body achievements."""
import json
from pathlib import Path
p=Path(__file__).parent
master=json.loads((p/"rovgrid-body-all-achievements-2026-11-12.json").read_text(encoding="utf8"))
mapper=json.loads((p/"rovgrid-dual-vaults-map-2026-11-12.json").read_text(encoding="utf8"))
original={x["id"] for x in master["entries"]}
g, t=map(set,(mapper["genesis_ids"],mapper["tevah_ids"]))
assert len(original)==113
assert len(g)==50 and len(t)==63
assert not g&t and g|t==original
assert all(x["vault_id"]=="genesis" for x in master["entries"] if x["id"] in g)
assert all(x["vault_id"]=="tevah" for x in master["entries"] if x["id"] in t)
for row in master["entries"]:
  for other in row.get("cross_vault_refs",[]):
    assert other in original and row["id"]!=other
    assert (row["id"] in g)!=(other in g), (row["id"],other)
assert mapper["counts"]["genesis"]["total"]+mapper["counts"]["tevah"]["total"]==113
assert len(master["pending"])==mapper["pending_unscored"]==4
print("PASS: exactly 50 Genesis +63 Tevah =113 original cards, no missing or duplicated IDs")
