export function buildCacheKey(
  prefix: string,
  ...segments: (string | number)[]
): string {
  const parts = segments
    .filter((s) => s !== '' && s !== undefined && s !== null)
    .map(String);
  return [prefix, ...parts].join(':');
}
