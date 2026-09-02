# Round 7 clean-clone verification

Verified 2026-09-02 UTC from a fresh GitHub clone at `15156f04a39104211d95ff0e965712d9c4732333` (`v0.1.17`). `npm ci` reported zero vulnerabilities.

## Full gates

| Command | Result |
|---|---|
| `npm test` | PASS — 36 unit tests and 58 browser tests; four desktop skips have passing mobile counterparts. |
| `npm run build:site` | PASS — largest JS chunk 39.70 kB raw / 14.10 kB gzip; CSS 23.48 kB raw / 6.10 kB gzip. |
| `npm run build:app` | PASS — same bounded application assets. |
| `npm run native:prereqs` | PASS. |
| `cargo test --manifest-path src-tauri/Cargo.toml` | PASS — Linux Tauri application, library, and documentation test targets compiled. |

## Exact claim commands

Every `test` string in `.factory/claims.json` was launched separately from that clean clone. Result: **25/25 PASS** in 179.4 seconds.

1. `csv-export`
2. `json-archive`
3. `local-only`
4. `format-import`
5. `explained-drops`
6. `lossy-fields`
7. `validation-notes`
8. `batch-import`
9. `license-restore`
10. `paid-purchase`
11. `offline-reload`
12. `demo-discard`
13. `privacy-no-account`
14. `free-behavior`
15. `normalized-types`
16. `revoked-license`
17. `detected-platform-downloads`
18. `verified-installer`
19. `windows-installer`
20. `license-request-data-boundary`
21. `static-hosting`
22. `release-workflow`
23. `candidate-installers`
24. `site-source-commit`
25. `release-preflight`

The `candidate-installers` command independently downloaded an installer, matched its SHA-256, and compared all published and deployed identities with the immutable version tag.

## Cold production checks

- Worker URL checks passed on `/`, `/?demo=1`, `/app`, `/privacy`, and `/terms` with no console errors.
- Every checked route has one `h1`, one `main`, `lang="en"`, route-specific titles, labeled controls, and image alternatives.
- Axe found no serious or critical violations on the five production routes or the HTTP 404.
- `/not-a-real-route` returned HTTP 404 with `Page not found — Food Log Export Kit`.
- At 390 px, all visible controls were at least 44 px and every checked route had no horizontal overflow.
- The demo had no overflow at 200% page scale.
- The direct demo made three same-origin requests, no cross-origin requests, created no cookies or web-storage keys, and loaded no remote scripts.
- The sample record ended at 616 px in an 844 px viewport. Reset restored all 12 records; leaving demo retained the real-workspace sentinel and opened an empty `/app` workspace.
- CSV export contained its header plus 12 records. An offline reload still showed the oatmeal sample.
- Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, CLS 0, total transfer 87 KiB. Raw report: `lighthouse-live.json`.
