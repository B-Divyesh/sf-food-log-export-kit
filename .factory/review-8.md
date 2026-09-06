# Save food tracker history review 8

- **Reviewed:** 2026-09-06 UTC
- **Live URL:** <https://food-log-export-kit.sociobot.in>
- **Implementation reviewed:** `68cd2a8c899b433776ce0f0a6e9a9cd1fe3b8d25` (`v0.1.22`)
- **Documentation SHA:** `995def8` (the verification report/handoff commit); the checkout also contains later Graphify-only commit `2c5f74c`, which was not treated as a product image change.

## Verdict

**PASS — 0 findings and 0 untested claims.**

No critical, high, medium, low, or informational product defect was found.

## Job, audience, and first action

Fresh 1440 × 900 desktop and 390 × 844 phone browsers opened the live root without scrolling.

- **Job:** save food-tracker history as local CSV and JSON files.
- **Audience:** food-tracker users leaving an app with years of meals and recipes.
- **First action:** **Try it with sample data**; it says it opens 12 entries and allows CSV and JSON download.

At both sizes the action was above the fold. The page had the expected title, one `h1`, one `main`, no horizontal overflow, and no console/page errors.

## Demo and product paths

One click opened `/?demo=1` with the persistent **Demo — sample data, nothing is saved** label, **Reset demo**, **Start for real**, and the realistic Oatmeal with blueberries record. Reset retained the label and restored the sample. CSV contained a header plus 12 rows; JSON contained 12 records. Leaving through Start for real opened `/app`; a separate real-storage sentinel stayed unchanged.

The full suite and the independent claim commands cover normal import/export, unsupported-file recovery, invalid and boundary values, unknown fields preserved in JSON, offline reload/update, keyboard/filter state, focus return, 200% scale, reduced motion, privacy, billing error allowance, legal pages, and release fallback. This is a static local-first product, so tenant isolation, service restart persistence, SQLite, and health endpoints do not apply.

## Declared claims

A new detached clone of `v0.1.22` ran `npm ci` successfully with zero reported vulnerabilities. Every exact command in `.factory/claims.json` was run separately as written.

| Claims | Result |
| --- | --- |
| `csv-export`, `json-archive`, `local-only`, `format-import`, `explained-drops` | PASS |
| `lossy-fields`, `validation-notes`, `batch-import`, `license-restore`, `paid-purchase` | PASS |
| `offline-reload`, `demo-discard`, `privacy-no-account`, `free-behavior`, `normalized-types` | PASS |
| `revoked-license`, `detected-platform-downloads`, `verified-installer`, `windows-installer`, `license-request-data-boundary` | PASS |
| `static-hosting`, `release-workflow`, `candidate-installers`, `site-source-commit`, `release-preflight` | PASS |

There are 25 unique declared IDs and 25 passing commands. I compared the live landing page, README, Privacy, Terms, copy audit, and claims manifest; no public claim was missing, false, partial, or untested.

## Build and installed-app checks

| Check | Result |
| --- | --- |
| `CI=1 npm test` | PASS — 44 unit and 58 browser tests; four mobile-only desktop-project tests were exercised by the mobile project |
| `npm run build` and `npm run build:app` | PASS — emitted `dist/site` and `dist/app` |
| `npm run native:prereqs` after documented packages | PASS |
| Rust format, locked test, locked Clippy with `-D warnings` | PASS |
| `CI=false npm run tauri -- build --no-bundle` | PASS — optimized native executable produced |
| Clean consumer installation | PASS — live `install.sh` verified and installed the 0.1.22 Linux AppImage; the launcher remained running under Xvfb for 12 seconds |

The initial consumer launch correctly identified missing host `libEGL`; after installing the exact documented GTK/WebKit prerequisites, the same clean-install flow passed. This is an environment prerequisite, not a product defect.

## Live accessibility, routes, privacy, and release

The factory URL verifier passed on `/` and `/demo`: HTTP 200, title, `lang`, one `h1`, main landmark, image alternatives, labeled buttons, and no page errors. Live `@axe-core/playwright` scans on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the designed missing route found zero serious or critical violations. The expected failed-document console message for the deliberate HTTP 404 was excluded as specified; the designed page has its own title, one `h1`, and one `main`.

All normal routes had distinct titles. The footer/legal links, installer/release link, and privacy text are present. The root CSP, HSTS, referrer policy, `nosniff`, permissions policy, and restrictive external connection list are live. The static app makes no backend persistence claim; its food conversion is local. The release identity names `v0.1.22` and `68cd2a8`, matching the reviewed tag and installed artifact.

## Earlier findings

I inspected every earlier review, verification, polish report, and handoff, including minor findings. Their present disposition is:

| Earlier group | Disposition |
| --- | --- |
| Initial verification through review 5 | Fixed: paid purchase/rate limit, conversion notes, token-bound license state, validation, touch targets, true 404, shared routes, plain copy, and complete claims are covered by current tests and live checks. |
| Reviews 6–7 and verifications 6, 8, 13, 17–21 | Fixed: immutable tag, deployment, release assets, checksums, installer links, and identity all bind to `68cd2a8`; `candidate-installers` passes from the detached tag. |
| Verification 10 | Fixed: service-worker replacement/offline behavior and the exact public-claim inventory pass. |
| Verification 12 | Fixed: live checkout, normal verification, 429, and numeric `Retry-After` behavior passed in the current regression coverage. |
| Verification 13–14 and 20–21 | Fixed: documented native commands, direct download/release fallback, filter state, payment legal copy, and current copy-audit coverage pass. |

No earlier finding reopened.
