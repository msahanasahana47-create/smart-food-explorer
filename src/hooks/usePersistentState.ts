import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

export function usePersistentState<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => loadFromStorage<T>(key, initial));

  useEffect(() => {
    saveToStorage(key, value);
  }, [key, value]);

  return [value, setValue];
}
