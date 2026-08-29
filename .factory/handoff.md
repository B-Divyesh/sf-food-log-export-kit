# Handoff — adversarial review 4

## Result

**FAIL.** Review 4 found one blocking claims-inventory defect and one medium
walkthrough-accuracy defect. No product code was changed.

The full report is in [review-4.md](review-4.md).

## Findings left for repair

- **F-4-1 — BLOCKING:** “See every row before you export” is absent from
  `.factory/claims.json`. Add one exact manifest claim and one tagged row-
  reconciliation test, or narrow the heading to an existing tested claim.
- **F-4-2 — MEDIUM:** `public/screens/03-export.webp` does not contain the
  filled table or CSV/JSON buttons named by its alt text. Recapture the current
  app at the actual export state and confirm all walkthrough frames use the
  current navigation.

## Verification performed

- Opened the live site cold at 390 × 844 and 1440 × 900.
- Entered the one-click demo, checked the first viewport, Reset, Start for real,
  storage isolation, request origins, cookies, console errors, and offline
  reload.
- Created clean clone `/tmp/food-log-review4.1IPPgx`, ran `npm ci`, and ran all
  20 exact `.factory/claims.json` commands independently; all passed.
- Ran `npm test`: 21 unit tests and 48 browser tests passed, with four
  intentional cross-project skips.
- Ran `npm run build` and `npm run build:app`; both passed. Largest initial JS
  chunk: 38.69 kB raw / 13.67 kB gzip.
- Ran live desktop and mobile axe checks on `/`, `/demo`, `/app`, `/privacy`,
  `/terms`, and the HTTP 404; zero WCAG 2 A/AA violations were reported.
- Ran `/opt/fleet/lib/verify-url.sh` on every 200 route; title, language, one
  heading, main landmark, image alternatives, button names, and console checks
  passed.
- Crawled all live destinations, checked metadata and response headers, tested
  Back focus, and reverified every finding from reviews 1–3 in live behavior and
  source.
- Imported a live CSV with an unmapped `Fiber` field and confirmed its named
  conversion note and preserved JSON value without a remote food-data request.

## Repository state

Only `.factory/review-4.md` and this handoff were intentionally changed. The
pre-existing modified `graphify-out/` files were left untouched. The reviewed
candidate was `b54087fbbc2161262e66d752978ae4f59fae7ef5`.

## Next step

Repair F-4-1 and F-4-2, then repeat the claim, visual, and full build gates. Do
not mark the product accepted until a new review has zero findings.
