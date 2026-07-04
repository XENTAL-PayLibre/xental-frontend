/** Browser API base URL. Routes through local proxy in dev so cookies work on localhost. */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return '/api/proxy/api/v1';
  }
  const raw = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!raw) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }
  if (raw.endsWith('/api/v1')) {
    return raw;
  }
  return `${raw}/api/v1`;
}
