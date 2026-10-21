import { Users, Refrigerator, MessageCircleHeart } from 'lucide-react';
import type { MealFormData } from '@/types';

interface MealFormProps {
  values: MealFormData;
  onChange: (field: keyof MealFormData, value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

const inputClass =
  'w-full rounded-2xl border border-orange-200 bg-white/80 px-4 py-3 text-stone-700 placeholder-stone-400 shadow-sm transition focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200';

export function MealForm({ values, onChange, onSubmit, disabled }: MealFormProps) {
  return (
    <form
      className="space-y-4 rounded-3xl bg-white/60 p-5 shadow-sm ring-1 ring-orange-100 backdrop-blur-sm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium text-stone-600">
          <Users className="h-4 w-4 text-orange-500" />
          家族構成
        </label>
        <input
          type="text"
          name="family"
          value={values.family}
          onChange={(e) => onChange('family', e.target.value)}
          placeholder="例：大人2人、子ども2人（5歳・3歳）"
          className={inputClass}
          disabled={disabled}
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium text-stone-600">
          <Refrigerator className="h-4 w-4 text-orange-500" />
          冷蔵庫の食材
        </label>
        <textarea
          name="ingredients"
          value={values.ingredients}
          onChange={(e) => onChange('ingredients', e.target.value)}
          placeholder="例：大根、ツナ、鮭、キャベツ"
          rows={3}
          className={`${inputClass} resize-none`}
          disabled={disabled}
        />
      </div>

      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-sm font-medium text-stone-600">
          <MessageCircleHeart className="h-4 w-4 text-orange-500" />
          リクエスト
        </label>
        <input
          type="text"
          name="requests"
          value={values.requests}
          onChange={(e) => onChange('requests', e.target.value)}
          placeholder="例：子どもが野菜嫌い、20分以内で作りたい"
          className={inputClass}
          disabled={disabled}
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="w-full rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:from-orange-500 hover:to-amber-500 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        献立を提案してもらう
      </button>
    </form>
  );
}
