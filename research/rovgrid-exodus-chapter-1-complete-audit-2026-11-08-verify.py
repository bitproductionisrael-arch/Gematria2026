#!/usr/bin/env python3
"""Reproduce Exodus chapter 1 study, Masoretic consonantal spelling.
All maqaf-connected words are split for word-wise methods.
"""
from math import isqrt
VERSES=[
"ואלה שמות בני ישראל הבאים מצרימה את יעקב איש וביתו באו",
"ראובן שמעון לוי ויהודה",
"יששכר זבולן ובנימן",
"דן ונפתלי גד ואשר",
"ויהי כל נפש יצאי ירך יעקב שבעים נפש ויוסף היה במצרים",
"וימת יוסף וכל אחיו וכל הדור ההוא",
"ובני ישראל פרו וישרצו וירבו ויעצמו במאד מאד ותמלא הארץ אתם",
"ויקם מלך חדש על מצרים אשר לא ידע את יוסף",
"ויאמר אל עמו הנה עם בני ישראל רב ועצום ממנו",
"הבה נתחכמה לו פן ירבה והיה כי תקראנה מלחמה ונוסף גם הוא על שנאינו ונלחם בנו ועלה מן הארץ",
"וישימו עליו שרי מסים למען ענתו בסבלתם ויבן ערי מסכנות לפרעה את פתם ואת רעמסס",
"וכאשר יענו אתו כן ירבה וכן יפרץ ויקצו מפני בני ישראל",
"ויעבדו מצרים את בני ישראל בפרך",
"וימררו את חייהם בעבדה קשה בחמר ובלבנים ובכל עבדה בשדה את כל עבדתם אשר עבדו בהם בפרך",
"ויאמר מלך מצרים למילדת העברית אשר שם האחת שפרה ושם השנית פועה",
"ויאמר בילדכן את העבריות וראיתן על האבנים אם בן הוא והמתן אתו ואם בת הוא וחיה",
"ותיראן המילדת את האלהים ולא עשו כאשר דבר אליהן מלך מצרים ותחיין את הילדים",
"ויקרא מלך מצרים למילדת ויאמר להן מדוע עשיתן הדבר הזה ותחיין את הילדים",
"ותאמרן המילדת אל פרעה כי לא כנשים המצרית העברית כי חיות הנה בטרם תבוא אלהן המילדת וילדו",
"וייטב אלהים למילדת וירב העם ויעצמו מאד",
"ויהי כי יראו המילדת את האלהים ויעש להם בתים",
"ויצו פרעה לכל עמו לאמר כל הבן הילוד היארה תשליכהו וכל הבת תחיון"
]
HE="אבגדהוזחטיכלמנסעפצקרשת"
REG=dict(zip(HE,list(range(1,10))+list(range(10,100,10))+list(range(100,500,100))))
ORD={c:i+1 for i,c in enumerate(HE)}
for f,b in dict(zip("ךםןףץ","כמנפצ")).items():
    REG[f]=REG[b];ORD[f]=ORD[b]
SMALL={c:(v-1)%9+1 for c,v in REG.items()}
def val(s,m):return sum(m[c] for c in s if c in m)
def dr(n):return (n-1)%9+1 if n else 0
def reduced(s):return sum(dr(val(w,SMALL)) for w in s.split())
def weighted(s,m=SMALL):return sum(len(w)*val(w,m) for w in s.split())
def primeindex(n):
    if n<2 or any(n%d==0 for d in range(2,isqrt(n)+1)):return 0
    return sum(all(i%d for d in range(2,isqrt(i)+1)) for i in range(2,n+1))
EXPECTED=[
(11,44,3161,443,137,56,608),(4,19,807,177,78,24,397),
(3,16,1083,183,57,12,308),(4,14,1144,154,55,28,242),
(11,42,2450,497,155,56,650),(7,26,981,234,108,36,410),
(11,48,3259,505,181,73,855),(10,31,2211,375,114,42,396),
(10,34,1727,368,134,44,514),(19,70,3316,715,301,94,1280),
(15,62,5465,803,254,74,1151),(11,42,2808,495,153,45,613),
(6,25,1784,281,83,29,396),(17,67,4163,653,239,77,1071),
(12,50,5040,639,189,72,846),(16,61,3845,569,218,74,987),
(14,60,4338,648,198,72,968),(13,57,3805,637,205,61,960),
(17,71,5290,781,259,70,1248),(7,32,1237,310,121,31,596),
(9,35,2172,354,111,30,496),(13,51,3025,541,199,55,856)]
assert len(VERSES)==len(EXPECTED)==22
for i,(verse,expected) in enumerate(zip(VERSES,EXPECTED),1):
    got=(len(verse.split()),len("".join(verse.split())),val(verse,REG),val(verse,ORD),val(verse,SMALL),reduced(verse),weighted(verse))
    assert got==expected,(i,got,expected)
    print("PASS Exodus 1:",i,got)
assert val(VERSES[0],SMALL)==137 and primeindex(137)==33
assert len(VERSES[0].split())==11 and sum(map(len,VERSES[0].split()))==44
assert val("ואלה שמות",ORD)==86 and val(VERSES[0],ORD)==443 and primeindex(443)==86
assert val("שמות",SMALL)==17 and val("בני",ORD)==26
assert val("שמות",ORD)==val("בני",REG)==62
assert val("שפרה",REG)==585 and val("פועה",REG)==161
assert val("שפרה",REG)+val("פועה",REG)==val("שמות",REG)==746
assert val("שפרה",REG)-val("פועה",REG)==val("וביתו",REG)==424
assert val("שפרה פועה",SMALL)==44
assert val(VERSES[21],REG)==val("הילוד",REG)**2==3025
assert val(VERSES[21],ORD)==val("ישראל",REG)==541 and primeindex(541)==100
assert val(VERSES[21],SMALL)==199 and primeindex(199)==46
assert reduced("ויצו פרעה לכל־עמו לאמר כל־הבן הילוד היארה תשליכהו וכל־הבת תחיון")==46
assert val("וייטב",REG)==37 and reduced(VERSES[6])==73
assert val(VERSES[3],REG)==44*26==1144
cols=list(zip(*EXPECTED))
assert tuple(map(sum,cols))==(240,957,63111,10362,3549,1155,15848)
assert 1155==3*5*7*11
print("ALL EXODUS 1 CHECKS PASSED")
