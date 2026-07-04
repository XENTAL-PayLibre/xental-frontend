/** Browser API base URL. Routes through local proxy in dev so cookies work on localhost. */
export function getApiBaseUrl(): string {
  // In local development, use Next.js Rewrites (configured in next.config.ts) 
  // to act as a proxy. This solves all CORS and cross-domain cookie issues!
  if (process.env.NODE_ENV === 'development') {
    return '/api/v1';
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
