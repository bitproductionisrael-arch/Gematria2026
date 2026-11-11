#!/usr/bin/env python3
"""Reproduce Jupiter-Saturn trigon gematria without tuning any letter values."""
from math import gcd, isclose
GREEK={"Α":1,"Β":2,"Γ":3,"Δ":4,"Ε":5,"Ζ":7,"Η":8,"Θ":9,
"Ι":10,"Κ":20,"Λ":30,"Μ":40,"Ν":50,"Ξ":60,"Ο":70,"Π":80,
"Ρ":100,"Σ":200,"Τ":300,"Υ":400,"Φ":500,"Χ":600,"Ψ":700,"Ω":800}
HEBREW={"א":1,"ב":2,"ג":3,"ד":4,"ה":5,"ו":6,"ז":7,"ח":8,"ט":9,"י":10,"כ":20,"ל":30,"מ":40,"נ":50,"ס":60,"ע":70,"פ":80,"צ":90,"ק":100,"ר":200,"ש":300,"ת":400}
gg=lambda s:sum(GREEK[ch] for ch in s)
hh=lambda s:sum(HEBREW[ch] for ch in s.replace(" ",""))
zeus,cronus=gg("ΖΕΥΣ"),gg("ΚΡΟΝΟΣ")
assert (zeus,cronus)==(612,510)
assert gcd(zeus,cronus)==102
assert zeus-cronus==102==3*34
assert 136==4*34 and cronus//3==170==5*34
assert (zeus-cronus)**2+136**2==(cronus//3)**2
assert (102**2,136**2,170**2)==(10404,18496,28900)
assert gcd(gcd(zeus,cronus),136)==34
assert (zeus//34,cronus//34,(zeus+cronus)//34)==(18,15,33)
assert gg("Υ")==400 and gg("Ω")==800 and gg("Ι")==10
assert (gg("Υ")+gg("Ω"))//gg("Ι")==120
assert 3**2+4**2==5**2
assert 45==sum(range(1,10)) and 136==sum(range(1,17))
assert 325==sum(range(1,26))
assert 136-45==91==sum(range(1,14))
assert hh("אגיאל")==hh("זאזל")==45
assert hh("יהפיאל")==hh("הסמאל")==136
assert hh("אמן")==hh("יהוה")+hh("אדני")==91
assert hh("אחד")==13
assert hh("יוד הא ואו הא")==45
assert hh("יוד הא ויו הא")==54
# Approximate planetary periods in years; do not claim exactly 120°.
jupiter_years,saturn_years=11.86,29.46
synodic=1/(1/jupiter_years-1/saturn_years)
angular_advance=(360*synodic/saturn_years)%360
assert 19.7<synodic<20.0
assert 242<angular_advance<244
assert 116<360-angular_advance<118
print("PASS: Zeus=612 Kronos=510, gcd=102, Pythagorean 102/136/170 and common divisor34")
print("PASS: Greek planetary vowels Υ=400, Ω=800, Ι=10; 3/4/5 squares; 136-45=91=T13")
print("PASS: astronomy approximate angular separation ~117°, not exactly120°")
