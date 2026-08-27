/**
 * Formats an external URL safely ensuring it always has the https:// prefix
 * so that browsers open it as an external domain instead of a relative local path.
 */
export function formatExternalUrl(url?: string | null, awbNumber?: string | null): string {
  if (url && url.trim()) {
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    return `https://${trimmed}`;
  }

  if (awbNumber && awbNumber.trim()) {
    return `https://www.delhivery.com/track/package/${awbNumber.trim()}`;
  }

  return '#';
}
