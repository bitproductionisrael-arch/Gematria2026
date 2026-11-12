# RovGrid — 2D centered-square 13 to 3D cuboctahedron: 12 vertices, 24 edges, center 1

12 November 2026 — geometry / body model, no automatic increase in achievement count.

## Exact construction
A 2D centered square of order 3 has 13 points: central 1, 4 inner-ring lattice points, and 8 outer-ring lattice points. Its definition is C3=3²+2²=13.

In 3D choose the 12 vertices consisting of permutations of (±1,±1,0). The twelve points form a regular cuboctahedron:
- z=0: four equatorial points (±1,±1,0).
- z=+1: four points (±1,0,+1),(0,±1,+1).
- z=−1: four points (±1,0,−1),(0,±1,−1).
- the geometric center (0,0,0) is a thirteenth point, *inside* the polyhedron (not a polyhedron vertex).
- two vertices are connected by an edge exactly when their squared Euclidean distance is 2. There are exactly 24 undirected edges.
- its surface has 8 triangular and 6 square faces, 14 in all; Euler 12−24+14=2.
- therefore the 3D model has **12 surface vertices +24 edges +1 chosen center =37 named elements**, each of a specified type.

## 2D→3D correspondence
There is a **bijective relabeling of 13 point IDs** between the 2D centered-square point inventory (1+4+8) and the 3D cuboctahedron center plus vertices (1+4+8). This is a *re-embedding of 13 labeled points*, not generally a rigid lifting or orthogonal projection that preserves lengths, coordinates or adjacency of the 2D square grid. A strict 2D orthogonal projection of a specific anatomical 3D model requires bone coordinates and a projection matrix and has not been demonstrated.

## Thoracic bone-count mapping
A conventional adult thorax includes exactly 1 sternum +12 thoracic vertebrae +24 left/right ribs=37 distinct bones (12 rib pairs).
Proposed card metaphor:
- 1 sternum ↔ mathematical center.
- 12 thoracic vertebrae ↔ surface vertices.
- 24 ribs ↔ polyhedron edges.
This is a **type-separated 1-to-1 cardinality mapping** between body inventory and mathematical elements; it is **not an anatomically faithful 1-to-1 incidence graph**. In the cuboctahedron each vertex has four edges and an edge connects two polyhedron vertices; in actual thoracic anatomy ribs anchor posteriorly at the thoracic vertebrae, and only upper ribs connect to the sternum by cartilage, while floating ribs lack anterior sternal attachment. The sternum is a single elongated bone, not a geometric centroid. The 12 vertebrae occupy a column posteriorly, not the 12 vertices of this convex solid. The model is an exact combinatorial numerical analogy and a valid 3D reassembly of labeled points, **not an anatomical projection theorem**.

## Additional useful geometric checks
- V=12, E=24, F=14. 12+24+1=37; 8+6=14; 12−24+14=2.
- Each of the 12 vertices touches exactly four of the 24 edges; 12×4/2=24.
- The 12 vertices may be grouped 4 at z=0, 4 at z=+1, 4 at z=−1, so 4+8=12.
- Center + four equatorial + eight non-equatorial =1+4+8=13. This reproduces the 2D centered square's *ring population* but not its Euclidean arrangement.

## How the animation should display it
1. Show C3 in 2D: 1 central, 4 inner, 8 outer points.
2. Lift four inner points into an equatorial ring of the cuboctahedron; lift eight outer points into the two planes above/below (4 each). Keep the 1 center at origin.
3. Connect vertices along the 24 mathematically defined cuboctahedron edges, verify the edge counter reaches 24.
4. Overlay the anatomical 1/12/24 inventory by labels, not by claiming the ribs are literally identical to the polyhedron's edges or that the bone skeleton is a cuboctahedron.
5. Animate separately an actual 3D rib cage with 12 thoracic vertebrae posterior, sternum anterior, ribs linking through their real posterior/articular/anterior patterns. Do **not** claim exact anatomical connectivity identical to cuboctahedron.
6. Highlight **13→37** as the arithmetic / re-embedding insight: 13 labeled points plus 24 polyhedron edges.
7. No new trophy in 1 complete+14 partial+41 support until a new independent and clearly distinct card is added to the corpus by agreed criteria.

## References
- Standard cuboctahedron 12 vertices, 24 edges, 6 squares and 8 triangles: https://www3.mpifr-bonn.mpg.de/staff/pfreire/polyhedra/polyhedra.htm
- Vertex coordinates (±1,±1,0) and permutations: Coxeter *Regular Polytopes*, excerpt https://jasoncantarella.com/downloads/coxeter-chapter-3.pdf
- Thorax 12 thoracic vertebrae, 24 ribs and sternum and direct/indirect/floating rib classes: https://open.oregonstate.education/anatomy2e/chapter/thoracic-cage/
- Details of rib articulations: https://www.ncbi.nlm.nih.gov/books/NBK538328/
