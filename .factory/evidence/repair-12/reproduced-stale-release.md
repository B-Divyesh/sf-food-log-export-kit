# Repair 12 — reproduced stale release identity

Reproduced on 2026-09-01 UTC before repair changes. The requested failed
candidate and public GitHub state were:

```text
candidate=2d39958fc164f810f49d3ff3248ae36b92a5c8f6
origin_main=2d39958fc164f810f49d3ff3248ae36b92a5c8f6
latest_release=v0.1.10
release_target=85198e56d45478023d2e100ecc94d1a2500294a7
tag_commit=85198e56d45478023d2e100ecc94d1a2500294a7
```

Evidence sources:

- `git rev-parse HEAD` and `git ls-remote origin refs/heads/main`
- `GET https://api.github.com/repos/B-Divyesh/sf-food-log-export-kit/releases/latest`
- `git rev-parse v0.1.10^{}` after fetching the annotated tag

The API response was CORS-enabled (`access-control-allow-origin: *`) and named
11 assets, including both DMGs, MSI, setup EXE, AppImage, DEB, RPM,
`SHA256SUMS`, and `latest.json`. Those files belong to `85198e56…`, not the
failed candidate. The landing resolver therefore correctly retained its calm
release-page fallback instead of exposing a stale installer.

The focused pre-release test reproduced the mismatch as expected:

```text
expected latest tag v0.1.11; received v0.1.10
```

The root cause was release sequencing: `v0.1.10` was created from `85198e56…`,
then the final repair commit `2d39958f…` advanced `main` without a corresponding
desktop release.
