const slug = 'food-log-export-kit';
const key = `sb_license:${slug}`;
const verdictKey = `${key}:verdict`;
const base = 'https://api.sociobot.in/api/v1';

export interface LicenseState { licensed: boolean; checking: boolean; notice: string; }
interface CachedVerdict { token: string; valid: boolean; checked: number; }

export function checkoutUrl(): string {
  return `${base}/products/${slug}/checkout`;
}

export function storedLicense(): string {
  return localStorage.getItem(key) ?? '';
}

export function acceptLicenseFromUrl(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  const cleanToken = token.trim();
  if (storedLicense() !== cleanToken) localStorage.removeItem(verdictKey);
  localStorage.setItem(key, cleanToken);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function cachedVerdict(token = storedLicense()): CachedVerdict | null {
  const cached = localStorage.getItem(verdictKey);
  if (!cached || !token) return null;
  try {
    const verdict = JSON.parse(cached) as Partial<CachedVerdict>;
    return verdict.token === token.trim() && typeof verdict.valid === 'boolean' && typeof verdict.checked === 'number'
      ? verdict as CachedVerdict
      : null;
  } catch { return null; }
}

export function optimisticLicense(token = storedLicense()): boolean {
  return cachedVerdict(token)?.valid === true;
}

export async function verifyLicense(token = storedLicense()): Promise<LicenseState> {
  const cleanToken = token.trim();
  if (!cleanToken) return { licensed: false, checking: false, notice: '' };
  if (storedLicense() !== cleanToken) localStorage.removeItem(verdictKey);
  localStorage.setItem(key, cleanToken);
  const cached = cachedVerdict(cleanToken);
  if (cached && Date.now() - cached.checked < 86_400_000) return { licensed: cached.valid, checking: false, notice: cached.valid ? '' : 'This license is no longer active.' };
  try {
    const response = await fetch(`${base}/products/${slug}/verify?license=${encodeURIComponent(cleanToken)}`);
    if (!response.ok) throw new Error('verify unavailable');
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(verdictKey, JSON.stringify({ token: cleanToken, valid: result.valid, checked: Date.now() } satisfies CachedVerdict));
    return { licensed: result.valid, checking: false, notice: result.valid ? '' : 'This license is no longer active.' };
  } catch {
    const saved = cachedVerdict(cleanToken);
    return {
      licensed: saved?.valid === true,
      checking: false,
      notice: saved ? 'License check is offline. The last saved status is in use.' : 'The license could not be checked. Connect to the internet and try again.'
    };
  }
}

export function removeLicense(): void {
  localStorage.removeItem(key);
  localStorage.removeItem(verdictKey);
}
