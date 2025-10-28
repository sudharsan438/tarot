
export interface TarotCardType {
  id: number;
  name: string;
  description: string;
  image: string;
}

export enum GameState {
  PICKING,
  REVEALING,
  FORTUNE_SHOWN,
}
