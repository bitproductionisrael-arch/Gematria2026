# 15,16,17 ובדיקת סדר האותיות
לכל n חיובי Te(n)/T(n)=(n+2)/3, לכן Te(n)=6T(n) גורר n=16 בלבד. זוהי תוצאה של הנחת זיהוי הסולם האנגלי ×6 עם יחס גוף לשכבה. Te15=15×16×17/6=680; T16=136; Te16=816; (2×16)²=1024. הפירוק 680=520+160 דורש נתון נוסף. [הקשר לקורפוס הקודם](rovgrid-linear-axis-cube-choice-2026-11-20.md).

בדיקת אימות מותנית: באורך וסכום סדרי קבועים, נספרות כל המחרוזות עם חתימות מקור תואמות עד עומק נתון. החתימות חושבו מהמילים, לא נגזרו מן הגוף. שורות המשקל הן 1; משקלים לינאריים; משולשיים; טטרהדרליים. לכל מילה מופיעים החתימה ומספרי השורדים המצטברים.

עמית: 520, 820, 1370, 2240 | 232, 2, 1, 1

מייק: 160, 310, 590, 1040 | 415, 12, 1, 1

רוב: 208, 614, 1220, 2026 | 21, 1, 1, 1

AMIT: 43, 81, 135, 206 | 9240, 87, 5, 1

MIKE: 38, 106, 222, 399 | 7110, 130, 6, 1

ROV: 55, 106, 175, 262 | 300, 10, 1, 1

```python
from itertools import product, accumulate

def signature(word, weights):
    row = [weights[c] for c in word]
    result = []
    for _ in range(4):
        result.append(sum(row))
        row = list(accumulate(row))
    return result

for alphabet, values, names, expected in [
    ("אבגדהוזחטיכלמנסעפצקרשת", [1,2,3,4,5,6,7,8,9,10,20,30,40,50,60,70,80,90,100,200,300,400], ["עמית","מייק","רוב"], [[232,2,1,1],[415,12,1,1],[21,1,1,1]]),
    ("ABCDEFGHIJKLMNOPQRSTUVWXYZ", list(range(1,27)), ["AMIT","MIKE","ROV"], [[9240,87,5,1],[7110,130,6,1],[300,10,1,1]])
]:
    weights = dict(zip(alphabet, values))
    ordinal = {c:i for i,c in enumerate(alphabet,1)}
    for name, counts in zip(names, expected):
        target = signature(name,weights)
        o = sum(ordinal[c] for c in name)
        n = [0]*4
        for xs in product(alphabet, repeat=len(name)):
            if sum(ordinal[c] for c in xs)!=o: continue
            scores = signature(xs, weights)
            for j in range(4):
                if scores[j]!=target[j]: break
                n[j]+=1
        assert n==counts

```