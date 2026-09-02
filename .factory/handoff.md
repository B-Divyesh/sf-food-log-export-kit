# Handoff — repair 17

## Result

Release **v0.1.21** is published and deployed from immutable source commit
`c68cbed9be960ee9757db2b186a70642edf91054`.

- Tag: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.21>
- Release workflow: <https://github.com/B-Divyesh/sf-food-log-export-kit/actions/runs/33596310351>
- Live site: <https://food-log-export-kit.sociobot.in>
- Live release identity: version `0.1.21`, tag `v0.1.21`, source commit
  `c68cbed9be960ee9757db2b186a70642edf91054`.

The workflow built and published two macOS DMGs, a Windows MSI and setup EXE,
and Linux AppImage, DEB, and RPM. `SHA256SUMS`, `latest.json`, and
`build-info.json` are attached to the same release and name that same source
commit.

## Repair

The independent verifier's exact v0.1.20 failure was reproduced before the
repair:

```text
expected source_commit 133320e0830a501127a2d1150b9cfe3c2155a70a
received source_commit 6de278a9e1dc177c56b932ac8bf8edff4d36b728
```

That split caused `@claim:candidate-installers` and the Unix installer to
fail. The root cause was structural: the release workflow built a site artifact
from the tag but did not deploy it, allowing a later site commit to be deployed
separately.

Changes in `c68cbed`:

- bumped every release surface to `0.1.21`, including Tauri, Cargo, static 404,
  service-worker cache, README instructions, and copy audit;
- added the exact v0.1.20 provenance split to
  `@regression:verification-20` coverage;
- made the tagged workflow create and validate `build-info.json` with each
  installer URL, SHA-256, workflow run, and source commit;
- made the final tagged site job deploy its own tag-built `dist/site/` through
  the product-scoped Static Web Apps Actions secret;
- added tests that require the deployment step, build record, and current copy
  audit version.

The product-scoped GitHub Actions deployment secret
`AZURE_STATIC_WEB_APPS_API_TOKEN_FOOD_LOG_EXPORT_KIT` was configured from the
`sf-food-log-export-kit` Static Web App token. Its value was not logged.

## Verification

- Clean clone at `c68cbed…`: `npm ci`, `npm test`, `npm run build`, and
  `npm run build:app` all passed. `npm test` ran **43 unit tests** and **62
  Playwright tests**.
- Root checkout: `npm test` passed with the same 43 unit and 62 browser tests.
  This covers desktop and 390 px mobile, keyboard paths, Axe serious/critical
  checks, reduced motion, offline update, demo isolation, privacy boundaries,
  and all declared claims.
- `npm run test:unit -- --testNamePattern @claim:candidate-installers` passed
  against the public release. It checked the tag, release target, deployed
  identity, manifests, every installer URL, and a downloaded asset checksum.
- `npm run native:prereqs`, `cargo fmt --check`, locked `cargo test`, locked
  Clippy with `-D warnings`, and `CI=false npm run tauri -- build --no-bundle`
  passed after installing the documented local GTK/WebKit prerequisites. The
  release binary was built and an Xvfb launch smoke ran; only expected virtual
  display EGL acceleration warnings appeared.
- The live Unix installer completed with isolated temporary install paths and
  printed `Installed and verified Food.Log.Export.Kit_0.1.21_amd64.AppImage.`
  The Windows installer contract passed its PowerShell-compatible unit harness;
  no Windows host is available in this worker.
- Live mobile Lighthouse: **100** Performance, **100** Accessibility, **100**
  Best Practices, **100** SEO; LCP **1,174 ms**, CLS **0**, transfer **85,196
  bytes**.
- Live response checks confirmed 200, HSTS, CSP with the required GitHub and
  Sociobot connect sources, `nosniff`, strict referrer policy, and the
  camera/microphone/geolocation-denying permissions policy.

## Known gap / operator action

macOS and Windows packages are intentionally unsigned. Distribution signing
and macOS notarization still need the owner's `APPLE_CERTIFICATE` and
`WINDOWS_CERT_PFX` secrets; users must follow the platform's unsigned-app
opening flow until those are supplied.
