export interface ReleaseAsset {
  name: string;
  browser_download_url: string;
}

export interface ReleaseDetails {
  tag_name?: string;
  target_commitish?: string;
  html_url: string;
  assets: ReleaseAsset[];
}

interface CachedRelease {
  saved: number;
  release: ReleaseDetails;
}

export const releaseApiUrl = 'https://api.github.com/repos/B-Divyesh/sf-food-log-export-kit/releases/latest';
export const releasePageUrl = 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases';
const releaseCacheKey = 'release:food-log-export-kit';
const releaseCacheLifetimeMs = 3_600_000;

export type DesktopPlatform = 'macOS' | 'Windows' | 'Linux';
export type MacArchitecture = 'arm64' | 'x64' | 'unknown';

export function detectDesktopPlatform(userAgent: string): DesktopPlatform {
  if (/Mac/i.test(userAgent)) return 'macOS';
  if (/Windows/i.test(userAgent)) return 'Windows';
  return 'Linux';
}

export async function detectMacArchitecture(): Promise<MacArchitecture> {
  if (!/Mac/i.test(navigator.userAgent)) return 'unknown';
  const userAgentData = (navigator as Navigator & {
    userAgentData?: { getHighEntropyValues?: (hints: string[]) => Promise<{ architecture?: string }> };
  }).userAgentData;
  try {
    const value = await userAgentData?.getHighEntropyValues?.(['architecture']);
    if (/arm/i.test(value?.architecture ?? '')) return 'arm64';
    if (/x86/i.test(value?.architecture ?? '')) return 'x64';
  } catch {
    // Browsers may decline this optional hint. The release page remains safe.
  }
  if (/(?:arm64|aarch64)/i.test(navigator.userAgent)) return 'arm64';
  if (/(?:x86_64|x64)/i.test(navigator.userAgent)) return 'x64';
  return 'unknown';
}

/**
 * GitHub's `releases/latest` is chronological, not tied to the deployed site.
 * Require the release tag (and, for production builds, source commit) to match
 * before exposing an installer URL.
 */
export function selectCurrentRelease(
  release: ReleaseDetails,
  appVersion: string,
  sourceCommit = ''
): ReleaseDetails | undefined {
  if (release.tag_name !== `v${appVersion}`) return undefined;
  if (sourceCommit && release.target_commitish !== sourceCommit) return undefined;
  if (typeof release.html_url !== 'string' || !Array.isArray(release.assets)) return undefined;
  if (release.assets.some((asset) => typeof asset?.name !== 'string' || typeof asset?.browser_download_url !== 'string')) return undefined;
  return release;
}

function readCachedRelease(storage: Pick<Storage, 'getItem' | 'removeItem'>, now: number): ReleaseDetails | undefined {
  try {
    const value = storage.getItem(releaseCacheKey);
    if (!value) return undefined;
    const cached = JSON.parse(value) as Partial<CachedRelease>;
    if (typeof cached.saved !== 'number' || now - cached.saved >= releaseCacheLifetimeMs || !cached.release) {
      storage.removeItem(releaseCacheKey);
      return undefined;
    }
    return cached.release;
  } catch {
    try { storage.removeItem(releaseCacheKey); } catch { /* Storage can be unavailable in private contexts. */ }
    return undefined;
  }
}

/**
 * Resolve only metadata for this exact site build. GitHub absence, rate limits,
 * stale releases, malformed JSON, and unavailable browser storage all degrade
 * to `undefined`; callers retain the normal Releases-page link.
 */
export async function loadCurrentRelease(
  appVersion: string,
  sourceCommit: string,
  options: {
    fetcher?: typeof fetch;
    storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
    now?: number;
  } = {}
): Promise<ReleaseDetails | undefined> {
  const fetcher = options.fetcher ?? fetch;
  const storage = options.storage ?? localStorage;
  const now = options.now ?? Date.now();
  const cached = readCachedRelease(storage, now);
  const currentCached = cached && selectCurrentRelease(cached, appVersion, sourceCommit);
  if (currentCached) return currentCached;

  try {
    const response = await fetcher(releaseApiUrl, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) return undefined;
    const release = await response.json() as ReleaseDetails;
    const current = selectCurrentRelease(release, appVersion, sourceCommit);
    if (!current) return undefined;
    try {
      storage.setItem(releaseCacheKey, JSON.stringify({ saved: now, release: current } satisfies CachedRelease));
    } catch {
      // A blocked storage write must not prevent a direct installer link.
    }
    return current;
  } catch {
    return undefined;
  }
}

export function selectPlatformAsset(assets: ReleaseAsset[], platform: DesktopPlatform, macArchitecture: MacArchitecture = 'unknown'): ReleaseAsset | undefined {
  if (platform === 'Linux') return assets.find((asset) => /_amd64\.AppImage$/i.test(asset.name));
  if (platform === 'Windows') {
    return assets.find((asset) => /_x64_en-US\.msi$/i.test(asset.name))
      ?? assets.find((asset) => /_x64-setup\.exe$/i.test(asset.name));
  }
  if (macArchitecture === 'arm64') return assets.find((asset) => /_aarch64\.dmg$/i.test(asset.name));
  if (macArchitecture === 'x64') return assets.find((asset) => /_x64\.dmg$/i.test(asset.name));
  return undefined;
}
