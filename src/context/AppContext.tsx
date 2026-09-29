import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { FavoriteProduct, Product, ShoppingListItem } from '../types/product';
import { usePersistentState } from '../hooks/usePersistentState';
import { STORAGE_KEYS, loadFromStorage } from '../utils/storage';

export const MAX_COMPARE = 3;
export const MAX_RECENT = 5;

type Theme = 'light' | 'dark';

interface AppContextValue {
  favorites: FavoriteProduct[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (product: Product) => void;
  removeFavorite: (id: number) => void;

  shoppingList: ShoppingListItem[];
  shoppingCount: number;
  addToShoppingList: (product: Product, quantity?: number) => void;
  changeQuantity: (id: number, delta: number) => void;
  removeFromShoppingList: (id: number) => void;
  clearShoppingList: () => void;

  compare: Product[];
  isCompared: (id: number) => boolean;
  toggleCompare: (product: Product) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;

  recent: Product[];
  addRecent: (product: Product) => void;

  theme: Theme;
  toggleTheme: () => void;

  toast: string | null;
  notify: (message: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function initialTheme(): Theme {
  const saved = loadFromStorage<Theme | null>(STORAGE_KEYS.theme, null);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = usePersistentState<FavoriteProduct[]>(STORAGE_KEYS.favorites, []);
  const [shoppingList, setShoppingList] = usePersistentState<ShoppingListItem[]>(STORAGE_KEYS.shoppingList, []);
  const [compare, setCompare] = usePersistentState<Product[]>(STORAGE_KEYS.compare, []);
  const [recent, setRecent] = usePersistentState<Product[]>(STORAGE_KEYS.recent, []);
  const [theme, setTheme] = usePersistentState<Theme>(STORAGE_KEYS.theme, initialTheme());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const toggleFavorite = useCallback(
    (product: Product) => {
      setFavorites((prev) =>
        prev.some((p) => p.id === product.id)
          ? prev.filter((p) => p.id !== product.id)
          : [{ ...product, addedAt: Date.now() }, ...prev],
      );
    },
    [setFavorites],
  );

  const removeFavorite = useCallback(
    (id: number) => setFavorites((prev) => prev.filter((p) => p.id !== id)),
    [setFavorites],
  );

  const addToShoppingList = useCallback(
    (product: Product, quantity = 1) => {
      setShoppingList((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
        }
        return [
          ...prev,
          { id: product.id, title: product.title, thumbnail: product.thumbnail, price: product.price, quantity },
        ];
      });
      notify(`Added ${quantity} × ${product.title} to your shopping list`);
    },
    [setShoppingList, notify],
  );

  const changeQuantity = useCallback(
    (id: number, delta: number) =>
      setShoppingList((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)),
      ),
    [setShoppingList],
  );

  const removeFromShoppingList = useCallback(
    (id: number) => setShoppingList((prev) => prev.filter((i) => i.id !== id)),
    [setShoppingList],
  );

  const clearShoppingList = useCallback(() => setShoppingList([]), [setShoppingList]);

  const toggleCompare = useCallback(
    (product: Product) => {
      const already = compare.some((p) => p.id === product.id);
      if (!already && compare.length >= MAX_COMPARE) {
        notify(`You can compare up to ${MAX_COMPARE} products. Remove one first.`);
        return;
      }
      setCompare((prev) =>
        already ? prev.filter((p) => p.id !== product.id) : [...prev, product],
      );
    },
    [compare, setCompare, notify],
  );

  const removeFromCompare = useCallback(
    (id: number) => setCompare((prev) => prev.filter((p) => p.id !== id)),
    [setCompare],
  );

  const clearCompare = useCallback(() => setCompare([]), [setCompare]);

  const addRecent = useCallback(
    (product: Product) =>
      setRecent((prev) => [product, ...prev.filter((p) => p.id !== product.id)].slice(0, MAX_RECENT)),
    [setRecent],
  );

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [setTheme],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      favorites,
      isFavorite: (id) => favorites.some((p) => p.id === id),
      toggleFavorite,
      removeFavorite,
      shoppingList,
      shoppingCount: shoppingList.reduce((sum, i) => sum + i.quantity, 0),
      addToShoppingList,
      changeQuantity,
      removeFromShoppingList,
      clearShoppingList,
      compare,
      isCompared: (id) => compare.some((p) => p.id === id),
      toggleCompare,
      removeFromCompare,
      clearCompare,
      recent,
      addRecent,
      theme,
      toggleTheme,
      toast,
      notify,
    }),
    [
      favorites, toggleFavorite, removeFavorite, shoppingList, addToShoppingList, changeQuantity,
      removeFromShoppingList, clearShoppingList, compare, toggleCompare, removeFromCompare, clearCompare,
      recent, addRecent, theme, toggleTheme, toast, notify,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
