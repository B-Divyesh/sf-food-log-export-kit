# Verification 18 — FAIL

- **Candidate:** `88a07a940040f719d2ec4fda994bda8814f8428b`
- **Live URL:** <https://food-log-export-kit.sociobot.in>
- **Verified:** 2026-09-02 UTC

**Decision: FAIL — do not accept this desktop-app candidate.**

## Release-blocking defect

| Severity | Evidence | Required correction |
| --- | --- | --- |
| Critical | The required `candidate-installers` claim fails. The live site and a clean candidate build identify source commit `88a07a940040f719d2ec4fda994bda8814f8428b`, but immutable tag/release `v0.1.18`, GitHub's release API, `latest.json`, and its installers identify `ed7b13e93e4ab5c9bbe2c2d17acfec694099fba0`. The live page therefore suppresses the platform download and says “Downloads are being published.” The documented one-line Unix installer exits 1 with “The published download does not match this app version.” | Publish a new immutable version/tag from the accepted candidate, let Actions build all platform assets and manifests from that tag, and deploy the matching tagged site artifact. Then rerun every claim. Do not move or reuse `v0.1.18`. |

The exact failing claim command was:

```text
npm run test:unit -- --testNamePattern @claim:candidate-installers
```

The assertion compared the release tag target with the deployed identity:

```text
Expected source_commit: ed7b13e93e4ab5c9bbe2c2d17acfec694099fba0
Received source_commit: 88a07a940040f719d2ec4fda994bda8814f8428b
```

The existing release is internally intact but belongs to the older commit. A
freshly downloaded `Food.Log.Export.Kit_0.1.18_x64-setup.exe` had SHA-256
`c0c86db573cc6e2d5e127c2ba3cf28cb4d5f00158705ad6546b4c7486c9182fc`,
matching `SHA256SUMS`. Its `latest.json` names version `0.1.18`, source
`ed7b13e…`, and macOS, Windows, and Linux assets.

## Mandatory claims gate

`.factory/claims.json` exists and lists 25 claims. Every listed command was
run exactly and independently before the broader QA pass from a fresh clone at
the candidate commit. Result: **24 passed, 1 failed**.

- Passed: `csv-export`, `json-archive`, `local-only`, `format-import`,
  `explained-drops`, `lossy-fields`, `validation-notes`, `batch-import`,
  `license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`,
  `privacy-no-account`, `free-behavior`, `normalized-types`,
  `revoked-license`, `detected-platform-downloads`, `verified-installer`,
  `windows-installer`, `license-request-data-boundary`, `static-hosting`,
  `release-workflow`, `site-source-commit`, and `release-preflight`.
- Failed: `candidate-installers`, for the provenance mismatch above.

Any failed declared claim is release-blocking under the acceptance contract.

## First read and real job-to-be-done

Cold first read: **PASS**. The live first screen says “Save your food history,”
names food-tracker users who need years of meals and recipes in files they
control, and presents **Try it with sample data** beside the result: review 12
sample entries, then download CSV and JSON.

The one-click demo opens a populated, isolated review workspace with the
persistent “Demo — sample data, nothing is saved” banner, **Reset demo**, and
**Start for real**. The hosted flow exported a 13-line CSV (header plus 12
records) and a JSON archive with 12 records. Starting for real discarded the
sample and opened an empty workspace.

Candidate browser checks passed for valid CSV, JSON, meals, recipes, nutrition,
and body weight. Boundary input with an impossible date, missing date, grouped
number, unreadable number, and negative number produced specific conversion
notes. On the hosted app, a CSV with unsupported headings reported exactly what
headings were needed; choosing a corrected file recovered immediately. No
nutrition or medical advice action was present.

