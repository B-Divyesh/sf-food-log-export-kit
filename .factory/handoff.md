# Handoff — repair 12

## Result

Food Log Export Kit remains a Tauri 2 desktop app with a static landing site.
Repair 12 publishes version `0.1.11` from the final repair commit under tag
`v0.1.11`, then deploys that commit's `dist/site/` only to the allowed
`sf-food-log-export-kit` static resource.

## Reproduced failure and root cause

The failed checkout was exactly
`2d39958fc164f810f49d3ff3248ae36b92a5c8f6`, matching `origin/main`. A fresh
request to GitHub's CORS-enabled Releases API returned `v0.1.10` with
`target_commitish` `85198e56d45478023d2e100ecc94d1a2500294a7`. The annotated
`v0.1.10` tag peeled to that same older commit. The release contained the full
installer matrix, but none of those files belonged to the failed candidate.
The exact reproduction is in
`.factory/evidence/repair-12/reproduced-stale-release.md`.

The prior workflow was run before the final repair bookkeeping commit. That
advanced `main` after the version's tag and release existed. The landing page's
identity check did its safety job and withheld the older installers.

## Repair

- Version `0.1.11` is aligned in npm, Cargo, Tauri, the landing page, fixtures,
  and static 404 page.
- A tag-push release now verifies that the tagged commit is also the current
  default-branch tip. Manual rebuilds of an existing tag remain supported.
- Release jobs still build Intel and Apple Silicon macOS, Windows, and Linux
  packages. The checksum job publishes and validates `SHA256SUMS` and
  `latest.json`, then verifies the release target and peeled tag commit.
- The landing resolver requests only
  `https://api.github.com/repos/B-Divyesh/sf-food-log-export-kit/releases/latest`.
  It caches a matching result for one hour. A missing release, rate limit,
  rejected request, malformed response, stale response, or unavailable browser
  storage keeps a calm link to the GitHub Releases page without an uncaught
  error.
- `@regression:R12-release-absence` covers missing, rate-limited, malformed,
  stale, and offline metadata plus malformed storage on desktop and mobile.
  `@regression:R12-release-cache` covers the one-hour cache. The release
  workflow test covers the tag-at-default-branch invariant.

No food-data handling, billing behavior, visual system, analytics, or runtime
AI feature changed.

## Local verification

The disposable worker started without `node_modules` or Linux GUI headers.
`npm ci` installed 66 packages with zero reported vulnerabilities. The
documented GTK/WebKit packages were installed as root because this image does
not contain `sudo`.

Passed before release:

```sh
npx vitest run --exclude tests/unit/published-release.test.ts
# 32 passed

npx playwright test
# 58 passed; 4 expected desktop-project skips

npm run build:site
npm run build:app
cargo test --manifest-path src-tauri/Cargo.toml
CI=1 npm run tauri -- build
```

The exact original native command produced:

- `Food Log Export Kit_0.1.11_amd64.deb`
- `Food Log Export Kit-0.1.11-1.x86_64.rpm`
- `Food Log Export Kit_0.1.11_amd64.AppImage`

The site build contains 50,093 bytes of uncompressed initial JavaScript across
four chunks, 23,482 bytes of CSS, and a 14,420-byte mobile hero image. Vite
reported 17.36 kB total JavaScript gzip and 6.10 kB CSS gzip.

The browser matrix covers Chromium desktop and 390 px mobile, keyboard
operation, focus state, serious and critical Axe findings, 200% zoom, 44 px
targets, reduced motion, offline reload, service-worker update, demo storage
isolation, local-only conversion, billing request privacy, and CSV/JSON export.

After the tagged GitHub workflow completes, the final gate is:

```sh
npm test
```

This includes `@claim:candidate-installers`, which independently reads the
public latest Release API, peels the tag, checks the manifest and every URL,
and downloads the smallest installer to verify its published SHA-256. Every
exact command in `.factory/claims.json` is also run from this final checkout.

## Release and deployment evidence

Canonical release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.11>

Required published files are two DMGs, MSI, setup EXE, AppImage, DEB, RPM,
`SHA256SUMS`, and `latest.json`. The release, peeled tag, checksum provenance
line, manifest `source_commit`, deployed `release-identity.json`, and local
`HEAD` must all resolve to the same commit.

The clean site build and repository deployment command are:

```sh
npm run build:site
/opt/fleet/lib/deploy-static.sh food-log-export-kit dist/site
```

Post-deploy checks cover `/`, `/demo`, `/app`, `/privacy`, and `/terms` with
`/opt/fleet/lib/verify-url.sh`; the real 404; live Axe; offline reload; the
GitHub API-selected platform link; static asset budgets; live release identity;
and a direct installer checksum. No infrastructure, DNS, billing, database,
key vault, or unrelated service is read or changed.

## Known gap and operator action

macOS and Windows desktop builds are unsigned. Signing requires the
owner-managed `APPLE_CERTIFICATE` and `WINDOWS_CERT_PFX` GitHub Actions secrets.
The app adds no food-data server, account service, analytics, or telemetry.
