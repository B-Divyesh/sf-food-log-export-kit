# Handoff — adversarial first-read review 1

## Result

**FAIL.** This review made no product-code changes. The full report is in [`.factory/review-1.md`](review-1.md).

## What was done

- Reviewed the live site cold at 390 × 844 and 1440 × 900.
- Exercised the direct one-click demo, reset, exports, storage isolation, and exit to the real workspace.
- Read the brief, design thesis, claims manifest, README, prior handoff, and prior verification history.
- Ran every one of the 18 declared claim commands independently from a fresh clone after `npm ci`; all passed.
- Checked live routes, HTTP 404 behavior, headers, metadata, sitemap/robots, links, checkout redirect, routing focus, and earlier-finding repairs.

## Findings left

The release is blocked by:

1. The 390px demo's first viewport has no visible sample record; the first table row is below the fold.
2. Several visitor-facing claims are absent from `.factory/claims.json` and do not have their own tagged observable tests.

The report also records Back-focus, static-404 parity, plain-language, and README copy findings.

## Reproduce

```sh
git clone <repository> review
cd review
npm ci
npm test -- --grep @claim:csv-export
# Repeat with each exact command in .factory/claims.json.
```

For the live demo, open `https://food-log-export-kit.sociobot.in/demo` in a fresh 390px browser context. The current first table row begins below an 844px viewport.

## Repository state

Only `.factory/review-1.md` and this handoff were changed by this review. Existing unrelated `graphify-out/` working-tree changes were preserved.
