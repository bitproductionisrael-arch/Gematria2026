#!/usr/bin/env python3
"""Verify source spellings of Agrippa's Jupiter names and 4x4 square."""
V={"א":1,"ב":2,"ד":4,"ה":5,"ו":6,"י":10,"ל":30,"מ":40,"ס":60,"פ":80,"צ":90,"ק":100}
g=lambda s:sum(V[c] for c in s if c!=" ")
assert g("יהפיאל")==136
assert g("הסמאל")==136
assert g("אל אב")==34
assert g("אבא")==4
assert g("הוה")==g("אהי")==16
assert g("צדק")==194
assert g("יופיאל")==137
square=[[4,14,15,1],[9,7,6,12],[5,11,10,8],[16,2,3,13]]
assert sorted(sum(square,[]))==list(range(1,17))
assert all(sum(r)==34 for r in square)
assert all(sum(square[i][j] for i in range(4))==34 for j in range(4))
assert sum(square[i][i] for i in range(4))==34
assert sum(square[i][3-i] for i in range(4))==34
assert sum(map(sum,square))==136==4*34
assert 136==16*17//2
assert 0x22==34 and 4*0x22==0x88==136
assert 1024==32**2==2**10
assert 1024-136==888 and 0x400-0x88==0x378==888
print("PASS: Jupiter historical Hebrew names יהפיאל/הסמאל=136, אל אב=34; 4x4=136; bases verified.")
