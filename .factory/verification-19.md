# Independent verification 19 — FAIL

**Candidate:** `15674b0dfe8a26931f8d64c51b44d23859728e77` on `main`  
**Live URL:** <https://food-log-export-kit.sociobot.in>  
**Verified:** 2026-09-02 UTC

## Decision

**FAIL — do not release this candidate.** The live website identifies itself as
the requested candidate, but its version `0.1.19` desktop installers belong to
another immutable source commit. The website and downloadable desktop product
are therefore not one release.

| Severity | Finding | Evidence |
| --- | --- | --- |
| Critical | The desktop installer release cannot be tied to the deployed candidate. | Git tag and GitHub release `v0.1.19` target `f80b939cbff20abb945b1d3a01a125351a226c55`; live `/release-identity.json?version=0.1.19` returns `15674b0dfe8a26931f8d64c51b44d23859728e77`. The candidate-installers claim fails at this exact assertion. |

The requested candidate is deployed as the site, but that does not satisfy the
desktop release contract. The landing page also displays “Downloads are being
published” instead of a detected-platform installer, although the old release
assets exist.

## Mandatory claims

Ran every command in `.factory/claims.json` after `npm ci` from this checkout
(66 packages; 0 vulnerabilities).

- **Pass (24):** `csv-export`, `json-archive`, `local-only`, `format-import`,
  `explained-drops`, `lossy-fields`, `validation-notes`, `batch-import`,
  `license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`,
  `privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`,
  `detected-platform-downloads`, `verified-installer`, `windows-installer`,
  `license-request-data-boundary`, `static-hosting`, `release-workflow`,
  `site-source-commit`, and `release-preflight`.
- **Fail (release-blocking):** `candidate-installers`. Expected immutable tag
  source `f80b939…`; received live identity `15674b0…`.

## First-read and functional QA

Cold opening the live landing page answered all three required questions in
plain words: “Save your food history”; “For food tracker users who need years
of meals and recipes in files they control”; and **Try it with sample data**.
The adjacent sentence says the click reviews 12 entries and downloads a CSV and
JSON archive. `/demo` immediately showed the app and “Demo — sample data,
nothing is saved.”

On live `/demo`, `food-log.csv` contained its header plus 12 data rows and
`food-log-archive.json` contained 12 records. No external requests, console
errors, or page errors occurred during that flow. The passing claim suite also
covered delimiter and JSON imports, invalid-data notes/recovery, unknown-field
preservation, licensing, offline reload, and demo discard.

At desktop and 390px there was no horizontal overflow. The first Tab reaches a
44px Skip to main link with a visible 3px focus outline; Enter moves to
`#main`. Reduced-motion testing showed no sampled hero animation. Axe Playwright
found zero serious or critical issues on live `/demo` at both widths. No
`verify-url.sh` exists in this checkout; equivalent live title/lang/h1/main,
alternative text, console, focus, and route checks were performed directly.

## Privacy, headers, performance, and builds

The cold landing contacted same-origin assets and the documented GitHub release
metadata endpoint. Demo data actions contacted same-origin only; no analytics,
remote scripts, account UI, or food-data request was observed. The static
product exposes no product-controlled server endpoint; license verification is
the external Sociobot billing API, already checked by the request-boundary
claim, so product API rate-limit testing is not applicable.

Live HTML has HSTS, CSP, `nosniff`, strict referrer and permissions policies.
`/`, `/demo`, `/app`, `/privacy`, and `/terms` returned 200; `/missing-page`
returned 404. HTML is 30-second must-revalidate and hashed JS is immutable for
one year. The local production build totals 18,298 bytes gzipped JavaScript and
6,100 bytes gzipped CSS.

- `npm test` — **fail**, 39/40 unit tests pass; only the provenance claim fails.
- `npm run test:e2e` — pass, 62 tests.
- `npm run build` and `npm run build:app` — pass.
- `cargo test --manifest-path src-tauri/Cargo.toml` — cannot run in this
  container because documented `glib-2.0` and `webkit2gtk-4.1` dependencies are
  absent; `npm run native:prereqs` reports that exact condition.

## Required repair

Create and publish a new immutable tag from this candidate, or redeploy the
exact immutable tagged artifact. Then require live release identity, tag,
`latest.json`, `SHA256SUMS`, build-info, and every installer to name one source
commit, and confirm the landing page resolves a detected-platform installer.
