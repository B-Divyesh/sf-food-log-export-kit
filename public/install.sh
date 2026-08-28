#!/bin/sh
set -eu

repo="B-Divyesh/sf-food-log-export-kit"
release_page="https://github.com/$repo/releases/latest"
api="${FOOD_LOG_RELEASE_API_URL:-https://api.github.com/repos/$repo/releases/latest}"

fail() {
  echo "$1" >&2
  exit 1
}

command -v curl >/dev/null 2>&1 || fail "curl is required to install Food Log Export Kit."

os="$(uname -s)"
arch="$(uname -m)"
case "$os:$arch" in
  Linux:x86_64|Linux:amd64)
    asset_pattern='_amd64\.AppImage$'
    install_kind='appimage'
    ;;
  Darwin:arm64|Darwin:aarch64)
    asset_pattern='_aarch64\.app\.tar\.gz$'
    install_kind='mac-app'
    ;;
  Darwin:x86_64|Darwin:amd64)
    asset_pattern='_x64\.app\.tar\.gz$'
    install_kind='mac-app'
    ;;
  Darwin:*) fail "This Mac architecture ($arch) is not supported. See $release_page" ;;
  Linux:*) fail "This Linux architecture ($arch) is not supported. See $release_page" ;;
  *) fail "Use install.ps1 on Windows. See $release_page" ;;
esac

release_json="$(curl -fsSL "$api")" || fail "Release details could not be loaded. See $release_page"

# GitHub formats JSON with spaces around the colon. Keep this parser portable for
# stock macOS and Linux systems, where jq is not guaranteed to be installed.
asset_urls="$(printf '%s\n' "$release_json" | tr ',' '\n' | sed -n 's/.*"browser_download_url"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')"
asset_url="$(printf '%s\n' "$asset_urls" | grep -E "$asset_pattern" | head -n 1 || true)"
sums_url="$(printf '%s\n' "$asset_urls" | grep -E '/SHA256SUMS$' | head -n 1 || true)"
[ -n "$asset_url" ] && [ -n "$sums_url" ] || fail "A download for $os $arch is not published yet. See $release_page"

archive_name="${asset_url##*/}"
work_dir="$(mktemp -d "${TMPDIR:-/tmp}/food-log-export-kit.XXXXXX")"
trap 'rm -rf "$work_dir"' EXIT HUP INT TERM
archive_path="$work_dir/$archive_name"
sums_path="$work_dir/SHA256SUMS"

curl -fL "$asset_url" -o "$archive_path"
curl -fsSL "$sums_url" -o "$sums_path"
expected="$(awk -v name="$archive_name" '$2 == name {print tolower($1); exit}' "$sums_path")"
[ -n "$expected" ] || fail "SHA256SUMS has no entry for $archive_name."
if command -v sha256sum >/dev/null 2>&1; then
  actual="$(sha256sum "$archive_path" | awk '{print tolower($1)}')"
elif command -v shasum >/dev/null 2>&1; then
  actual="$(shasum -a 256 "$archive_path" | awk '{print tolower($1)}')"
else
  fail "sha256sum or shasum is required to verify the download."
fi
[ "$expected" = "$actual" ] || fail "Checksum failed for $archive_name."

choose_bin_dir() {
  if [ -n "${FOOD_LOG_INSTALL_DIR:-}" ]; then
    printf '%s\n' "$FOOD_LOG_INSTALL_DIR"
    return
  fi
  old_ifs="$IFS"
  IFS=':'
  for candidate in $PATH; do
    [ -n "$candidate" ] || continue
    case "$candidate" in
      "$HOME"/*)
        if [ -d "$candidate" ] && [ -w "$candidate" ]; then
          printf '%s\n' "$candidate"
          IFS="$old_ifs"
          return
        fi
        ;;
    esac
  done
  IFS="$old_ifs"
  if [ -d /usr/local/bin ] && [ -w /usr/local/bin ]; then
    printf '%s\n' /usr/local/bin
  else
    printf '%s\n' "$HOME/.local/bin"
  fi
}

bin_dir="$(choose_bin_dir)"
mkdir -p "$bin_dir"
launcher="$bin_dir/food-log-export-kit"

if [ "$install_kind" = 'appimage' ]; then
  app_dir="${FOOD_LOG_APP_DIR:-$HOME/.local/lib/food-log-export-kit}"
  mkdir -p "$app_dir"
  appimage_target="$app_dir/Food.Log.Export.Kit.AppImage"
  cp "$archive_path" "$appimage_target"
  chmod 755 "$appimage_target"
  printf '#!/bin/sh\nAPPIMAGE_EXTRACT_AND_RUN=1 exec "%s" "$@"\n' "$appimage_target" > "$launcher"
  chmod 755 "$launcher"
else
  command -v tar >/dev/null 2>&1 || fail "tar is required to install the macOS app."
  app_dir="${FOOD_LOG_APP_DIR:-$HOME/Applications}"
  mkdir -p "$app_dir"
  tar -xzf "$archive_path" -C "$work_dir"
  extracted_app="$work_dir/Food Log Export Kit.app"
  [ -x "$extracted_app/Contents/MacOS/food-log-export-kit" ] || fail "The macOS app archive is incomplete."
  target_app="$app_dir/Food Log Export Kit.app"
  if [ -e "$target_app" ]; then
    rm -rf "$target_app"
  fi
  mv "$extracted_app" "$target_app"
  ln -sf "$target_app/Contents/MacOS/food-log-export-kit" "$launcher"
fi

case ":$PATH:" in
  *":$bin_dir:"*) path_note="Run food-log-export-kit to open it." ;;
  *)
    if [ "$bin_dir" = "$HOME/.local/bin" ]; then
      profile="${FOOD_LOG_PROFILE:-$HOME/.profile}"
      path_line='export PATH="$HOME/.local/bin:$PATH"'
      if [ ! -f "$profile" ] || ! grep -F "$path_line" "$profile" >/dev/null 2>&1; then
        printf '\n%s\n' "$path_line" >> "$profile"
      fi
      path_note="Added $bin_dir to PATH in $profile. Open a new shell, then run food-log-export-kit."
    else
      path_note="Add $bin_dir to PATH, then run food-log-export-kit."
    fi
    ;;
esac

echo "Installed and verified $archive_name."
echo "Launcher: $launcher"
echo "$path_note"
