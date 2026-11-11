#!/usr/bin/env python3
# 2026-11-11: canonical numeric check for a research arrangement, not a historical alphabet order.
GREEK={"Α":1,"Ε":5,"Η":8,"Ι":10,"Ο":70,"Υ":400,"Ω":800,"Σ":200}
HEBREW={"מ":40,"ם":40,"י":10,"ש":300,"ן":50,"ו":6,"ד":4,"ח":8,"ת":400,"ר":200,"ב":2}
def g(s): return sum(GREEK[c] for c in s)
def h(s): return sum(HEBREW[c] for c in s.replace(" ",""))
old="ΑΕΥΙΗΟΩ"
new="ΕΥΑΙΗΟΩ"
assert sorted(old)==sorted(new) and len(set(new))==7
assert (g("ΑΕΥ"),g("ΕΥΑ"))==(406,406)
assert g("Ι")==10
assert g("ΗΟΩ")==878
assert g("ΕΥΑΙΗΟΩ")==1294
assert g("ΕΥΑ")+g("Ι")==416
assert g("Ι")+g("ΗΟΩ")==888
assert g("ΙΗΣΟΥΣ")==888
assert h("רוב")==208 and h("רוב")*2==416
assert GREEK["Ω"]//GREEK["Ε"]==160 and GREEK["Ω"]%GREEK["Ε"]==0
assert h("מם שין יוד חית")==878
assert h("מים שין יוד חית")==888
print("PASS: ΕΥΑ | Ι | ΗΟΩ, 406+10+878=1294; 416 / 888 / 160 verified")
