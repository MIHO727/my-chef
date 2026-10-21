import type { MealFormData, ChatMessage } from '@/types';

let messageIdCounter = 0;

const CHAT_USER_ID = 'my-chef-user';
const INITIAL_QUERY = 'この条件で今日の献立を提案してください';

export interface DifyChatResult {
  answer: string;
  conversationId: string;
}

export function createMessage(sender: 'bot' | 'user', text: string): ChatMessage {
  messageIdCounter += 1;
  return { id: `msg-${messageIdCounter}`, sender, text };
}

function buildInputs(data: MealFormData): Record<string, string> {
  return {
    family: data.family.trim(),
    ingredients: data.ingredients.trim(),
    requests: data.requests.trim(),
  };
}

async function postChatMessage(
  data: MealFormData,
  query: string,
  conversationId: string,
): Promise<DifyChatResult> {
  const body: Record<string, unknown> = {
    inputs: buildInputs(data),
    query,
    response_mode: 'blocking',
    user: CHAT_USER_ID,
  };

  if (conversationId) {
    body.conversation_id = conversationId;
  }

  let response: Response;
  try {
    response = await fetch('/api/chat-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(
      'サーバーに接続できませんでした。ネットワークを確認するか、しばらくしてからもう一度お試しください。',
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error('サーバーからの応答を読み取れませんでした。');
  }

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof (payload as { message: unknown }).message === 'string'
        ? (payload as { message: string }).message
        : null;

    if (response.status === 401) {
      throw new Error('APIの認証に失敗しました。DIFY_API_KEY の設定を確認してください。');
    }
    if (response.status === 404) {
      throw new Error('チャットAPIが見つかりません。DIFY_API_URL の設定を確認してください。');
    }

    throw new Error(
      message ?? `献立の取得に失敗しました（エラーコード: ${response.status}）。`,
    );
  }

  const answer =
    typeof payload === 'object' &&
    payload !== null &&
    'answer' in payload &&
    typeof (payload as { answer: unknown }).answer === 'string'
      ? (payload as { answer: string }).answer
      : '';

  const newConversationId =
    typeof payload === 'object' &&
    payload !== null &&
    'conversation_id' in payload &&
    typeof (payload as { conversation_id: unknown }).conversation_id === 'string'
      ? (payload as { conversation_id: string }).conversation_id
      : conversationId;

  if (!answer.trim()) {
    throw new Error('Myシェフから回答が返ってきませんでした。もう一度お試しください。');
  }

  return { answer, conversationId: newConversationId };
}

export async function fetchInitialProposal(
  data: MealFormData,
  conversationId = '',
): Promise<DifyChatResult> {
  return postChatMessage(data, INITIAL_QUERY, conversationId);
}

export async function fetchFollowUpReply(
  question: string,
  data: MealFormData,
  conversationId: string,
): Promise<DifyChatResult> {
  if (!conversationId) {
    throw new Error('会話が開始されていません。最初から献立を提案してもらってください。');
  }
  return postChatMessage(data, question, conversationId);
}
