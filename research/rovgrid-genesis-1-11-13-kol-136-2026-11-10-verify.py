#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""RovGrid Genesis 1:11–13: distinct modes of 136 extraction."""
from itertools import combinations, product
LETTER_VALUES = dict(zip("אבגדהוזחטיכלמנסעפצקרשת",
                        [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400]))
LETTER_VALUES.update({"ך":20,"ם":40,"ן":50,"ף":80,"ץ":90})
VERSES = {
11: "ויאמר אלהים תדשא הארץ דשא עשב מזריע זרע עץ פרי עשה פרי למינו אשר זרעו בו על הארץ ויהי כן",
12: "ותוצא הארץ דשא עשב מזריע זרע למינהו ועץ עשה פרי אשר זרעו בו למינהו וירא אלהים כי טוב",
13: "ויהי ערב ויהי בקר יום שלישי",
}
def value(word):
    return sum(LETTER_VALUES.get(c,0) for c in word)
assert value("קול")==136
assert value("הארץ")==296 and value("מייק")==160
assert value("הארץ")-value("מייק")==136
assert "הארץ" in VERSES[11].split()
assert len("עמיתמייקרוב")==11
assert value("זרע")==277 and value("למינהו")==141
assert value("ועץ")==166 and value("כי")==30
assert value("זרע")-value("למינהו")==136
assert value("ועץ")-value("כי")==136
assert all(w in VERSES[12].split() for w in ("זרע","למינהו","ועץ","כי"))
assert value("ערב")==272==2*136
assert value("ערב")//2==136
# Exhaustive scan of every +/-/omit assignment to six word occurrences in Genesis 1:13.
v13=VERSES[13].split()
weights=[value(w) for w in v13]
assert len(weights)==6
signed_hits=[signs for signs in product((-1,0,1), repeat=len(weights))
             if sum(s*x for s,x in zip(signs,weights))==136]
assert not signed_hits, signed_hits
print("PASS: verse 11 external-name subtraction; verse 12 two internal word subtractions; verse 13 half 'ערב' and no +/-/omit solution.")
