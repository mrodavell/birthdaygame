export type TBoard = {
  label: string;
  combination: TCombination;
  bet: string;
  index?: number;
  status: string;
};

export type TCombination = {
  month: string;
  date: string;
  letters: string[];
};

export type TBet = {
  board: string;
  combination: TCombination;
  bet: number;
};
