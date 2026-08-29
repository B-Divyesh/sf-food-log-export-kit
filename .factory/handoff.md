# Handoff — adversarial first-read review 3

## Result

**FAIL with six minor findings and no blocking findings.** The full report is in `.factory/review-3.md`. Product code was not modified.

## What was done

- Audited the live landing page cold at 390 × 844 and 1440 × 900.
- Exercised the one-click demo, Reset, Start for real, storage isolation, same-origin request boundary, downloads, and live offline reload.
- Ran all 20 exact claim commands independently from a clean clone; all passed.
- Ran `npm test`, `npm run build`, and `npm run build:app` from the clean clone; all passed.
- Checked every earlier review finding against the live site and current code/tests; all remain fixed.
- Crawled links and checked route status, metadata, 404 behavior, History API focus, responsive layout, console output, and visual identity.
- Ran `/opt/fleet/lib/verify-url.sh` on `/` and `/demo` and live Playwright axe scans on all routes at mobile and desktop sizes; all passed.

## Findings left

- F-3-1: “Read the notes” is context-dependent.
- F-3-2: “Save both formats” does not name CSV and JSON.
- F-3-3: “normalized” is unexplained landing-page jargon.
- F-3-4: “checksum” is unexplained README jargon.
- F-3-5: “PATH” is unexplained README jargon.
- F-3-6: release-notes instructions do not link to release notes.

## Verification

```sh
npm ci
npm test
npm run build
npm run build:app
```

Open <https://food-log-export-kit.sociobot.in/demo> for the isolated sample flow. See `.factory/review-3.md` for the exact claim results, copy inventory, live evidence, rewrites, and prior-finding matrix.
