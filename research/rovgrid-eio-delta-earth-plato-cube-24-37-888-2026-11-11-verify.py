#!/usr/bin/env python3
"""Reproduce EIO / Delta / Plato's cube / Agrippa Kamea connections."""
greek={"Ε":5,"Ι":10,"Ω":800,"Δ":4}
eio=sum(greek[x] for x in "ΕΙΩ")
assert eio==815==5*163==22*37+1
assert eio+greek["Δ"]==819
difference=888-eio
assert difference==73==2*37-1
assert eio+difference==888==24*37
assert (22*37+1)+(2*37-1)==888
# Squares of Agrippa indexed by the proposed planetary correspondence.
ag_order={"Ε":8, "Ι":6, "Ω":3}
# Geometry of a cube, not astronomy: (vertices, faces, coordinate axes).
cube_features=(8,6,3)
assert tuple(ag_order[ch] for ch in "ΕΙΩ")==cube_features
vertices,faces,axes=cube_features
assert vertices==8 and faces==6 and axes==3
triangles_per_face=4  # Plato, Timaeus 55b–e: four isosceles right triangles per square.
triangles=faces*triangles_per_face
assert triangles==24
assert triangles*37==888
# Earth (=element/cube symbol), Hebrew word used in the RovGrid square title.
values={"ה":5, "א":1, "ר":200, "ץ":90}
assert sum(values.values())==296==8*37
assert 6*148==888 and 2*148==296 and 3*296==888
assert 37==6*3*(3-1)+1 and 73==6*4*(4-1)+1
print("PASS: EIO 815, Delta-letter 4 vs gap 73, earth-cube (8,6,3), 24 triangles, 888.")


# Three dimensions / three pairs of opposite cube faces.
# Plato's elemental cube has six square faces of four right isosceles triangles each.
dimensions=3
face_pairs=dimensions
faces_in_pair=2
triangles_per_square_face=4
weight_per_triangle=37
assert dimensions==axes==3
assert face_pairs*faces_in_pair==faces==6
assert faces_in_pair*triangles_per_square_face==8
earth_for_each_axis=faces_in_pair*triangles_per_square_face*weight_per_triangle
assert earth_for_each_axis==296
assert dimensions*earth_for_each_axis==888
assert dimensions*faces_in_pair*triangles_per_square_face==24
assert 3*(2*148)==888==3*296
print('PASS: three coordinate axes, three opposite-face pairs, 3x296=888.')


# Ten-dimensional hypercube / 3-faces. Formal n-cube, not a physical spacetime claim.
from math import comb
def vertices(n):return 2**n
def three_faces(n):return comb(n,3)*2**(n-3)
assert vertices(3)==8 and three_faces(3)==1
assert vertices(4)==16 and three_faces(4)==8
assert vertices(10)==1024
assert comb(10,3)==120 and 2**(10-3)==128
assert three_faces(10)==120*128==15360
assert 128*8==1024  # disjoint vertex sets for one fixed free-axis triple
assert 1024-136==888
for n in range(3,11):
    assert three_faces(n)==comb(n,3)*2**(n-3)
print('PASS: 3D faces inside n-hypercube, 10D=1024 vertices and 15360 3-cubes.')
