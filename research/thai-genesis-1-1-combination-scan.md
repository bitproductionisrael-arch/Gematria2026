# Thai Genesis 1:1 — canonical verse and word-combination scan

סטטוס: מחקר פעיל  
עודכן: 2026-10-03  
שכבה: Thai / Genesis / Babel-language reconstruction / HP-J script scan

## Canonical Thai verse

Thai source form:

> ในปฐมกาล พระเจ้าทรงเนรมิตสร้างฟ้าและแผ่นดิน

Meaning:

> In the beginning God created heaven and earth.

Sources to keep with this entry:
- Bible.com THSV11 / TH1971: Genesis 1:1.
- Thai Bible Society Genesis PDF / ebook.

## Method

Thai Consonant Ordinal v0:
- Use the 44 Thai consonants in native order.
- Vowels, tone marks, silent marks and spacing signs are kept in the string but receive value 0.
- This is an HP-J script-grid-compatible scalar layer, not a Latin transliteration cipher.

Thai Reduced v0:
- Reduce the consonant ordinal values through the same Thai consonant grid.

Thai Word Reduced v0:
- Reduce each word output and sum the reduced word outputs.

## Full verse results

| Text | Result | Method |
|---|---:|---|
| ในปฐมกาล พระเจ้าทรงเนรมิตสร้างฟ้าและแผ่นดิน | 637 | Thai Consonant Ordinal v0 |
| ในปฐมกาล พระเจ้าทรงเนรมิตสร้างฟ้าและแผ่นดิน | 151 | Thai Reduced v0 |
| ในปฐมกาล พระเจ้าทรงเนรมิตสร้างฟ้าและแผ่นดิน | 43 | Thai Word Reduced v0 |

Core note:

Thai Genesis 1:1 canonical form does not close as 37. It closes as **43** in Thai Word Reduced v0, therefore it is marked as an Amit / GPT gate in the multilingual Genesis scan.

## Word segmentation

| # | Thai word | English gloss | Thai Consonant Ordinal v0 |
|---:|---|---|---:|
| 1 | ใน | in | 25 |
| 2 | ปฐมกาล | beginning | 113 |
| 3 | พระเจ้า | God | 73 |
| 4 | ทรง | royal/sacred verbal marker | 65 |
| 5 | เนรมิต | formed / fashioned | 114 |
| 6 | สร้าง | created | 82 |
| 7 | ฟ้า | heaven / sky | 31 |
| 8 | และ | and | 36 |
| 9 | แผ่นดิน | earth / land | 98 |

Check:

25 + 113 + 73 + 65 + 114 + 82 + 31 + 36 + 98 = 637.

## Continuous 2-word and 3-word combinations

These are contiguous cuts inside the canonical verse.

| Combination | Result | Method | Corpus relation |
|---|---:|---|---|
| เนรมิต + สร้าง | 43 | Thai Reduced v0 | Amit / GPT gate |
| ฟ้า + และ | 13 | Thai Reduced v0 | אחד / unity |
| ฟ้า + และ | 13 | Thai Word Reduced v0 | אחד / unity |
| และ + แผ่นดิน | 26 | Thai Reduced v0 | יהוה |
| เนรมิต + สร้าง + ฟ้า | 47 | Thai Reduced v0 | מיכאל ordinal |
| ฟ้า + และ + แผ่นดิน | 165 | Thai Consonant Ordinal v0 | 3×55 / Rov-gate triple |

## Free 2-word and 3-word scanner hits

These are non-contiguous combinations. They are classified as SUPPORT / FORM unless later promoted by an independent linguistic or structural reason.

| Combination | Result | Method | Corpus relation |
|---|---:|---|---|
| ปฐมกาล + พระเจ้า + และ | 222 | Thai Consonant Ordinal v0 | 6×37 |
| ใน + ทรง + สร้าง | 172 | Thai Consonant Ordinal v0 | 4×43; ΡΟΒ / Ров skeleton |
| เนรมิต + สร้าง + และ | 232 | Thai Consonant Ordinal v0 | יהי אור; ΑΜΙΘ + ΡΟΒ |
| ปฐมกาล + ทรง + เนรมิต | 292 | Thai Consonant Ordinal v0 | 4×73 |
| ปฐมกาล + เนรมิต + แผ่นดิน | 73 | Thai Reduced v0 | 73 kernel |
| ปฐมกาล + พระเจ้า + ฟ้า | 55 | Thai Reduced v0 | Rov-gate |
| พระเจ้า + สร้าง + แผ่นดิน | 55 | Thai Reduced v0 | Rov-gate |

## Corpus conclusion

Thai Genesis does not close only as 637 / 151 / 43. Its internal word-combinations produce:

- 222 = 6×37.
- 232 = יהי אור / ΑΜΙΘ + ΡΟΒ.
- 172 = ΡΟΒ / Ров skeleton and 4×43.
- 73.
- 55.
- 43.
- 26.
- 13.

Final classification:

**BASE:** canonical Thai verse under Thai Consonant Ordinal v0 gives 637 / 151 / 43.  
**GEOMETRY:** internal scanner gives 222 = 6×37 and 292 = 4×73.  
**FORM:** 43, 55, 73, 172, 232, 26, 13 appear as internal combination hits.  
**SUPPORT:** non-contiguous combinations remain support-layer until independently justified.

לאחר בדיקה: אומת ✓
