export interface MealFormData {
  family: string;
  ingredients: string;
  requests: string;
}

export interface FavoriteRecipe {
  text: string;
  savedAt: string;
}

export type Sender = 'bot' | 'user';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
}
