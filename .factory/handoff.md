# Handoff — review 6

## Result

Completed the requested read-only adversarial QA review. Product code was not changed. The review is FAIL and is recorded in .factory/review-6.md.

## Checks completed

- Opened the live site from fresh mobile 390 × 844 and desktop 1440 × 1000 browser contexts.
- Confirmed the first screen states the job, audience, and first action.
- Entered the one-click demo, confirmed 12 sample records, demo banner, reset, empty real workspace on exit, empty browser storage, and same-origin demo requests.
- Checked live routes, titles, descriptions, canonical and OG URLs, one h1 and main per page, header/footer, back-button heading focus, 404, robots, sitemap, favicon, social image, and live links.
- Ran live Axe checks on /, /demo, /app, /privacy, /terms, and an unknown route: no violations.
- Reviewed every earlier review, polish record, and the prior handoff; the review matrix records each earlier finding.
- Ran npm run build successfully. The initial JavaScript chunks total well below the static-site budget after gzip.
- Attempted all 23 commands listed in .factory/claims.json.

## Blocking result

Nineteen declared claim commands fail before their tagged check because the shared candidate-installers assertion compares current checkout 89753a7bd284c5dd359c965168402a00001b1c83 with published release target 12b6feb595b55aab9e7bd681b762678aba9e67ba. Four direct unit claim commands pass: verified-installer, windows-installer, static-hosting, and release-workflow.

The review also records unlisted README release-process claims and a stale copy-audit record.

## How to verify

    npm ci
    npm run build
    npm test -- --grep @claim:candidate-installers

The last command currently demonstrates the blocking release-identity mismatch. See .factory/review-6.md for the full command result table and concrete repair requirements.

## Known gaps and next steps

1. Publish a new commit-matched desktop release and matching website build.
2. Run every declared claim command after publishing; all must pass.
3. Add test-backed claims for README source-commit and preflight statements, or remove them.
4. Regenerate .factory/copy-audit.md from current page and README copy.

## Repository state

The pre-existing graphify-out generated-file changes were left untouched. This review adds only .factory/review-6.md and this handoff file.
