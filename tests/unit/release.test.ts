import { describe, expect, it } from 'vitest';
import { detectDesktopPlatform, selectPlatformAsset } from '../../src/release';

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
});
