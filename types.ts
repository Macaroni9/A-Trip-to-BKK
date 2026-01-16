
export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  requiredItem?: string;
  consequence?: string;
}

export interface Scene {
  id: string;
  title: string;
  corePrompt: string;
  choices: Choice[];
  isEnding?: boolean;
  recipe?: string;
  abv?: number;
  sweetness?: number;
}

export interface GameState {
  currentSceneId: string;
  inventory: string[];
  history: string[];
  isGenerating: boolean;
  currentText: string;
  currentImageUrl: string | null;
  currentImageUrls?: string[];
}

export interface AIResponse {
  narration: string;
  imageUrl?: string;
}
