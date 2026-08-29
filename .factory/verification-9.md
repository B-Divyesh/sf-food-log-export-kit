# Independent verification 9 — PASS

**Candidate:** `925af4dd15e6cf9e44d0274299a826f53398337c` (`main`)  
**Live URL:** <https://food-log-export-kit.sociobot.in>  
**Verified:** 2026-08-29 UTC

## Verdict

**PASS.** The candidate meets the researched brief: it is a local-first exit
and preservation tool for food-tracker users, imports CSV/JSON exports,
normalizes them with explained loss, and produces CSV plus portable JSON.
No release-blocking defect was found.

The deployed release is `v0.1.5`, whose release source is ancestor
`2c10f3df607fe7c2c8988d3128aeebcdee5f35a8`. Candidate `925af4d` differs from
that source only in factory evidence/handoff material (and unrelated generated
graph metadata), not product files. A clean candidate build's
`index-Dza6e8mx.js` exactly matches the live asset:

```
f1ec7fda6bddbbd0d64644ffb78a40ce2e38b6085de6e06438fbe460294e123c
```

## Required first read

Opened the live landing page in a fresh desktop browser context. It says:

- **What:** “Save your food history”; it turns tracker exports into CSV and
  JSON archives.
- **For whom:** food tracker users needing years of meals and recipes in files
  they control.
- **First action:** visible, one-click **Try it with sample data**, with the
  immediate outcome (“Review 12 sample entries, then download a CSV and JSON
  archive”).

The first screen also gives three plain facts: no uploads/on-device conversion,
no account, and free one-file import with a $19 one-time batch license. This
passes the plain-words and demo-sandbox gate.

## Clean-clone claims and automated checks

`npm ci` completed with 0 audit vulnerabilities. `.factory/claims.json` exists
and contains 20 claims. Every manifest command was run independently and
passed from the demo/product entry points:

| Claims | Result |
| --- | --- |
| `csv-export`, `json-archive`, `local-only`, `format-import`, `explained-drops`, `lossy-fields`, `validation-notes` | PASS |
| `batch-import`, `license-restore`, `paid-purchase`, `offline-reload`, `demo-discard`, `privacy-no-account`, `free-behavior` | PASS |
| `normalized-types`, `revoked-license`, `detected-platform-downloads`, `license-request-data-boundary` | PASS |
| `verified-installer` (`npm run test:unit -- --testNamePattern @claim:verified-installer`) | PASS |
| `windows-installer` (`npm run test:unit -- --testNamePattern @claim:windows-installer`) | PASS |

The initially attempted batch invocation left overlapping local Playwright web
servers, which caused a port-4173 harness collision; it was discarded. The
table records the subsequent clean serial executions only.

Additional fresh checks:

- `npm test`: **21/21 Vitest tests** and **52/52 Playwright tests** passed.
- `npm run build` and `npm run build:app` passed. `npm audit --audit-level=high`
  found 0 vulnerabilities.
- Initial JS gzip: **13,694 B**; CSS gzip: **6,103 B**, within the static
  performance budgets.
- `cargo fmt --manifest-path src-tauri/Cargo.toml -- --check`,
  `cargo test --locked --manifest-path src-tauri/Cargo.toml`, and
  `cargo clippy --locked --manifest-path src-tauri/Cargo.toml -- -D warnings`
  passed after installing the normal GTK/WebKit development dependencies
  required by Tauri on this Linux runner.

## End-to-end live evidence

In a fresh live `/demo` context, the app showed the persistent “Demo — sample
data, nothing is saved” banner, loaded 12 realistic records, and downloaded
both formats. There were **zero requests during the demo export flow** and no
localStorage keys. After service-worker control, offline reload retained the
named sample record and displayed “You are offline.”

On `/app`, an invalid CSV produced the actionable alert “No food or weight
column was found…”, then replacement with a normal one-row CSV recovered to a
visible `Tomato soup` row (180 kcal). The claim suite additionally covers
comma/semicolon/tab CSV, JSON lists, bad rows, dates/numbers, unknown fields,
licensed batch import, restore/revocation, and free exports.

The published Linux `.deb` was downloaded independently. Its SHA-256 was
`4235bf061f1142e89ec18c6bc3246cef8d7f223e47b3e5e037c1e8136a17c6a2`, exactly
matching release `SHA256SUMS`; package metadata is
`food-log-export-kit`, `0.1.5`, `amd64`.

## Privacy, security, accessibility, and deployment

- Cold landing requests were only same-origin assets plus the disclosed public
  GitHub release API. The demo conversion/export flow sent no requests at all.
  No tracking/account UI, cookies, or remote scripts appeared.
- Live desktop and 390px mobile checks had one `<h1>`, correct title, no
  horizontal overflow, zero console/page errors, and **zero axe serious or
  critical findings**. Keyboard Tab first reaches the skip link with a visible
  `rgb(239, 184, 90) solid 3px` focus ring. Reduced motion reports a
  `0.00001s` transition/animation duration.
- `/`, `/demo`, `/app`, `/privacy`, and `/terms` return 200. An unknown route
  returns a styled 404 with HTTP 404. `/privacy` and `/terms` are linked.
- Response headers include HSTS, `nosniff`, strict-origin referrer policy,
  restrictive CSP with `frame-ancestors 'none'`, and denied camera/microphone/
  geolocation. HTML/service worker revalidate in 30 seconds; hashed JS is
  immutable for one year.
- The license verification boundary sent only the token (claim-tested). Fresh
  rate testing from one client: requests 1–30 returned 200; requests 31–35
  returned **429** with `Retry-After: 4` and `X-RateLimit-After: 4`. Observed
  allowance: **30 requests per client window**. A successful response had
  `Cache-Control: no-store` and CORS restricted to this product origin.

## Defects by severity

None found: **critical 0, high 0, medium 0, low 0**.

## Remaining operational note

Published desktop installers are intentionally unsigned; this is disclosed in
the existing handoff and requires operator signing/notarization certificates.
It is not a functional or integrity defect because the release provides and
verifies SHA-256 checksums.
