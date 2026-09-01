# Repair 13 — stale release reproduction

Reproduced on 2026-09-01 UTC from the failed candidate
`269ff71a28d5ee9dd08bc91499a138a7aa5da2f5`.

```sh
git rev-parse HEAD v0.1.11^{commit}
curl --fail --silent --show-error \
  -H 'Accept: application/vnd.github+json' \
  https://api.github.com/repos/B-Divyesh/sf-food-log-export-kit/releases/latest
```

The candidate resolved to
`269ff71a28d5ee9dd08bc91499a138a7aa5da2f5`. The `v0.1.11` tag and the live
GitHub Release API both resolved to
`21758acb519c129ff8d4eba66167940b3ad93562`. The release included two DMGs,
MSI, setup EXE, AppImage, DEB, RPM, `SHA256SUMS`, and `latest.json`, but all
were built from that older commit.

This reproduces the failed desktop candidate: the site correctly withholds an
installer whose manifest identity differs from its build identity, but a
visitor cannot obtain a current desktop package. The cause was creating a
release tag before all candidate bookkeeping commits were finalized; the old
site-build override also allowed a supplied identity to differ from `HEAD`.

Repair 13 requires a clean, pushed `main` tip and an unused version tag before
release. It also rejects any supplied `VITE_FOOD_LOG_SOURCE_COMMIT` that is
not exactly the checked-out commit.
