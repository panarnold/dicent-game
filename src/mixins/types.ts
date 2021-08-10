export type roundHistory = {
  roundNumber: number;
  currentDice: number;
  throwResult: number;
  playerBet: string;
  totalScore: number;
  success: string;
  roundScore: number;
};

export const headers: Array<string> = [
  "round",
  "current dice",
  "throw result",
  "bet",
  "success/failure",
  "round score",
  "total score",
];
