import dayjs from "dayjs";
import { create } from "zustand";
import { TBet, TBoard } from "../types/game";
import { useWalletStore } from "./wallet";

type TTransactions = {
  type: string;
  bet: TBet | string;
  date: string;
};

type TState = {
  boards: TBoard[];
  bets: TBet[];
  totalBet: number;
  transactions: TTransactions[];
};

type TActions = {
  bet: (data: TBet) => void;
  handleBoards: (data: TBet, index: number) => void;
  getTotal: () => void;
  clear: (data: TBoard, index: number) => void;
  update: (index: number, data: TBet) => void;
  logTransaction: (data: TTransactions) => void;
};

export const useGameStore = create<TState & TActions>((set, get) => ({
  boards: [
    {
      label: "A",
      combination: {
        month: "",
        date: "",
        letters: [],
      },
      bet: "",
      status: "empty",
    },
    {
      label: "B",
      combination: {
        month: "",
        date: "",
        letters: [],
      },
      bet: "",
      status: "empty",
    },
    {
      label: "C",
      combination: {
        month: "",
        date: "",
        letters: [],
      },
      bet: "",
      status: "empty",
    },
    {
      label: "D",
      combination: {
        month: "",
        date: "",
        letters: [],
      },
      bet: "",
      status: "empty",
    },
    {
      label: "E",
      combination: {
        month: "",
        date: "",
        letters: [],
      },
      bet: "",
      status: "empty",
    },
    {
      label: "F",
      combination: {
        month: "",
        date: "",
        letters: [],
      },
      bet: "",
      status: "empty",
    },
  ],
  bets: [],
  totalBet: 0,
  transactions: [],
  handleBoards: (data: TBet, index: number) => {
    const old = get().boards;

    old[index] = {
      label: data.board,
      bet: data.bet.toString(),
      combination: data.combination,
      index: index,
      status: "filled",
    };

    set(() => ({ boards: [...old] }));
  },
  getTotal: () => {
    const currentBoard = get().boards;
    console.log(currentBoard);
    const totalBet = currentBoard.reduce((total, next) => {
      let emptyBet = next.bet;
      if (next.bet === "") {
        emptyBet = "0";
      }
      return total + parseInt(emptyBet);
    }, 0);
    set(() => ({ totalBet: totalBet }));
  },
  bet: (betData: TBet) => {
    set((state) => ({ bets: [...state.bets, betData] }));
    set((state) => ({ totalBet: state.totalBet + betData.bet }));

    const data: TTransactions = {
      type: "Bet",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      bet: betData,
    };

    get().logTransaction(data);
  },
  clear: (clearedData: TBoard, index: number) => {
    const old = get().boards;
    old[index] = clearedData;
    set(() => ({ boards: [...old] }));

    const data: TTransactions = {
      type: "Clear Bet",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      bet: "",
    };
    get().logTransaction(data);
  },
  update: (index: number, newBet: TBet) => {
    const old = get().bets;
    old[index] = newBet;

    set(() => ({ bets: [...old] }));

    const data: TTransactions = {
      type: "Update Bet",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      bet: newBet,
    };
    get().logTransaction(data);
  },
  logTransaction: (data: TTransactions) =>
    set((state) => ({ transactions: [...state.transactions, data] })),
}));
