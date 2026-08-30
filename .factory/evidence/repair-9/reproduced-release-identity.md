# Repair 9 — reproduced release identity failure

Reproduced before product changes on 2026-08-30 UTC from report commit
`69689f3de189ed47a4c7a957f502c2f16599cce4`.

The candidate requested by verification 14 was
`d449a5c411d2ad0d139de19d4575d419ec09065c`. A fresh GitHub Release API
request and download of its `latest.json` returned:

```text
candidate=d449a5c411d2ad0d139de19d4575d419ec09065c
release_tag=v0.1.7
release_target=6f4bb7f207528aa36ed7e1a2e8f13ace474f4066
manifest_source=6f4bb7f207528aa36ed7e1a2e8f13ace474f4066
REPRODUCED: published installer release is not built from candidate
```

The comparison exited `42` by design when `release_target != candidate`.
Regression `@regression:V14-release-identity` now derives the expected commit
from the checkout instead of naming an older commit. The release claim cannot
pass until the corresponding tag, release, manifest, checksums, and assets all
identify that checked-out candidate.
