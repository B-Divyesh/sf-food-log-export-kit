# Verification 17 — FAIL

- **Candidate:** `03b2bc0cf2a6e680ef3d33539a9cc1ef56ac40a9`
- **Live URL:** <https://food-log-export-kit.sociobot.in>
- **Verified:** 2026-09-02 UTC

**Decision: FAIL — do not accept this desktop-app candidate.**

## Release-blocking defect

| Severity | Evidence | Required correction |
| --- | --- | --- |
| Critical | The candidate's required `candidate-installers` claim fails. The immutable `v0.1.17` tag, the GitHub release API, and the release `SHA256SUMS` identify source commit `15156f04a39104211d95ff0e965712d9c4732333`. The live `/release-identity.json` identifies `03b2bc0cf2a6e680ef3d33539a9cc1ef56ac40a9`. Thus the published macOS, Windows, and Linux installers are not built from the deployed candidate. | Build and publish a new immutable version/tag from `03b2bc0…` (or deploy the tagged commit), then make the site, release identity, release target, `latest.json`, `SHA256SUMS`, and installer links all resolve to that one commit. Re-run the claim. |

The exact failed command was:

```text
npm run test:unit -- --testNamePattern @claim:candidate-installers
```

Its assertion expected the live identity source commit to be
`15156f04a39104211d95ff0e965712d9c4732333` (the `v0.1.17` tag target), but
received `03b2bc0cf2a6e680ef3d33539a9cc1ef56ac40a9`.

The release itself is otherwise internally consistent: a freshly downloaded
`Food.Log.Export.Kit_0.1.17_x64-setup.exe` has SHA-256
`1e4a84759c04ef01887bb25716f91510e1722ec60d8a041c3d3f6aaa0ea9ac15`, matching
that release's `SHA256SUMS`; the checksum header still names `15156f0…`.

## Required claims

`.factory/claims.json` exists and lists 25 claims. Every exact command was
run independently from this checkout. 24 passed and one failed:

- Passed: `csv-export`, `json-archive`, `local-only`, `format-import`,
  `explained-drops`, `lossy-fields`, `validation-notes`, `batch-import`,
  `license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`,
  `privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`,
  `detected-platform-downloads`, `verified-installer`, `windows-installer`,
  `license-request-data-boundary`, `static-hosting`, `release-workflow`,
  `site-source-commit`, and `release-preflight`.
- Failed: `candidate-installers`, as documented above.

Because a declared claim test fails, the candidate fails the release gate even
though the app behavior checks below pass.

## First read and product behavior

Fresh cold-browser read of `/`: **PASS.** The first screen says “Save your food
history,” says it is for food-tracker users needing years of meals and recipes
in files they control, and offers one-click **Try it with sample data** with
the adjacent result (“Review 12 sample entries, then download a CSV and JSON
archive.”).

The live `/demo` has the required persistent “Demo — sample data, nothing is
saved” banner, reset and exit actions, and 12 review rows. A fresh browser
exported `food-log.csv` and `food-log-archive.json` without page errors. The
full browser suite also passed all representative CSV/JSON imports, delimiter
variants, meal/recipe/nutrition/weight normalization, malformed values,
conversion notes, recovery, free/paid selection, license restoration and
revocation, and offline reload.

## Local verification

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 66 packages; 0 reported vulnerabilities. |
| `npm test` | FAIL — 35 unit tests pass; the single release-identity test above fails, so the chained browser phase does not start. |
| `npm run test:e2e` | PASS — 62 Playwright tests. |
| `npm run build` | PASS — TypeScript and production Vite build produced `dist/site/`. |
| `npm run build:app` | PASS — TypeScript and Tauri frontend build produced `dist/app/`. |
| `npm run native:prereqs` | PASS after installing the repository's documented local GLib/WebKit packages. |
| `cargo test --manifest-path src-tauri/Cargo.toml` | PASS — compiled the native crate; it contains 0 unit tests and 0 doctests. |

There is no separate lint command. Both production builds include `tsc --noEmit`.
The main initial JS asset is 39.70 kB raw / 14.10 kB gzip and CSS is 23.48 kB
raw / 6.10 kB gzip, inside the stated budgets.

## Live quality, privacy, and deployment checks

- Live `/release-identity.json` matches the assigned candidate commit, which
  is what exposes the installer provenance mismatch.
- Fresh Axe scans on `/`, `/demo`, `/app`, `/privacy`, `/terms`, and the real
  HTTP 404 found no serious or critical violations. Each successful route had
  `lang="en"`, one `h1`, one `main`, route-specific titles, and no missing image
  alternatives. No console or page errors were observed (the browser's expected
  failed-resource message on the deliberately HTTP-404 route was excluded).
- Desktop and 390 x 844 mobile screens were visually inspected. Mobile has no
  horizontal overflow; keyboard Tab first reaches the skip link with visible
  focus. Reduced-motion mode limits computed animation/transition duration to
  0.01 ms.
- A fresh Playwright demo flow recorded only same-origin requests to the site
  while exporting CSV and JSON. The landing page separately requests the
  documented GitHub release API for installer selection; no tracking or
  food-data upload was observed. Demo conversion writes no account flow.
- Root responses include CSP, HSTS, `X-Content-Type-Options: nosniff`, strict
  referrer policy, and denied camera/microphone/geolocation. HTML and `sw.js`
  use short revalidation caching; hashed JS uses `public, max-age=31536000,
  immutable`.
- This is a static product with no product-owned server endpoint or sign-in.
  Its client-side Sociobot license verification boundary is covered by the
  passing `license-request-data-boundary` claim; no product API allowance or
  429 response exists to test. Entra External ID is not applicable.

## Handoff

No product code, deployment, customer data, secrets, or external service was
changed. The pre-existing `graphify-out/` working-tree changes were preserved.
