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
