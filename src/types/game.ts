export type TBoard = {
  label: string;
  combination: TCombination;
  bet: string;
  status: string;
};

export type TCombination = {
  month: string;
  date: string;
  letters: string[];
};

export type TBet = {
  label: string;
  combination: TCombination;
  bet: number;
};

export type TTicket = {
  datePurchased: string;
  drawNumber: string;
  drawDate: string;
  serial: string;
  boards: TBoard[] | string;
  totalBet: string;
  draws: string;
  drawTimes: string[];
};
