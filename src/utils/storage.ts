export const STORAGE_KEYS = {
  favorites: 'fe:favorites',
  shoppingList: 'fe:shopping-list',
  recent: 'fe:recently-viewed',
  compare: 'fe:compare',
  theme: 'fe:theme',
} as const;

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage may be full or blocked (private mode); the app keeps working in memory.
  }
}
