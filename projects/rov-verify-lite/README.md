# ROV Verify Lite

Browser-local STL mesh comparison | A ROV Labs / Amit Mike Rov software prototype

## Live source

Launch [index.html](./index.html) locally in a modern browser, or host this folder unchanged on any static host. No npm, backend, database, API key or third-party uploads are required.

This is a **separate project folder** within the existing Gematria2026 repository; it does not modify the Gematria app's root index.html.

## What it does

- Accepts an approved/reference **STL** and an exported/production **STL**.
- Parses binary and ASCII STL in the browser; validates malformed and oversize files (15 MB cap per file).
- Compares triangle count, coordinate-unique vertices, edge topology and watertightness, numeric bounding-box dimensions, surface area, optional signed volume, and an order-independent quantized triangle signature.
- Provides matching and intentionally resized cube demo pairs.
- Produces an inspectable and downloadable JSON report.
- Runs on the user's device. The standalone application itself does not transmit files.

## Quick start

1. Open `index.html` in Chrome, Edge, Firefox or Safari.
2. Click **Try identical files**, then **Try altered files** to see both outcomes.
3. Load two of your own STL files and click **Compare real files**.
4. Download JSON results and share non-sensitive feedback with **blaze@djblaze.co.il**.

To serve the app locally when a browser disallows some local-file features:

```bash
cd projects/rov-verify-lite
python3 -m http.server 8080
```

Open http://localhost:8080.

## Test cases

| Case | Expected output |
|---|---|
| Demo: identical 10-unit cubes | MATCH ON TESTED CHECKS |
| Demo: 10-unit vs 12-unit cube | DIFFERENCES DETECTED |
| Two valid STL files with equal aggregate metrics but different triangle positions | DIFFERENCES DETECTED when signatures differ |
| Unsupported .3mf file | Explicit rejection (browser Lite only supports STL) |
| Empty or truncated STL | Error, no comparison PASS |

## Important technical limitations

- **STL does not carry reliable physical unit metadata**. Numeric coordinate matches cannot guarantee physical-size equivalence.
- The tool normalizes translation but does not align rotations or accept equivalent retriangulation.
- Quantization thresholds can miss changes below tolerance, and orientation/mesh defects can limit volume checks.
- Two identical files only match **the checks implemented here**. This is not certification of a printable or safe industrial component.
- 3MF, policy signatures, certificates, production release gates, and chain-of-custody analysis exist separately in the Python **ROV Verify v0.5 / ROV TwinProof v0.1** research prototype; those engines are **not** integrated into this browser app.
- No customer validation, revenue, industrial certification or warranty is claimed.

## Commercial development hypothesis

Free STL self-check → measured 3D/CAD user feedback → validated 3MF/production Python API pilot → potential paid workflows. No monetization, licensing terms or hosted multi-user service are included yet.

## Project status

- Released as a standalone offline HTML prototype, Oct 27, 2026.
- Browser UI checks: matching and modified cube scenarios were manually executed in Chromium.
- External users: not yet verified.
- Status feedback and reproducible bug reports: **blaze@djblaze.co.il**.
- Copyright © 2026 Amit Mike Rov / ROV Labs. All rights reserved until a LICENSE file is explicitly added.
