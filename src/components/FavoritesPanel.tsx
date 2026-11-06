import { Star, Trash2, X } from 'lucide-react';
import type { FavoriteRecipe } from '@/types';
import { MarkdownText } from '@/components/MarkdownText';

interface FavoritesPanelProps {
  favorites: FavoriteRecipe[];
  error: string;
  onRemove: (text: string) => void;
  onClose: () => void;
}

export function FavoritesPanel({ favorites, error, onRemove, onClose }: FavoritesPanelProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="お気に入り"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/30 px-4 py-6 sm:py-8"
    >
      <div className="mx-auto max-w-2xl rounded-3xl bg-orange-50 p-4 shadow-lg ring-1 ring-orange-100 sm:p-5">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-current text-amber-400" />
            <p className="text-sm font-semibold text-stone-700">お気に入り（{favorites.length}）</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-500 transition hover:border-orange-300 hover:text-orange-500 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        {favorites.length === 0 && (
          <p className="py-8 text-center text-sm leading-relaxed text-stone-400">
            まだお気に入りはありません。
            <br />
            気に入った献立の⭐を押すと、ここに保存されます。
          </p>
        )}

        {/* List */}
        <div className="space-y-3">
          {favorites.map((item) => (
            <article
              key={item.text}
              className="rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed text-stone-700 shadow-sm ring-1 ring-orange-100"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-stone-400">
                  {new Date(item.savedAt).toLocaleString('ja-JP')} に保存
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('本当に削除しますか？')) {
                      onRemove(item.text);
                    }
                  }}
                  className="flex flex-shrink-0 items-center gap-1 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:border-red-300 hover:text-red-500 active:scale-95"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  削除
                </button>
              </div>
              <MarkdownText text={item.text} />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
