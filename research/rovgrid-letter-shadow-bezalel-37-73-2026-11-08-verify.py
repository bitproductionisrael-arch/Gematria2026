#!/usr/bin/env python3
"""Test RovGrid letter-shadow algorithm using a fixed Hebrew milui profile."""
order="אבגדהוזחטיכלמנסעפצקרשת"
regular=dict(zip(order,list(range(1,10))+list(range(10,100,10))+list(range(100,500,100))))
for f,b in zip("ךםןףץ","כמנפצ"): regular[f]=regular[b]
small={k:(v-1)%9+1 for k,v in regular.items()}
zero_step={k:(v//10 if v>=10 and v%10==0 else v) for k,v in regular.items()}
milui={"ב":"בית","צ":"צדי","ל":"למד","א":"אלף"}
name="בצלאל"
full="".join(milui[c] for c in name)
shadow="".join(milui[c][1:] for c in name)
def v(s,m):return sum(m[c] for c in s)
assert shadow=="יתדימדלףמד"
assert full=="ביתצדילמדאלףלמד"
for mapping,original,complete,shade in [
    (regular,153,775,622),
    (small,18,55,37),
    (zero_step,18,91,73)
]:
    assert v(name,mapping)==original
    assert v(full,mapping)==complete
    assert v(shadow,mapping)==shade
    assert complete-original==shade
assert [v(milui[c][1:],small) for c in name]==[5,5,8,11,8]
assert [v(milui[c][1:],zero_step) for c in name]==[41,5,8,11,8]
assert v(shadow,zero_step)-v(shadow,small)==36
assert 153==17*18//2 and 91==13*14//2
print("All shadow-cipher checks passed: בצלאל → ית די מד לף מד; 37 / 73 / 622")
