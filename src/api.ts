import type { MealFormData, ChatMessage } from '@/types';

let messageIdCounter = 0;

export function createMessage(sender: 'bot' | 'user', text: string): ChatMessage {
  messageIdCounter += 1;
  return { id: `msg-${messageIdCounter}`, sender, text };
}

function buildInitialProposal(data: MealFormData): string {
  const ingredientsList = data.ingredients
    ? data.ingredients.trim()
    : '冷蔵庫にある食材';

  const proposal = `素敵な献立をご提案します！🍳

ご家族構成：${data.family || 'ご家族'}
使える食材：${ingredientsList}
ご要望：${data.requests || '特になし'}

【今日の献立】
1. 鮭とキャベツのバター醤油炒め
   └ パパッと炒めるだけで子どもも大好き♪
2. 大根とツナのさっぱりサラダ
   └ ツナの旨味で野菜もパクパク食べられます
3. みそ汁（大根とわかめ）
   └ 温かい一杯でほっとひと息

💡 ポイント：20分以内で完成！子ども用は味を薄めにして、野菜は細かく切ると食べやすくなりますよ。`;

  return proposal;
}

function buildFollowUpReply(question: string): string {
  const q = question.toLowerCase();

  if (q.includes('簡単') || q.includes('かんたん') || q.includes('時短')) {
    return `もっと簡単にしましょう！😊

【もっと簡単な献立】
1. ツナとキャベツの塩こん炒め（フライパン一つで5分）
2. 大根の即漬け（切って和えるだけ）
3. インスタントみそ汁

これなら忙しい日でも大丈夫！包丁を使う量も最小限です。`;
  }

  if (q.includes('野菜') || q.includes('きらい') || q.includes('嫌い')) {
    return `野菜嫌いのお子さんにもおすすめです🍅

【野菜を隠す工夫】
・キャベツや大根を細かく刻んでツナと一緒に炒める
・みそ汁に大根をすりおろして入れる（食感が分からない！）
・ハンバーグやつくねに混ぜ込む

「見えない野菜」から始めて、徐々に食感を残していくのがコツですよ。`;
  }

  if (q.includes('アレルギー') || q.includes('除去') || q.includes('代わり')) {
    return `アレルギーのご配慮、承知しました🌱

ご安心ください、ご家族に安心な食材で代替案をご用意できます。どの食材を避けたいか、お子さんの年齢と合わせて教えていただけますか？`;
  }

  if (q.includes('もう一品') || q.includes('足りない') || q.includes('追加')) {
    return `もう一品ですね！👀

【追加のおかず】
・卵スープ（卵1個・2分で完成）
   └ ボリュームも栄養もアップ！

これで献立がぐっと充実しますよ。`;
  }

  return `いいご質問ですね！😊
ご要望に合わせてさらにアドバイスできます。たとえば「もっと簡単なのは？」「野菜嫌いの子ども用の工夫は？」「もう一品足りない」など、何でもお気軽に聞いてくださいね。`;
}

export async function fetchInitialProposal(data: MealFormData): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return buildInitialProposal(data);
}

export async function fetchFollowUpReply(question: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return buildFollowUpReply(question);
}