## Clean-checkout verification

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 66 packages; 0 reported vulnerabilities. |
| Every command in `.factory/claims.json` | FAIL — 24/25 passed; `candidate-installers` failed. |
| `npm test` | FAIL — 37/38 unit tests passed; the same live release-identity test failed, so the chained browser phase did not run. |
| `npm run test:e2e` | PASS — 58 passed, 4 desktop-project skips; the four mobile-only checks passed in the mobile project. |
| `npm run build` | PASS — TypeScript and production site build emitted `dist/site/`. |
| `npm run build:app` | PASS — TypeScript and desktop frontend build emitted `dist/app/`. |
| `npm run native:prereqs` | PASS after installing the README's documented GLib/WebKit packages in the disposable verifier. |
| `cargo test --manifest-path src-tauri/Cargo.toml` | PASS — native crates compile; 0 unit tests and 0 doctests. |

There is no lint script. Both Vite production builds run `tsc --noEmit`. In
accordance with the desktop installer contract, platform packages were not
built locally; GitHub Actions owns those builds.

## Deployment identity, privacy, and server boundary

- The live HTML, main JS, CSS, service worker, and `release-identity.json`
  SHA-256 hashes exactly match the clean candidate build. The live site itself
  is therefore candidate `88a07a9`; the mismatch is specifically the desktop
  release.
- A full hosted `/demo` import/export request log contained only the document,
  same-origin JavaScript, and same-origin CSS. It had no cookies, local-storage
  writes, cross-origin requests, console errors, or page errors. The landing
  page separately calls only the documented GitHub releases API.
- A real invalid-license check with sample food loaded sent one `GET` to the
  Sociobot verification endpoint. The token was the only request value; there
  was no body and no food data in the URL.
- The Sociobot verification endpoint allowed 30 requests from one client, then
  request 31 returned `429` with `Retry-After: 4`. A normal response was
  `200`, `Cache-Control: no-store`, and the documented invalid-license JSON.
- No sign-in exists, so Microsoft Entra External ID is not applicable.

## Accessibility, mobile, offline, and resilience

- Fresh live Axe scans at 1440×900 and 390×844 on `/`, `/demo`, `/app`,
  `/privacy`, `/terms`, and `/missing-page` found no serious or critical
  findings. Every route had `lang="en"`, one `h1`, and one `main`.
- Desktop and 390px mobile were visually inspected. There was no horizontal
  overflow and every visible mobile link/button measured at least 44×44 CSS
  pixels. Content remained available at 200% page scale in the browser suite.
- Keyboard-only use passed: Tab first reached the skip link, Enter moved focus
  to the heading, and the complete Tab/Enter path loaded sample data and
  exposed both export actions. Focus used a visible 3px amber outline.
- With reduced motion enabled, the largest computed animation or transition
  duration was 0.01 ms.
- The live service worker controlled the demo with cache
  `food-log-export-kit-v8`; after going offline, reload retained the named
  sample record and showed “You are offline.” The local update regression test
  also passed, replacing an old worker and stale shell.
- Normal live routes produced no console, page, or request errors. The designed
  missing route returned HTTP 404 and rendered the product-specific 404 page;
  Chromium logged only the expected failed-document 404 message.

## Headers, caching, metadata, and performance

- HTML is served with HSTS, CSP, `X-Content-Type-Options: nosniff`, strict
  referrer policy, and denied camera/microphone/geolocation. The CSP permits
  only self-hosted runtime assets plus the documented GitHub and Sociobot API
  connections.
- HTML uses `public, must-revalidate, max-age=30`; hashed JavaScript uses
  `public, max-age=31536000, immutable`.
- Live route titles, canonical links, description, Open Graph/Twitter card,
  theme color, image dimensions/alternatives, `robots.txt`, `sitemap.xml`,
  manifest, and real 404 route were present.
- Production output: main JS 39.70 kB raw / 14.10 kB gzip; CSS 23.48 kB raw /
  6.10 kB gzip. Lighthouse mobile transferred 87 KiB and scored performance
  97, accessibility 100, best practices 100, and SEO 100. Measured LCP was
  2.0 s, total blocking time 150 ms, and CLS 0.

## Scope and handoff

No product code, deployment, release, secrets, customer data, or external
service configuration was changed. Only this verification report and the
handoff status were added to the repository. Pre-existing `graphify-out/`
working-tree changes were preserved and excluded from the verification commit.
