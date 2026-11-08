"""Search stored results. No gematria recomputation is needed."""
import argparse, gzip, json
from pathlib import Path
R=Path(__file__).resolve().parent
def main():
 p=argparse.ArgumentParser();p.add_argument('--book',choices=['Gen','Exod','Lev','Num','Deut']);p.add_argument('--chapter',type=int);p.add_argument('--verse',type=int);p.add_argument('--method');p.add_argument('--value');p.add_argument('--type');p.add_argument('--status',choices=['נמצא','לא מצאתי','דורש בדיקה']);p.add_argument('--scope',choices=['verse','word','interval','all'],default='verse');p.add_argument('--raw',action='store_true');a=p.parse_args()
 with gzip.open(R/'index.json.gz','rt') as f:index=json.load(f)
 candidates=[r for r in index['verses'] if (not a.book or r['book']==a.book) and (not a.chapter or r['chapter']==a.chapter) and (not a.verse or r['verse']==a.verse) and (not a.status or r['status']==a.status) and (not a.type or any(h['type']==a.type for h in r['findings']))]
 cache={}
 for r in candidates:
  hits=[]
  if a.scope in ['verse','all']:
   hits=[{'method':m,'value':v,'scope':'verse'} for m,v in r['totals'].items() if (not a.method or m==a.method) and (a.value is None or str(v)==a.value)]
  if a.scope!='verse' or a.raw:
   key=f"{r['book']}.{r['chapter']:02}"
   if key not in cache:
    with gzip.open(R/'chapters'/f'{key}.json.gz','rt') as f:cache={key:{x['ref']:x for x in json.load(f)}}
   raw=cache[key][r['ref']]
   if a.raw:
    print(json.dumps(raw,ensure_ascii=False));continue
   if a.scope in ['word','all']:
    for i,w in enumerate(raw['word_totals'],1):
     hits += [{'method':m,'value':v,'scope':'word','word':i,'text':raw['words'][i-1]} for m,v in w.items() if (not a.method or m==a.method) and (a.value is None or str(v)==a.value)]
   if a.scope in ['interval','all']:
    spans=[(i,j) for i in range(len(raw['words'])) for j in range(i+1,len(raw['words'])+1)]
    for m,values in raw['intervals'].items():
     if a.method and m!=a.method:continue
     for (i,j),v in zip(spans,values):
      if a.value is None or str(v)==a.value:hits.append({'method':m,'value':v,'scope':'interval','words':[i+1,j],'text':' '.join(raw['words'][i:j])})
  if hits:print(json.dumps({'ref':r['ref'],'text':r['text'],'status':r['status'],'matches':hits,'findings':r['findings'],'pending':r['pending']},ensure_ascii=False))
if __name__=='__main__':main()
