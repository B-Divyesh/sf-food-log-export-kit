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
  return release;
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
