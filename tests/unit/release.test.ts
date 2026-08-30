import { describe, expect, it } from 'vitest';
import { detectDesktopPlatform, selectCurrentRelease, selectPlatformAsset } from '../../src/release';

const assets = [
  { name: 'Food.Log.Export.Kit_0.1.4_aarch64.dmg', browser_download_url: 'https://downloads.test/arm.dmg' },
  { name: 'Food.Log.Export.Kit_0.1.4_x64.dmg', browser_download_url: 'https://downloads.test/intel.dmg' },
  { name: 'Food.Log.Export.Kit_0.1.4_x64-setup.exe', browser_download_url: 'https://downloads.test/setup.exe' },
  { name: 'Food.Log.Export.Kit_0.1.4_x64_en-US.msi', browser_download_url: 'https://downloads.test/setup.msi' },
  { name: 'Food.Log.Export.Kit_0.1.4_amd64.AppImage', browser_download_url: 'https://downloads.test/appimage' }
];

describe('release asset selection', () => {
  it('selects a real installer for Linux, Windows, Apple Silicon, and Intel Mac', () => {
    expect(detectDesktopPlatform('X11; Linux x86_64')).toBe('Linux');
    expect(detectDesktopPlatform('Windows NT 10.0')).toBe('Windows');
    expect(detectDesktopPlatform('Macintosh')).toBe('macOS');
    expect(selectPlatformAsset(assets, 'Linux')?.name).toMatch(/AppImage$/);
    expect(selectPlatformAsset(assets, 'Windows')?.name).toMatch(/\.msi$/);
    expect(selectPlatformAsset(assets, 'macOS', 'arm64')?.name).toMatch(/aarch64\.dmg$/);
    expect(selectPlatformAsset(assets, 'macOS', 'x64')?.name).toMatch(/x64\.dmg$/);
    expect(selectPlatformAsset(assets, 'macOS', 'unknown')).toBeUndefined();
  });

  it('@regression:stale-desktop-release does not point a newer app build at the previous tagged desktop release', () => {
    const staleRelease = {
      tag_name: 'v0.1.4',
      html_url: 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.4',
      assets
    };
    const currentRelease = {
      ...staleRelease,
      tag_name: 'v0.1.6',
      html_url: 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.6'
    };

    // This is the exact v0.1.4-versus-new-candidate failure observed by verification 8.
    expect(selectCurrentRelease(staleRelease, '0.1.6')).toBeUndefined();
    expect(selectCurrentRelease(currentRelease, '0.1.6')).toEqual(currentRelease);
    expect(selectCurrentRelease({ ...currentRelease, target_commitish: '5b770194cb02e41d70efb114f7e11a1a35f6766c' }, '0.1.6', 'new-source-commit')).toBeUndefined();
    expect(selectCurrentRelease({ ...currentRelease, target_commitish: 'new-source-commit' }, '0.1.6', 'new-source-commit')).toEqual({ ...currentRelease, target_commitish: 'new-source-commit' });
  });

  it('@regression:V14-release-identity requires both current version and current candidate identity', () => {
    const current = {
      tag_name: 'v0.1.9',
      target_commitish: 'current-candidate',
      html_url: 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.9',
      assets
    };
    expect(selectCurrentRelease(current, '0.1.9', 'current-candidate')).toEqual(current);
    expect(selectCurrentRelease({ ...current, tag_name: 'v0.1.8' }, '0.1.9', 'current-candidate')).toBeUndefined();
    expect(selectCurrentRelease({ ...current, target_commitish: 'older-candidate' }, '0.1.9', 'current-candidate')).toBeUndefined();
  });
});
