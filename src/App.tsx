import { useState, useCallback } from 'react';
import { ChefHat } from 'lucide-react';
import type { MealFormData, ChatMessage } from '@/types';
import { MealForm } from '@/components/MealForm';
import { ChatPanel } from '@/components/ChatPanel';
import { createMessage, fetchInitialProposal, fetchFollowUpReply } from '@/api';

const emptyForm: MealFormData = {
  family: '',
  ingredients: '',
  requests: '',
};

function App() {
  const [formData, setFormData] = useState<MealFormData>(emptyForm);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleChange = useCallback((field: keyof MealFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setShowChat(true);

    const summary = `家族構成：${formData.family || '未入力'}
食材：${formData.ingredients || '未入力'}
リクエスト：${formData.requests || 'なし'}`;

    setMessages([createMessage('user', summary)]);

    try {
      const proposal = await fetchInitialProposal(formData);
      setMessages((prev) => [...prev, createMessage('bot', proposal)]);
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage('bot', 'ごめんなさい、エラーが発生しました。もう一度お試しください。'),
      ]);
    } finally {
      setLoading(false);
    }
  }, [formData, loading]);

  const handleSendFollowUp = useCallback(async () => {
    const text = followUp.trim();
    if (!text || loading) return;

    setLoading(true);
    setFollowUp('');
    setMessages((prev) => [...prev, createMessage('user', text)]);

    try {
      const reply = await fetchFollowUpReply(text);
      setMessages((prev) => [...prev, createMessage('bot', reply)]);
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage('bot', 'ごめんなさい、エラーが発生しました。もう一度お試しください。'),
      ]);
    } finally {
      setLoading(false);
    }
  }, [followUp, loading]);

  const handleReset = useCallback(() => {
    setMessages([]);
    setFollowUp('');
    setFormData(emptyForm);
    setShowChat(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-stone-50">
      {/* Decorative top blob */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 overflow-hidden">
        <div className="absolute -top-20 left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-200/40 to-amber-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-400 shadow-md">
            <ChefHat className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-700">Myシェフ</h1>
            <p className="text-sm text-stone-400">子育て家庭向け 献立提案チャットボット</p>
          </div>
        </header>

        {/* Form section — hidden after first submit on small screens */}
        <div className={showChat ? 'hidden sm:block' : ''}>
          <MealForm
            values={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            disabled={loading}
          />
        </div>

        {/* Chat section */}
        {showChat && (
          <div className="h-[60vh] sm:h-[55vh]">
            <ChatPanel
              messages={messages}
              loading={loading}
              followUpText={followUp}
              onFollowUpChange={setFollowUp}
              onSendFollowUp={handleSendFollowUp}
              onReset={handleReset}
              showFollowUp={!loading || messages.length > 0}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-stone-300">
          Myシェフ © 2026 — 毎日の献立、もう悩まない
        </footer>
      </div>
    </div>
  );
}

export default App;
