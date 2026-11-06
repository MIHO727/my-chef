import { useCallback, useState } from 'react';
import type { FavoriteRecipe } from '@/types';

const STORAGE_KEY = 'my-chef-favorites';
const SAVE_ERROR = 'お気に入りを保存できませんでした。ブラウザの設定や空き容量を確認してください。';

function isFavoriteRecipe(value: unknown): value is FavoriteRecipe {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { text?: unknown }).text === 'string' &&
    typeof (value as { savedAt?: unknown }).savedAt === 'string'
  );
}

function loadFavorites(): FavoriteRecipe[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter(isFavoriteRecipe) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>(loadFavorites);
  const [error, setError] = useState('');

  const commit = useCallback((next: FavoriteRecipe[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setFavorites(next);
      setError('');
    } catch {
      setError(SAVE_ERROR);
    }
  }, []);

  const isFavorite = useCallback(
    (text: string) => favorites.some((item) => item.text === text),
    [favorites],
  );

  const remove = useCallback(
    (text: string) => {
      commit(favorites.filter((item) => item.text !== text));
    },
    [favorites, commit],
  );

  const toggle = useCallback(
    (text: string) => {
      if (isFavorite(text)) {
        remove(text);
        return;
      }
      commit([{ text, savedAt: new Date().toISOString() }, ...favorites]);
    },
    [favorites, isFavorite, remove, commit],
  );

  return { favorites, error, isFavorite, toggle, remove };
}
