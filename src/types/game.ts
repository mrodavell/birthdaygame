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
  userid?: string;
  dateTimePurchased?: string;
  drawDate?: string;
  drawNumber: string;
  serial: string;
  boards: string;
  totalBet: string | number;
  drawTime: string;
  drawCount?: number;
  combinations: string;
  created_at?: string;
};
