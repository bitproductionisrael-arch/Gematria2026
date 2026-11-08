"""Fetch the exact public OSHB source blobs. SHA-1 checked before any scan."""
import urllib.request,hashlib
from pathlib import Path
R=Path(__file__).resolve().parent/'source'
COMMIT='3d15126fb1ef74867fc1434be1942e837932691f'
FILES={'Gen.xml':'09ac9cab0a47c5fae8d747c2868f1cf50d6d1131','Exod.xml':'9397e001f25d14353793a3924d4e9c605cecfc6c','Lev.xml':'71dca6003694912dd283b5d4f7e98d0790a123f6','Num.xml':'15339e5a99c7900cf37810f8d6d7f18c59ad0aa0','Deut.xml':'6966deedd88043fbef5a124d50e346711f652efa','LICENSE.md':'906e051438bf66ef6f2f7f36110504cba2b6867f','README.md':'0ab32e4de54f034368abd343b08caa8f3e36da99'}
R.mkdir(parents=True,exist_ok=True)
for name,sha in FILES.items():
 p=R/name
 if not p.exists():
  url=f'https://raw.githubusercontent.com/openscriptures/morphhb/{COMMIT}/'+('wlc/' if name.endswith('.xml') else '')+name
  p.write_bytes(urllib.request.urlopen(url,timeout=90).read())
 b=p.read_bytes();got=hashlib.sha1(f'blob {len(b)}\0'.encode()+b).hexdigest();assert got==sha,(name,got,sha)
 print(name,sha,'OK')
