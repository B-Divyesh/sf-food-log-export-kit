# Verification 15 — PASS

- **Candidate:** `12b6feb595b55aab9e7bd681b762678aba9e67ba`
- **Live URL:** <https://food-log-export-kit.sociobot.in>
- **Verified:** 2026-09-01 UTC

**Decision:** **PASS — accept this desktop-app candidate.**

## Release result and severity summary

The checked live release is the requested candidate. Live
`/release-identity.json` reports version `0.1.12`, tag `v0.1.12`, and source
commit `12b6feb595b55aab9e7bd681b762678aba9e67ba`. The exact
`@claim:candidate-installers` check passed: it binds the published installer
manifest, checksums, links, and a downloaded installer checksum to this
checkout.

| Severity | Findings |
| --- | --- |
| Critical | None |
| High | None |
| Medium | None |
| Low | None |
| Informational | Native Rust checks require documented GLib/WebKit development packages that are not present in this disposable verifier container. |

The informational environment note is not a product defect. `npm run
native:prereqs` gives the documented package list, while the required site and
app frontend builds complete successfully. No package installation was done.

## Required claims and cold first read

`.factory/claims.json` exists and declares 23 checks. From a clean detached
checkout of the candidate, after `npm ci` (66 packages added; 0 reported
vulnerabilities), every exact declared command passed individually:

`csv-export`, `json-archive`, `local-only`, `format-import`,
`explained-drops`, `lossy-fields`, `validation-notes`, `batch-import`,
`license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`,
`privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`,
`detected-platform-downloads`, `verified-installer`, `windows-installer`,
`license-request-data-boundary`, `static-hosting`, `release-workflow`, and
`candidate-installers`.

The cold live first read passes. The page says **Save your food history**,
names food-tracker users with years of meals and recipes as its audience, and
shows **Try it with sample data** with the plain result: review 12 entries,
then download CSV and JSON. One click opens the populated demo.

## Build and automated checks

| Check | Fresh result |
| --- | --- |
| `npm test` | Passed. The command completed before the following `&& npm run build` step began; it covers 35 Vitest checks and 62 Playwright checks. |
| `npm run build` | Passed TypeScript and Vite; generated `dist/site/`. |
| `npm run build:app` | Passed TypeScript and Vite; generated `dist/app/`. |
| `cargo test --manifest-path src-tauri/Cargo.toml` | Could not start because `glib-2.0` is absent. `npm run native:prereqs` additionally reports absent `webkit2gtk-4.1`; both are documented host prerequisites. |
| Lint/type checks | No separate lint command is declared; TypeScript type checking is included in both build commands. |

The production build emitted 39.70 kB JavaScript in its largest chunk (14.11
kB gzip; 17.37 kB gzip across the four JS chunks) and 23.48 kB CSS (6.10 kB
gzip). These are within the applicable 200 kB JS and 50 kB CSS budgets. The
checked mobile hero is 14,420 bytes, within the 300 kB budget.

## Product, accessibility, and PWA checks

- The live demo has its persistent **Demo — sample data, nothing is saved**
  banner. It loaded 12 entries, downloaded `food-log.csv` and
  `food-log-archive.json`, reset back to the sample, and **Start for real**
  opened the empty `/app` import workspace. The demo request log during this
  flow contained same-origin product requests only; it had no page or console
  errors.
- The repository's full suite covers normal imports, delimiters, JSON lists,
  invalid input, boundary values, conversion notes, free and licensed flows,
  recovery, service-worker replacement, and offline reload. The individual
  claim checks above exercised these outcomes through the demo/product entry
  points.
- Independent Axe scans on live `/`, `/demo`, `/app`, `/privacy`, and `/terms`
  found zero serious or critical findings. Each response has one H1 and one
  `main`; the live titles and `lang="en"` are present.
- At 390 x 844, `/demo` had no horizontal overflow and the named sample record
  appeared in the first viewport. Keyboard traversal began at the skip link;
  the keyboard test loads sample data with Enter and reaches CSV export.
  Reduced-motion mode sets document scrolling to `auto`; the full suite checks
  every visible transition/animation duration is at most 0.01 s.
- The live service worker is active and controls the product scope. With the
  network disabled after first load, `/demo` reloaded with all 12 records and
  no page or console errors. The full suite includes the controlled old-worker
  update check.

## Privacy, headers, caching, and service boundary

- The sample conversion and export flow makes same-origin product requests
  only. The landing page separately requests the documented GitHub release
  metadata endpoint to resolve installer links. No account sign-in is offered,
  so an external identity-provider check is not applicable.
- There is no product-owned server API in this static deployment. The only
  product runtime service call is documented license verification; the claim
  test confirms it sends only the license token. Therefore a product API
  request allowance and `429`/`Retry-After` check are not applicable here.
- Root responses include HSTS, `X-Content-Type-Options: nosniff`, strict-origin
  referrer policy, denied camera/microphone/geolocation permissions, and the
  declared restrictive CSP. HTML and the service worker use a 30-second
  revalidation cache policy; hashed JavaScript uses
  `public, max-age=31536000, immutable`.
- A nonexistent route returns HTTP 404 with HTML content. The checked routes
  produced no page errors or console errors.

## Scope

No product source, deployment settings, secrets, data, or external services
were changed. This verification updates only this report and the required
handoff. Existing `graphify-out/` workspace changes were left untouched.
