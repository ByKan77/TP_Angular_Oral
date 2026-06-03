export function idFromUrl(url: string): number | null {
  const segment = url.split('/').filter(Boolean).pop();
  if (!segment || segment === 'unknown' || Number.isNaN(Number(segment))) {
    return null;
  }
  return Number(segment);
}

export function idsFromUrls(urls: string[]): number[] {
  return urls
    .map(idFromUrl)
    .filter((id): id is number => id !== null);
}
