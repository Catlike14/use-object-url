import { useEffect, useMemo } from 'react';

interface ObjectUrlCacheEntry {
  url: string;
  references: number;
}

const objectUrlCache = new WeakMap<Blob | MediaSource, ObjectUrlCacheEntry>();

export function useObjectUrl(blob: Blob | MediaSource): string {
  const getObjectUrl = useMemo(() => {
    const cached = objectUrlCache.get(blob);

    if (cached) {
      cached.references += 1;
      return cached.url;
    }

    const objectUrl = URL.createObjectURL(blob);
    objectUrlCache.set(blob, { url: objectUrl, references: 1 });

    return objectUrl;
  }, [blob]);

  useEffect(() => {
    return () => {
      const cached = objectUrlCache.get(blob);
      if (!cached) return;

      cached.references -= 1;
      if (cached.references <= 0) {
        objectUrlCache.delete(blob);
        URL.revokeObjectURL(cached.url);
      }
    };
  }, [blob]);

  return getObjectUrl;
}
