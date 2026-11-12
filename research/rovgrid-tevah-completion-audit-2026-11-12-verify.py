#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audit archive P22, full Tevah box, 14 partial, 41 supporting, 55 other awards."""
import json
from pathlib import Path
from collections import Counter
p=Path(__file__).parent
src=json.loads((p/"rovgrid-body-all-achievements-2026-11-12.json").read_text(encoding="utf-8"))
audit=json.loads((p/"rovgrid-tevah-completion-audit-2026-11-12.json").read_text(encoding="utf-8"))
mapping=json.loads((p/"rovgrid-dual-vaults-map-2026-11-12.json").read_text(encoding="utf-8"))
original={x["id"]:x for x in src["entries"] if x["vault_id"]=="tevah"}
cards=audit["records"]
assert len(cards)==len(original)==63
assert len({x["id"] for x in cards})==63
assert set(x["id"] for x in cards)==set(original)
counts=Counter(x["tier"] for x in cards)
assert counts=={"full_core":7,"partial":14,"support":41,"archived":1},counts
assert audit["complete_box_awards"]==1
assert audit["active_source_cards"]==62
assert audit["archived_unscored_ids"]==["P22"]
assert audit["active_award_scoreboard"]=={
  "complete":1,"partial":14,"support":41,"other_awards":55,"total_awards":56,
  "proof_stage_cards_in_complete":7,
  "note":"1+14+41=56 earned award icons. 7 original historical stage records for the complete box represent ONE award. 14+41=55 is the count of two disjoint award types; T10=55 is a separate triangular-number representation."
}
assert {x["id"] for x in cards if x["tier"]=="full_core"}==set(audit["full_definition"]["component_ids"])
assert {x["component_role"] for x in cards if x["tier"]=="full_core"}=={"axes","face_160","face_208","face_520","closure_888","abstract_volume_4160","volume_invariance_4160"}
for x in cards:
    assert x["source_status"]==original[x["id"]]["status"]
    assert x["formula"]==original[x["id"]]["formula"]
    assert x["primary_vault"]=="tevah"
    assert original[x["id"]]["tevah_tier"]==x["tier"]
    assert original[x["id"]]["active_award"]==(x["tier"]!="archived")
    assert x["filming"]["shot"] and x["filming"]["voice"] and x["filming"]["on_screen"] and x["filming"]["guard"]
    assert x["source"]
    assert (x["closure_group"]=="TEVAH-COMPLETE-01") == (x["tier"]=="full_core")
d=audit["full_definition"]
assert d["proof"]["axes"]==[8,20,26]
assert d["proof"]["faces"]==[8*20,8*26,20*26]
assert d["proof"]["sum"]==8*20+8*26+20*26==888
assert d["proof"]["volume"]==8*20*26==4160
assert d["proof"]["face_times_other"]==[4160,4160,4160]
assert [x["n"] for x in d["anatomical_inventories"]]==[8,20,26]
mol=audit["molecular_three_precursor_match"]["refs"]
assert {x["id"] for x in mol}=={"P26","P27","P28"}
assert [x["residues"] for x in mol]==[160,208,520]
assert sum(x["residues"] for x in mol)==888
assert all(next(z for z in cards if z["id"]==x["id"])["tier"]=="partial" for x in mol)
assert next(x for x in cards if x["id"]=="P09")["tier"]=="support"
assert next(x for x in cards if x["id"]=="P22")["tier"]=="archived"
assert next(x for x in cards if x["id"]=="P29")["tier"]=="support"
assert next(x for x in cards if x["id"]=="P31")["tier"]=="partial"
assert sum(counts.values())==63
assert src["active_awards"]["all_source_cards"]==112
assert mapping["active_counts"]["total"]==112
assert mapping["active_counts"]["tevah"]==62 and mapping["counts"]["tevah"]["total"]==63
assert mapping["active_counts"]["tevah_support_awards"]==41
assert mapping["active_counts"]["tevah_auxiliary_badge_count"]==55
print("PASS: 113 historical cards; 112 active records (Genesis50 + Tevah62), P22 archive")
print("PASS: 7 full-box source stages -> ONE 100%-mathematical-box award")
print("PASS: 14 partial +41 supporting =55 other awards; total Tevah award icons=56")
print("PASS: 63 original Tevah definitions remain traceable; 3 protein face-length correspondences remain partial")
