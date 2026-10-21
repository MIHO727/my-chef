export interface MealFormData {
  family: string;
  ingredients: string;
  requests: string;
}

export type Sender = 'bot' | 'user';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
}
