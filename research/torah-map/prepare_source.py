"""Freeze OSHB WLC ketiv; keep qere/maqqef evidence without mixing readings."""
import json, hashlib, re, xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BOOKS = [('Gen','בראשית',50),('Exod','שמות',40),('Lev','ויקרא',27),('Num','במדבר',36),('Deut','דברים',34)]
NS = {'o':'http://www.bibletechnologies.net/2003/OSIS/namespace'}
def clean(s): return ''.join(re.findall('[א-ת]',s))
def main():
    rows, books = [], []
    for book,he,nchap in BOOKS:
        path=ROOT/'source'/f'{book}.xml'
        tree=ET.parse(path)
        counts=[]; bi=0
        for ci,chapter in enumerate(tree.findall('.//o:chapter',NS),1):
            assert chapter.get('osisID')==f'{book}.{ci}'
            verses=chapter.findall('o:verse',NS); counts.append(len(verses))
            for vi,verse in enumerate(verses,1):
                assert verse.get('osisID')==f'{book}.{ci}.{vi}'
                words=[]; units=[]; pointed=[]; variants=[]; joins=[]; join=False
                for el in verse:
                    tag=el.tag.split('}')[-1]
                    if tag=='w':
                        raw=''.join(el.itertext()).replace('/','')
                        word=clean(raw)
                        assert word, (book,ci,vi,raw)
                        words.append(word); pointed.append(raw)
                        if join:
                            units[-1]+='־'+word; joins.append(len(words)-1)
                        else: units.append(word)
                        join=False
                    elif tag=='seg' and el.get('type')=='x-maqqef': join=True
                    elif tag=='note' and el.get('type')=='variant':
                        variants.append({'after_word':len(words),'xml':ET.tostring(el,encoding='unicode')})
                bi+=1
                rows.append({'ref':f'{book}.{ci}.{vi}','book':book,'book_he':he,'chapter':ci,'verse':vi,'torah_index':len(rows)+1,'book_index':bi,'text':' '.join(words),'words':words,'pointed_words':pointed,'maqqef_text':' '.join(units),'maqqef_after_word':joins,'variants':variants,'letters':sum(map(len,words))})
        assert len(counts)==nchap
        books.append({'book':book,'book_he':he,'chapter_counts':counts,'verses':bi,'source_file':f'source/{book}.xml','sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
    assert rows[0]['ref']=='Gen.1.1' and rows[-1]['ref']=='Deut.34.12'
    assert len({r['ref'] for r in rows})==len(rows)
    (ROOT/'source/verses.json').write_text(json.dumps(rows,ensure_ascii=False,separators=(',',':')))
    manifest={'edition':'Westminster Leningrad Codex 4.20 / OSHB','repository':'https://github.com/openscriptures/morphhb','commit':'3d15126fb1ef74867fc1434be1942e837932691f','policy':'Direct verse w children only: ketiv; qere notes retained, not substituted. Strip non-Hebrew marks and morpheme slashes. One source w = one primary word; preserve maqqef alternative separately. No spelling corrections.','books':books,'verses':len(rows),'chapters':sum(len(b['chapter_counts']) for b in books),'letters':sum(r['letters'] for r in rows),'words':sum(len(r['words']) for r in rows),'variants':sum(bool(r['variants']) for r in rows)}
    (ROOT/'source/manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
    print(json.dumps(manifest,ensure_ascii=False))
if __name__=='__main__': main()
