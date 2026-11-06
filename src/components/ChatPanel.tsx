import { useEffect, useRef } from 'react';
import { ChefHat, Send, RotateCcw, Loader2, Star } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { MarkdownText } from '@/components/MarkdownText';

const ERROR_PREFIX = '⚠️';

interface ChatPanelProps {
  messages: ChatMessage[];
  loading: boolean;
  followUpText: string;
  onFollowUpChange: (value: string) => void;
  onSendFollowUp: () => void;
  onReset: () => void;
  showFollowUp: boolean;
  isFavorite: (text: string) => boolean;
  onToggleFavorite: (text: string) => void;
}

export function ChatPanel({
  messages,
  loading,
  followUpText,
  onFollowUpChange,
  onSendFollowUp,
  onReset,
  showFollowUp,
  isFavorite,
  onToggleFavorite,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  return (
    <div className="flex h-full flex-col rounded-3xl bg-white/70 p-4 shadow-sm ring-1 ring-orange-100 backdrop-blur-sm sm:p-5">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100">
            <ChefHat className="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-700">Myシェフ</p>
            <p className="text-xs text-stone-400">あなたの家の献立アドバイザー</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:border-orange-300 hover:text-orange-500 active:scale-95"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            条件を変えて作り直す
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-1 pb-2">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center">
            <p className="text-sm leading-relaxed text-stone-400">
              上のフォームに家族構成や冷蔵庫の食材を入力して、
              <br />
              「献立を提案してもらう」ボタンを押してください 🍽️
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'whitespace-pre-wrap rounded-br-md bg-gradient-to-br from-orange-400 to-amber-400 text-white'
                  : 'rounded-bl-md bg-white pr-10 text-stone-700 ring-1 ring-orange-100'
              }`}
            >
              {msg.sender === 'bot' && !msg.text.startsWith(ERROR_PREFIX) && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(msg.text)}
                  aria-label={isFavorite(msg.text) ? 'お気に入りから外す' : 'お気に入りに保存'}
                  aria-pressed={isFavorite(msg.text)}
                  className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full transition hover:text-amber-400 active:scale-95 ${
                    isFavorite(msg.text) ? 'text-amber-400' : 'text-stone-300'
                  }`}
                >
                  <Star className={`h-4 w-4 ${isFavorite(msg.text) ? 'fill-current' : ''}`} />
                </button>
              )}
              {msg.sender === 'bot' ? <MarkdownText text={msg.text} /> : msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm ring-1 ring-orange-100">
              <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
              <span className="text-sm text-stone-400">Myシェフが考えています...</span>
            </div>
          </div>
        )}
      </div>

      {/* Follow-up input */}
      {showFollowUp && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={followUpText}
            onChange={(e) => onFollowUpChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && followUpText.trim() && !loading) {
                onSendFollowUp();
              }
            }}
            placeholder="例：もっと簡単なのは？"
            disabled={loading}
            className="flex-1 rounded-full border border-orange-200 bg-white px-4 py-2.5 text-sm text-stone-700 placeholder-stone-400 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 disabled:opacity-50"
          />
          <button
            onClick={onSendFollowUp}
            disabled={!followUpText.trim() || loading}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow-md transition hover:from-orange-500 hover:to-amber-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="送信"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      )}
    </div>
  );
}
