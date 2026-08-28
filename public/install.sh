#!/bin/sh
set -eu
repo="B-Divyesh/sf-food-log-export-kit"
case "$(uname -s)" in
  Darwin) pattern='\.dmg$' ;;
  Linux) pattern='\.AppImage$' ;;
  *) echo "Use install.ps1 on Windows." >&2; exit 1 ;;
esac
api="https://api.github.com/repos/$repo/releases/latest"
release_json="$(curl -fsSL "$api")"
asset_url="$(printf '%s' "$release_json" | tr ',' '\n' | sed -n 's/.*"browser_download_url":"\([^"]*\)".*/\1/p' | grep -E "$pattern" | head -n 1)"
sums_url="$(printf '%s' "$release_json" | tr ',' '\n' | sed -n 's/.*"browser_download_url":"\([^"]*SHA256SUMS\)".*/\1/p' | head -n 1)"
[ -n "$asset_url" ] && [ -n "$sums_url" ] || { echo "Desktop downloads are still being published." >&2; exit 1; }
file="${asset_url##*/}"
curl -fL "$asset_url" -o "$file"
expected="$(curl -fsSL "$sums_url" | awk -v name="$file" '$2 == name {print $1}')"
actual="$(sha256sum "$file" 2>/dev/null | awk '{print $1}' || shasum -a 256 "$file" | awk '{print $1}')"
[ "$expected" = "$actual" ] || { echo "Checksum failed for $file" >&2; exit 1; }
echo "Downloaded and verified $file in $(pwd). Open it to install Food Log Export Kit."
