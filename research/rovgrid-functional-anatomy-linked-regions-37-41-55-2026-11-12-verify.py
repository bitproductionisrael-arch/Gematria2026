#!/usr/bin/env python3
"""Bone-level union checks for thorax halves, shoulder girdle, and arms."""
from math import isqrt
C={f"T{i}" for i in range(1,13)} | {"sternum"}
L={f"L-rib-{i}" for i in range(1,13)}
R={f"R-rib-{i}" for i in range(1,13)}
left_girdle={"L-clavicle","L-scapula"}
right_girdle={"R-clavicle","R-scapula"}
assert len(C)==13 and len(L)==len(R)==12
left=C|L
right=C|R
chest=left|right
assert len(left)==len(right)==25
assert left&right==C
assert len(chest)==25+25-13==37
left_shoulder=left|left_girdle
right_shoulder=right|right_girdle
whole=left_shoulder|right_shoulder
assert len(left_shoulder)==len(right_shoulder)==27
assert left_shoulder&right_shoulder==C
assert len(whole)==27+27-13==37+4==41

# Rib classes via direct/indirect cartilage-to-sternum rules.
true={f"{s}-rib-{i}" for s in ("L","R") for i in range(1,8)}
indirect={f"{s}-rib-{i}" for s in ("L","R") for i in range(8,11)}
floating={f"{s}-rib-{i}" for s in ("L","R") for i in range(11,13)}
assert not true&indirect and not true&floating and not indirect&floating
assert true|indirect|floating==L|R
shell15=true|{"sternum"}
shell21=shell15|indirect
shell25=shell21|floating
shell37=shell25|{f"T{i}" for i in range(1,13)}
shell41=shell37|left_girdle|right_girdle
assert [len(s) for s in (shell15,shell21,shell25,shell37,shell41)]==[15,21,25,37,41]
assert shell37==chest and shell41==whole

for arm_mode,per_side,count in (
    ("206 standard",32,101),
    ("214 optional sesamoids",34,105),
):
    # Girdle 2 bones already part of left_shoulder/right_shoulder.
    L_free={f"L-free-{i}" for i in range(1,per_side-2+1)}
    R_free={f"R-free-{i}" for i in range(1,per_side-2+1)}
    L_unit=left_shoulder|L_free
    R_unit=right_shoulder|R_free
    assert len(L_unit)==len(R_unit)==25+per_side
    assert L_unit&R_unit==C
    assert len(L_unit|R_unit)==2*(25+per_side)-13==37+2*per_side==count
    if arm_mode.startswith("214"):
        assert count==105==14*15//2

# 14 true ribs are ALL inside the 41-bone chest/shoulder unit.
assert true<=whole
assert len(true|whole)==41 != 14+41
assert 14+41==55==10*11//2
print("PASS: 25+25−13=37, 27+27−13=41")
print("PASS: 15→21→25→37→41, additions 6/4/12/4, no repeated bone counted")
print("PASS: standard 101 vs expanded 105=T14 with linked arms")
print("PASS: 14 ribs +41 skeleton does NOT yield 55 distinct bones; 14+41 applies to disjoint vault award IDs")
