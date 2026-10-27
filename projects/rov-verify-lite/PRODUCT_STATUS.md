# ROV Verify Lite — Product Operating Record

Last updated: 2026-10-27

## What has been shipped to GitHub

- `index.html`: complete standalone browser-local STL comparison utility.
- `README.md`: user and developer guide, scope and safety limitations.
- `tests/test_browser_smoke.py`: five reproducible Chromium checks.

This subproject is hosted in `Gematria2026/projects/rov-verify-lite/` and does not overwrite the existing Gematria2026 site root.

## Local verification (executed)

- 2026-10-27: 5/5 Python Playwright smoke tests passed against the application content in Chromium.
- Scenarios: identical cubes, modified-size cubes, malformed STL rejected, unsupported 3MF rejected, binary STL coordinates parsed.
- Previous original Python ROV Verify + TwinProof release: 55 automated tests reported passed on the same date; this engine is **not** included in this GitHub Lite project.

## Current customer status

- Confirmed external test users: 0 at time of this record.
- Confirmed paying customers and recurring revenue: 0.
- Public web hosting / GitHub Pages: not verified, so do not claim a live website.

## Next commercial acceptance gate

1. Independently test the browser app on 3 real external CAD / 3D-printing users.
2. Collect expected vs actual results for a reference/derivative STL pair; file types and anonymized error details.
3. Record reproducible errors and false positives/negatives in GitHub Issues.
4. Validate correctness with customer-supplied permissioned data before claiming industrial release-readiness.
5. Ask each tester whether a paid 3MF/signed-evidence pilot would save enough work to justify procurement.

## Non-goals / non-claims

No file upload or user tracking service, no sales or subscriptions, no validated physical manufacturing claims, no automatic scheduled work, no primes/records competition claims in this industrial product.

Contact: blaze@djblaze.co.il.
