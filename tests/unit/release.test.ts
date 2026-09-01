import { describe, expect, it } from 'vitest';
import { detectDesktopPlatform, loadCurrentRelease, releaseApiUrl, selectCurrentRelease, selectPlatformAsset } from '../../src/release';

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
      tag_name: 'v0.1.14',
      target_commitish: 'current-candidate',
      html_url: 'https://github.com/B-Divyesh/sf-food-log-export-kit/releases/tag/v0.1.14',
      assets
    };
    expect(selectCurrentRelease(current, '0.1.14', 'current-candidate')).toEqual(current);
    expect(selectCurrentRelease({ ...current, tag_name: 'v0.1.11' }, '0.1.14', 'current-candidate')).toBeUndefined();
    expect(selectCurrentRelease({ ...current, target_commitish: 'older-candidate' }, '0.1.14', 'current-candidate')).toBeUndefined();
  });

  it('@regression:R12-release-absence fetches api.github.com and fails soft for missing, stale, or malformed metadata', async () => {
    const stored = new Map<string, string>([['release:food-log-export-kit', '{not json']]);
    const storage = {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => { stored.set(key, value); },
      removeItem: (key: string) => { stored.delete(key); }
    };
    const missingFetch = async (input: RequestInfo | URL) => {
      expect(String(input)).toBe(releaseApiUrl);
      return new Response('{"message":"Not Found"}', { status: 404 });
    };
    await expect(loadCurrentRelease('0.1.14', 'candidate', { storage, fetcher: missingFetch as typeof fetch, now: 100 }))
      .resolves.toBeUndefined();
    expect(stored.has('release:food-log-export-kit')).toBe(false);

    const stale = { tag_name: 'v0.1.10', target_commitish: 'older', html_url: 'https://example.test/old', assets: [] };
    await expect(loadCurrentRelease('0.1.14', 'candidate', {
      storage,
      fetcher: async () => new Response(JSON.stringify(stale), { status: 200 })
    })).resolves.toBeUndefined();
    await expect(loadCurrentRelease('0.1.14', 'candidate', {
      storage,
      fetcher: async () => { throw new TypeError('offline'); }
    })).resolves.toBeUndefined();
    await expect(loadCurrentRelease('0.1.14', 'candidate', {
      storage,
      fetcher: async () => new Response('{broken', { status: 200 })
    })).resolves.toBeUndefined();
    await expect(loadCurrentRelease('0.1.14', 'candidate', {
      storage,
      fetcher: async () => new Response(JSON.stringify({ tag_name: 'v0.1.14', target_commitish: 'candidate' }), { status: 200 })
    })).resolves.toBeUndefined();
  });

  it('@regression:R12-release-cache uses candidate metadata for one hour and refreshes an expired entry', async () => {
    const current = {
      tag_name: 'v0.1.14', target_commitish: 'candidate', html_url: 'https://example.test/current', assets
    };
    const stored = new Map<string, string>();
    const storage = {
      getItem: (key: string) => stored.get(key) ?? null,
      setItem: (key: string, value: string) => { stored.set(key, value); },
      removeItem: (key: string) => { stored.delete(key); }
    };
    let requests = 0;
    const fetcher = async () => { requests += 1; return new Response(JSON.stringify(current), { status: 200 }); };
    await expect(loadCurrentRelease('0.1.14', 'candidate', { storage, fetcher: fetcher as typeof fetch, now: 100 }))
      .resolves.toEqual(current);
    await expect(loadCurrentRelease('0.1.14', 'candidate', { storage, fetcher: fetcher as typeof fetch, now: 3_600_099 }))
      .resolves.toEqual(current);
    expect(requests).toBe(1);
    await loadCurrentRelease('0.1.14', 'candidate', { storage, fetcher: fetcher as typeof fetch, now: 3_600_100 });
    expect(requests).toBe(2);
  });
});
