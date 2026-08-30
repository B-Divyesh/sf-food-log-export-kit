# Verification 13 — FAIL

**Candidate:** `6f4bb7f207528aa36ed7e1a2e8f13ace474f4066`  
**Live URL:** <https://food-log-export-kit.sociobot.in>  
**Verified:** 2026-08-30 UTC  
**Decision:** **FAIL — do not accept this desktop-app candidate.**

## Release blockers

### High — published desktop installers are not built from the candidate

The live static website is the candidate, but the desktop release it offers is
not. This breaks the desktop-app handoff contract: a visitor can install a
binary from a different source revision than the deployed product.

- Fresh `npm run build` output matched live `/`,
  `/assets/index-C-1B-j1h.js`, and `/assets/index-CZpZ9wnO.css` byte-for-byte
  (SHA-256 respectively `6c951199…cbd9`, `f6ebfaf5…e02`, and
  `7046a4ea…5d53`). The web deployment therefore does match candidate
  `6f4bb7f…`.
- The live GitHub release `v0.1.7` `latest.json` declares
  `source_commit` **`b39d3a283685b66fb25fbcb0f9b5bb9518aec143`**, not the
  candidate. That commit is an ancestor seven commits behind the candidate:
  `a6e5a24`, `1a202dc`, `fa1aded`, `ff7eb79`, `c992578`, `b409036`,
  `6f4bb7f`.
- The candidate's `src/release.ts` says a production build should withhold an
  installer when its source commit differs. The deployed JS is byte-identical
  to a local build with no `VITE_FOOD_LOG_SOURCE_COMMIT`, so that protection is
  absent on the live site and it still presents the old binary as “Download
  for Linux”.
- Release assets do exist for macOS arm64/x64, Windows MSI/EXE, and Linux
  AppImage/DEB/RPM. I downloaded
  `Food.Log.Export.Kit_0.1.7_x64_en-US.msi` and verified its SHA-256 against
  the published `SHA256SUMS` (`34867adba16f3fcd27497adc74fd1874ba44f284e15d75152fc2bf14792351b4`).
  Integrity is fine; identity is stale.

**Required resolution:** publish a new, correctly versioned/tagged installer
release built from `6f4bb7f…` (and set the live build's
`VITE_FOOD_LOG_SOURCE_COMMIT`), or deliberately make the landing page withhold
downloads until its release manifest targets the deployed commit.

### Medium — the documented native build command fails in this verifier CI

The README documents `npm run tauri build`. In this clean verifier environment
where `CI=1`, the exact command fails before compilation:

```
error: invalid value '1' for '--ci'
[possible values: true, false]
```

