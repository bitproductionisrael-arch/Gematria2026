"""RovGrid high-power laws: exact integers, exhaustive n=1..150.
Mathematical checks: 2-adic phase, Newton power sums, Genesis matrix.
"""
from math import prod

def v2(x):
    assert x > 0
    return (x & -x).bit_length()-1

# 888/136 phase: highest 2-power after addition/subtraction.
for n in range(1,151):
    a,b=888**n,136**n
    plus,minus=a+b,a-b
    vp=3*n + (7 if n%2 else 1)
    vm=3*n + (1 if n%2 else 7+v2(n))
    assert v2(plus)==vp,(n,"sum",v2(plus),vp)
    assert v2(minus)==vm,(n,"difference",v2(minus),vm)
    assert (vp>vm) == bool(n%2)

cases={
  3:(702742528,16,10723,697711616,10,681359),
  4:(622143741952,13,75945281,621459537920,21,296335),
  10:(304880509033219313877857075200,31,141971050311447733025,
       304880504703905378195889717248,38,1109148814808233067),
}
for n,(sp,vs,odd_s,md,vd,odd_d) in cases.items():
    assert 888**n+136**n==sp==2**vs*odd_s
    assert 888**n-136**n==md==2**vd*odd_d
    assert odd_s%2==odd_d%2==1

# The primitive cuboid (4,10,13) and doubled cuboid (8,20,26).
for n in range(0,151):
    p=sum(a**n for a in (4,10,13))
    P=sum(a**n for a in (8,20,26))
    assert P==2**n*p
assert (sum(x**3 for x in (8,20,26)),
        sum(x**4 for x in (8,20,26)),
        sum(x**10 for x in (8,20,26)))==(26088,621072,151408169395200)
assert (sum(x**3 for x in (4,10,13)),
        sum(x**4 for x in (4,10,13)),
        sum(x**10 for x in (4,10,13)))==(3261,38817,147859540425)
assert sum(x**10 for x in (8,20,26))==1024*sum(x**10 for x in (4,10,13))

# Infinite Newton/power-sum recurrence from symmetric edge coefficients.
P=[3,54,1140]
for n in range(3,151):
    P.append(54*P[-1]-888*P[-2]+4160*P[-3])
assert all(P[n]==sum(a**n for a in (8,20,26)) for n in range(151))
assert P[2]==54**2-2*888
assert P[10]==151408169395200

# Symmetric 2x2 matrix A=[[55,18],[18,55]];
# every power is [[x,y],[y,x]].
x,y=1,0
for n in range(0,41):
    assert x==(73**n+37**n)//2
    assert y==(73**n-37**n)//2
    assert x*x-y*y==2701**n
    if n==3: assert (x,y)==(219835,169182)
    if n==4: assert (x,y)==(15136201,13262040)
    if n==10: assert (x,y)==(2151217207037987749,2146408622665569900)
    x,y=55*x+18*y,18*x+55*y
assert 2701**10==20665496403211819359098263288077001

# Two scales make 1024 at n=10, both by arithmetic doubling.
assert 74==2*37
assert 74**10==1024*37**10
assert 148==4*37
assert 148**10==1024**2*37**10
assert 5476==74**2==37*148==2*2701+74
assert 1024**10==2**100

print("PASS phase n1..150, cuboid recurrence n0..150, Genesis matrix n0..40.")
for n in (3,4,10):
    a,b=888**n,136**n
    print(f"phase n={n}: v2(sum)={v2(a+b)}, v2(difference)={v2(a-b)}")
print("cuboid P10:",f"{P[10]:,}")
print("Genesis 2701^10:",f"{2701**10:,}")
