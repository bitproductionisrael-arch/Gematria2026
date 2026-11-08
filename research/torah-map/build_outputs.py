"""Readable per-verse map, separate lists, portable search UI; original records retained."""
import base64,gzip,json,hashlib
from pathlib import Path
from collections import Counter
R=Path(__file__).resolve().parent
def main():
 with gzip.open(R/'index.json.gz','rt') as f:data=json.load(f)
 rows=data['verses'];names=data['names'];summary=json.loads((R/'summary.json').read_text())
 (R/'index.html').write_text((R/'viewer.html').read_text().replace('__INDEX_BASE64__',base64.b64encode((R/'index.json.gz').read_bytes()).decode()))
 lists=R/'lists';lists.mkdir(exist_ok=True)
 for name,pred in [('found',lambda r:r['status']=='נמצא'),('not-found',lambda r:r['status']=='לא מצאתי'),('requires-review',lambda r:bool(r['pending']))]:
  items=[r for r in rows if pred(r)];(lists/(name+'.json')).write_text(json.dumps(items,ensure_ascii=False,separators=(',',':')))
  (lists/(name+'.md')).write_text('# '+{'found':'פסוקים עם ממצאים','not-found':'לא מצאתי לפי כללי הריצה','requires-review':'ממצאים הממתינים לבדיקה'}[name]+'\n\n'+'\n'.join(f"- [{r['book_he']} {r['chapter']}:{r['verse']}](../map/{r['book']}.{r['chapter']:02}.md#verse-{r['verse']}) — {r['text']}" for r in items)+'\n')
 with (lists/'verified-findings.jsonl').open('w') as out:
  for r in rows:
   for h in r['findings']:out.write(json.dumps({'ref':r['ref'],'text':r['text'],**h},ensure_ascii=False)+'\n')
 (R/'map').mkdir(exist_ok=True)
 for book in summary['books']:
  br=[r for r in rows if r['book']==book['book']];chapters=sorted({r['chapter'] for r in br});links=[]
  for c in chapters:
   cr=[r for r in br if r['chapter']==c];fn=f"{book['book']}.{c:02}.md";links.append(f"- [פרק {c}](map/{fn}) — {len(cr)} פסוקים")
   text=[f"# {book['book_he']} {c} — מפת כל הפסוקים",'',f"{len(cr)} פסוקים. נוסח קבוע WLC 4.20. כל פסוק נסרק לפי כללי v1.",'']
   for r in cr:
    text += [f"<a id=\"verse-{r['verse']}\"></a>",f"## {r['book_he']} {r['chapter']}:{r['verse']}",'',r['text'],'',f"סטטוס: {r['status']}. מילים: {r['word_count']}; אותיות: {r['letters']}.",'']
    if r['findings']:
     for h in r['findings']:text += [f"- {h['equation']} — {names[h['method']]} · {h['type']}",f"  חישוב: `{json.dumps(h['evidence'],ensure_ascii=False)}`"]
    else:text += ['הצלחה: לא מצאתי לפי כללי הבדיקה הנוכחיים.']
    if r['pending']:text += ['', 'דורש בדיקה: '+json.dumps(r['pending'],ensure_ascii=False)]
    text += ['','<details><summary>כל תוצאות הפסוק</summary>','']+[f"- {names[k]}: {v}" for k,v in r['totals'].items()]+['','</details>','',f"[נתונים גולמיים ופירוק מלא](../chapters/{book['book']}.{c:02}.json.gz)",'']
   (R/'map'/fn).write_text('\n'.join(text))
  (R/(book['book']+'.md')).write_text(f"# {book['book_he']} — {len(br)} פסוקים\n\n"+'\n'.join(links)+'\n')
 counts=Counter(h['type'] for r in rows for h in r['findings']);(R/'finding-types.json').write_text(json.dumps(counts,ensure_ascii=False,indent=2))
 print(json.dumps({'readable_chapters':len(list((R/'map').glob('*.md'))),'portable_html_bytes':(R/'index.html').stat().st_size,'statuses':summary['counts']},ensure_ascii=False))
if __name__=='__main__':main()
