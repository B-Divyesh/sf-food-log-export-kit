# Round 7 release verification

Verified 2026-09-02 UTC.

- Candidate tag: `v0.1.17`
- Peeled source commit: `15156f04a39104211d95ff0e965712d9c4732333`
- GitHub release: <https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.17>
- GitHub Actions run: <https://github.com/B-Divyesh/sf-food-log-export-kit/actions/runs/33575608828>
- Release target: `15156f04a39104211d95ff0e965712d9c4732333`
- Deployment ID: `41b56e51-d93d-4c7e-abbf-b0062ce88d0a`
- Live identity: <https://food-log-export-kit.sociobot.in/release-identity.json>

All release jobs passed: Apple Silicon macOS, Intel macOS, Windows, Linux, and the final checksum/manifest verification job.

Published installable assets:

- `Food.Log.Export.Kit_0.1.17_aarch64.dmg`
- `Food.Log.Export.Kit_0.1.17_x64.dmg`
- `Food.Log.Export.Kit_0.1.17_x64_en-US.msi`
- `Food.Log.Export.Kit_0.1.17_x64-setup.exe`
- `Food.Log.Export.Kit_0.1.17_amd64.AppImage`
- `Food.Log.Export.Kit_0.1.17_amd64.deb`
- `Food.Log.Export.Kit-0.1.17-1.x86_64.rpm`
- `SHA256SUMS`
- `latest.json`

The independent verifier downloaded `Food.Log.Export.Kit_0.1.17_x64-setup.exe`. Its expected and measured SHA-256 were both:

```text
1e4a84759c04ef01887bb25716f91510e1722ec60d8a041c3d3f6aaa0ea9ac15
```

`latest.json`, `SHA256SUMS`, the release target, the peeled tag, and the deployed identity all name the same candidate commit. The cold Linux landing-page button resolved to the real `v0.1.17` AppImage with HTTP 200.
