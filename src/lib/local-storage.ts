const DEFAULT_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface StorageItem<T> {
  value: T;
  timestamp: number;
}

export function setWithExpiry<T>(key: string, value: T, ttl: number = DEFAULT_EXPIRATION): void {
  const item: StorageItem<T> = {
    value,
    timestamp: new Date().getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry<T>(key: string): T | null {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item: StorageItem<T> = JSON.parse(itemStr);
  const now = new Date().getTime();

  if (now > item.timestamp) {
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}
