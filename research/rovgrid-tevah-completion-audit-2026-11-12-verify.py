#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Audit all 63 Tevah cards, explicit 7/14/42 classification and one closed mathematical box."""
import json
from pathlib import Path
from collections import Counter
p=Path(__file__).parent
src=json.loads((p/"rovgrid-body-all-achievements-2026-11-12.json").read_text(encoding="utf-8"))
audit=json.loads((p/"rovgrid-tevah-completion-audit-2026-11-12.json").read_text(encoding="utf-8"))
original={x["id"]:x for x in src["entries"] if x["vault_id"]=="tevah"}
cards=audit["records"]
assert len(cards)==len(original)==63
assert len({x["id"] for x in cards})==63
assert set(x["id"] for x in cards)==set(original)
counts=Counter(x["tier"] for x in cards)
assert counts=={"full_core":7,"partial":14,"support":42},counts
assert audit["complete_box_awards"]==1
assert {x["id"] for x in cards if x["tier"]=="full_core"}==set(audit["full_definition"]["component_ids"])
assert {x["component_role"] for x in cards if x["tier"]=="full_core"}=={"axes","face_160","face_208","face_520","closure_888","abstract_volume_4160","volume_invariance_4160"}
for x in cards:
    assert x["source_status"]==original[x["id"]]["status"]
    assert x["formula"]==original[x["id"]]["formula"]
    assert x["primary_vault"]=="tevah"
    assert x["filming"]["shot"] and x["filming"]["voice"] and x["filming"]["on_screen"] and x["filming"]["guard"]
    assert x["source"]
    assert (x["closure_group"]=="TEVAH-COMPLETE-01")== (x["tier"]=="full_core")
d=audit["full_definition"]
assert d["proof"]["axes"]==[8,20,26]
assert d["proof"]["faces"]==[8*20,8*26,20*26]
assert d["proof"]["sum"]==8*20+8*26+20*26==888
assert d["proof"]["volume"]==8*20*26==4160
assert d["proof"]["face_times_other"]==[8*20*26,8*26*20,20*26*8]
assert [x["n"] for x in d["anatomical_inventories"]]==[8,20,26]
# The molecular triad belongs to three separate canonical precursors, never to the same object.
mol=audit["molecular_three_precursor_match"]["refs"]
assert {x["id"] for x in mol}=={"P26","P27","P28"}
assert [x["residues"] for x in mol]==[160,208,520]
assert sum(x["residues"] for x in mol)==888
assert all(next(z for z in cards if z["id"]==x["id"])["tier"]=="partial" for x in mol)
assert not any(x["tier"]=="full_core" for x in cards if x["id"] in {"P26","P27","P28"})
# Do not confuse the 20S /26S sedimentation labels with the box's bone dimensions.
assert next(x for x in cards if x["id"]=="P09")["tier"]=="support"
assert next(x for x in cards if x["id"]=="P29")["tier"]=="support"
assert next(x for x in cards if x["id"]=="P31")["tier"]=="partial"
assert sum(counts.values())==63
print("PASS: 63 original IDs assigned once; 7 completion stages, 14 partial, 42 support")
print("PASS: 1 whole *arithmetic* box construction (8,20,26); 160/208/520; 888 and 4160")
print("PASS: 3 protein canonical precursor lengths each partial, no fabricated second whole box")
print("PASS: per-card camera instructions, captions, voiceover, warnings, original source")
