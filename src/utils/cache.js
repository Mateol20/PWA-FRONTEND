const cacheStore = new Map();
const TTL = 5 * 60 * 1000;

export function getCache(key) {
  const item = cacheStore.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cacheStore.delete(key);
    return null;
  }
  return item.data;
}

export function setCache(key, data, ttl = TTL) {
  cacheStore.set(key, { data, expiry: Date.now() + ttl });
}

export function clearCache(pattern) {
  if (!pattern) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) cacheStore.delete(key);
  }
}