With `CI=true`, Tauri gets through the TypeScript/Vite frontend build, then
cannot complete here because the disposable container lacks system `glib-2.0`
development libraries. That missing native prerequisite is environment-specific
(the repository's GitHub Actions workflow installs WebKit/GTK dependencies),
but the `CI=1` parsing failure is a portability defect in the documented local
command. The normal static production build does pass.

## Required claims first

`.factory/claims.json` exists and contains 22 claims. From a clean detached
clone of the candidate after `npm ci`, I ran every exact command in the
manifest, individually, through the supplied demo/product entry points. All
22 exited 0:

`csv-export`, `json-archive`, `local-only`, `format-import`,
`explained-drops`, `lossy-fields`, `validation-notes`, `batch-import`,
`license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`,
`privacy-no-account`, `free-behavior`, `normalized-types`, `revoked-license`,
`detected-platform-downloads`, `verified-installer`, `windows-installer`,
`license-request-data-boundary`, `static-hosting`, and `release-workflow`.

The captured run log is `/tmp/food-log-export-kit-claims.log` in the verifier
container. The initial attempt before installing dependencies in the isolated
clone stopped at `vitest: not found`; it was discarded and rerun successfully
after `npm ci` in that clone.

## Cold first read

**Pass.** A cold live desktop visit gave the title “Food Log Export Kit — Save
your food history” and one H1, “Save your food history.” Its first screen says
it is “For food tracker users who need years of meals and recipes in files they
control,” and presents **Try it with sample data** alongside “Review 12 sample
entries, then download a CSV and JSON archive.” This states what it does, for
whom, and what to click first in plain words. The one-click demo exists.

## Automated quality gates

All commands below ran from the clean candidate clone.

| Check | Result / evidence |
| --- | --- |
| `npm ci` | Passed; 67 packages, 0 reported vulnerabilities. |
| `npm test` | Passed: 24/24 Vitest; Playwright 50 passed, with 4 desktop-filtered mobile checks skipped and their mobile equivalents passed. It covers keyboard, Axe, privacy, claims, PWA update, and offline reload. |
| `npm run build` | Passed (`tsc --noEmit`, Vite); produced `dist/site/`. |
| `npm run build:app` | Passed (`tsc --noEmit`, Vite); produced `dist/app/`. |
| `npm run tauri build` | Failed as described in the Medium finding. |
| Production web budget | JS 49,019 bytes / **16,997 bytes gzip**; CSS **6,090 bytes gzip**; mobile hero 14,420 bytes. All are within stated budgets. |

## End-to-end and live checks

- Representative imports, delimiter/JSON formats, meals/recipes/nutrition/
  weights, CSV and portable JSON exports, loss notes, boundary numbers/dates,
  paid batch selection, license restore/revocation, and free one-file behavior
  are asserted by the passing claim suite.
- Independently on live `/demo`, the 12-entry sample rendered (11 meals,
  0 recipes, 1 weight, 4 days) and exported CSV. Its request log contained
  only same-origin URLs. No food data was sent cross-origin.
- Independently on live `/app`, an unusable CSV showed “The file could not be
  imported” with the missing-heading explanation; choosing a valid replacement
  immediately recovered to the normalized `Recovery soup` record. No console
  errors occurred.
- Keyboard-only live smoke: Enter on **Load sample data** populated 12 entries;
  Enter on the focused **Export CSV** button downloaded `food-log.csv`.
- Live `/demo` installed controller `https://food-log-export-kit.sociobot.in/sw.js`;
  after first load, an offline reload kept the sample record visible, showed
  “You are offline,” and produced no page errors. The passing local suite also
  exercised the controlled stale-worker update path.
- Live desktop Axe scans of `/`, `/demo`, and `/app` had **0 serious/critical**
  violations. The full local suite also scanned `/privacy`, `/terms`, and 404
  in desktop and mobile projects.
- At 390×844 live `/demo`, `scrollWidth` equalled `clientWidth` (390); no
  visible interactive target was under 44 px (the sole 1×1 element was the
  intentionally visually-hidden file input). Tab focus reached the skip link
  with `rgb(239, 184, 90) solid 3px`; reduced motion reported only `0.00001s`
  transitions. No console errors occurred.
- The unauthenticated product has no sign-in flow, so Entra tenant validation
  is not applicable.

## Privacy, headers, and request allowance

- Cold landing requests were same-origin assets plus the declared GitHub
  release-metadata request. Demo conversion/export used only same-origin
  requests. Remote scripts, analytics, cookies, and account fields were absent
  in the passing privacy claim.
- Live HTML and asset responses supplied HSTS, `X-Content-Type-Options:
  nosniff`, `strict-origin-when-cross-origin`, camera/microphone/geolocation
  denial, and a restrictive CSP with `frame-ancestors 'none'`. Hashed JS uses
  `public, max-age=31536000, immutable`; HTML and `sw.js` use short
  revalidation (`max-age=30`).
- Fresh live Sociobot verification probe using one harmless invalid token:
  requests **1–30** returned `200` with only the invalid-license JSON;
  request **31** returned **`429`** with **`Retry-After: 4`**. Observed
  allowance: **30 requests per client window**. The live checkout claim also
  passed, requiring the public Sociobot endpoint to return a 303 to a Dodo
  hosted checkout session.

## Scope and handoff

No product code was modified. The supplied worktree already had unrelated
modified `graphify-out/` files; they were left untouched. This report and the
handoff update are the only verifier changes.
