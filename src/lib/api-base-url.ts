/** Browser API base URL. Ensures /api/v1 suffix is always present. */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!raw) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }
  if (raw.endsWith('/api/v1')) {
    return raw;
  }
  return `${raw}/api/v1`;
}
