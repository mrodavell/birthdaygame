import dayjs, { Dayjs } from "dayjs";
import { create } from "zustand";
import { TBet, TBoard, TTicket } from "../types/game";
import { useWalletStore } from "./wallet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

type TActivities = {
  type: string;
  bet: TBet | string;
  date: string;
};

type TLockedInBoard = {
  board: TBoard[];
  timestamp: string;
};

type TResult = {
  id: number;
  result: string;
  create_at: string;
};

type TState = {
  tickets: TTicket[];
  lockedInBoards: TLockedInBoard[];
  boards: TBoard[];
  selectedBoardIndex?: number;
  bets: TBet[];
  draws: number;
  totalBet: number;
  transactions: TActivities[];
  isWin: boolean;
  totalWin: number;
};

type TActions = {
  setSelectedBoardIndex: (index: number) => void;
  bet: (data: TBet) => void;
  handleBoards: (data: TBet) => void;
  updateBoards: (data: TBet) => void;
  clearBoard: (data?: TBoard) => void;
  handleResetBoard: () => void;
  getTotal: () => void;
  updateDraws: (draws: number) => void;
  lockedIn: () => void;
  checkWin: (combination: TResult) => void;
  incrementBet: () => void;
  decrementBet: () => void;
  handleTickets: (ticket: TTicket) => void;
  setTickets: (tickets: any) => void;
  handleActivities: (data: TActivities) => void;
  setActivities: (transactions: any) => void;
  setIsWin: (value: boolean) => void;
  setTotalWin: (value: number) => void;
};

const emptyBoard = [
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
];

export const useGameStore = create<TState & TActions>((set, get) => ({
  isWin: false,
  totalWin: 0,
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
  tickets: [],
  selectedBoardIndex: undefined,
  lockedInBoards: [],
  bets: [],
  draws: 1,
  totalBet: 0,
  transactions: [],
  setIsWin: (value: boolean) => {
    set(() => ({ isWin: value }));
  },
  setTotalWin: (value: number) => {
    set(() => ({ totalWin: value }));
  },
  setSelectedBoardIndex: (index: number) => {
    set(() => ({ selectedBoardIndex: index }));
  },
  incrementBet: () => {
    const targetIndex = get().selectedBoardIndex ?? 0;
    let currentBoards = get().boards;
    let targetBoard = currentBoards[targetIndex];

    targetBoard.bet = (parseInt(targetBoard.bet) + 1).toString();
    currentBoards[targetIndex] = targetBoard;

    set(() => ({ boards: [...currentBoards] }));
    useWalletStore.getState().withdraw(1, "Increment Bet");

    const transaction: TActivities = {
      type: "Increment Bet",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss A"),
      bet: {
        label: targetBoard.label,
        bet: parseInt(targetBoard.bet.toString()),
        combination: targetBoard.combination,
      },
    };

    get().handleActivities(transaction);
    get().getTotal();
  },
  decrementBet: () => {
    const targetIndex = get().selectedBoardIndex ?? 0;
    let currentBoards = get().boards;
    let targetBoard = currentBoards[targetIndex];

    targetBoard.bet = (parseInt(targetBoard.bet) - 1).toString();
    currentBoards[targetIndex] = targetBoard;

    set(() => ({ boards: [...currentBoards] }));
    useWalletStore.getState().withdraw(1, "Decrement Bet");

    const transaction: TActivities = {
      type: "Decrement Bet",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss A"),
      bet: {
        label: targetBoard.label,
        bet: parseInt(targetBoard.bet.toString()),
        combination: targetBoard.combination,
      },
    };

    get().handleActivities(transaction);
    get().getTotal();
  },
  lockedIn: () => {
    const boards = get().boards;
    const newLockedIn: TLockedInBoard = {
      board: boards,
      timestamp: dayjs().format("MMM DD, YYYY h:m:s A"),
    };

    const lockedInBoard = get().lockedInBoards;
    lockedInBoard.push(newLockedIn);
    get().getTotal();
    set(() => ({ lockedInBoards: [...lockedInBoard] }));
  },
  clearBoard: async (board?: TBoard | undefined) => {
    if (board === undefined) {
      return;
    }

    const targetIndex = get().selectedBoardIndex ?? 0;
    let currentBoards = get().boards;
    const targetBoard = currentBoards[targetIndex];

    const updatedTargetBoard = {
      label: targetBoard.label,
      combination: {
        month: "",
        date: "",
        letters: [],
      },
      bet: "",
      status: "empty",
    };

    const data: TActivities = {
      type: "Clear Bet",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      bet: {
        label: targetBoard.label,
        bet: parseInt(targetBoard.bet),
        combination: targetBoard.combination,
      },
    };

    get().handleActivities(data);
    useWalletStore
      .getState()
      .deposit(parseInt(targetBoard.bet), "Return bet to deposit");

    currentBoards[targetIndex] = updatedTargetBoard;
    set(() => ({ boards: [...currentBoards] }));

    get().getTotal();
  },
  handleBoards: (data: TBet) => {
    const targetIndex = get().selectedBoardIndex ?? 0;
    let currentBoards = get().boards;

    let targetBoard = currentBoards[targetIndex];

    if (targetBoard.status === "filled") {
      get().updateBoards(data);
      return;
    }

    currentBoards[targetIndex] = {
      label: data.label,
      bet: data.bet.toString(),
      combination: data.combination,
      status: "filled",
    };

    set(() => ({ boards: [...currentBoards] }));
    useWalletStore.getState().withdraw(data.bet, "New Bet");
    get().getTotal();

    const transaction: TActivities = {
      type: "New Bet",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss A"),
      bet: {
        label: data.label,
        bet: parseInt(data.bet.toString()),
        combination: data.combination,
      },
    };

    get().handleActivities(transaction);
  },
  updateBoards: (data: TBet) => {
    const targetIndex = get().selectedBoardIndex ?? 0;
    let currentBoards = get().boards;
    let targetboard = currentBoards[targetIndex];
    const currentBet = parseInt(targetboard.bet);
    const newBet = parseInt(data.bet.toString());

    useWalletStore.getState().withdraw(newBet, "Update Bet");
    useWalletStore.getState().deposit(currentBet, "Update Bet");
    targetboard.bet = newBet.toString();
    currentBoards[targetIndex] = targetboard;

    set(() => ({ boards: [...currentBoards] }));

    const transaction: TActivities = {
      type: "Update Bet",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss A"),
      bet: {
        label: targetboard.label,
        bet: parseInt(targetboard.bet),
        combination: targetboard.combination,
      },
    };

    get().handleActivities(transaction);
    get().getTotal();
  },
  handleResetBoard: () => {
    set(() => ({ boards: [...emptyBoard] }));
  },
  getTotal: () => {
    const currentBoard = get().boards;
    const draws = get().draws;

    const totalBet = currentBoard.reduce((total, next) => {
      let emptyBet = next.bet;
      if (next.bet === "") {
        emptyBet = "0";
      }
      return total + parseInt(emptyBet);
    }, 0);

    set(() => ({ totalBet: totalBet * draws }));
  },
  updateDraws: (draws: number) => {
    if (draws === 0) return;
    if (draws > 6) return;

    set(() => ({ draws: draws }));
    get().getTotal();
  },
  bet: (betData: TBet) => {
    set((state) => ({ bets: [...state.bets, betData] }));
    set((state) => ({ totalBet: state.totalBet + betData.bet }));

    const data: TActivities = {
      type: "Bet",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      bet: betData,
    };

    get().handleActivities(data);
  },
  handleTickets: (ticket: TTicket) => {
    const prevTickets = get().tickets;
    prevTickets.push(ticket);
    set(() => ({ tickets: [...prevTickets] }));
    AsyncStorage.setItem("tickets", JSON.stringify(prevTickets));
  },
  setTickets: (tickets: any) => {
    set(() => ({ tickets: [...(tickets ?? [])] }));
  },
  handleActivities: (data: TActivities) => {
    const prevActivities = get().transactions;
    prevActivities.push(data);
    set(() => ({ transactions: [...prevActivities] }));
    AsyncStorage.setItem("activity", JSON.stringify(prevActivities));
  },
  setActivities: (transactions: any) => {
    set(() => ({ transactions: [...(transactions ?? [])] }));
  },
  checkWin: (combination: TResult) => {
    const lockedInBoards = get().lockedInBoards;
    const extractedBoards = lockedInBoards.map((obj) => {
      return obj.board;
    });
    const combinationsWithBets = extractedBoards.map((obj, index) => {
      return obj.map((value) => {
        return {
          bet: value.bet,
          combinationDate: `${parseInt(value.combination.month)}-${parseInt(
            value.combination.date ?? 0
          )}`,
          letters: value.combination.letters,
          lettersCount: value.combination.letters.length,
        };
      });
    });

    const exist = combinationsWithBets.map((obj) => {
      const res = combination.result.split("-");
      const letter = res[res.length - 1];
      const combiDate = `${res[0]}-${res[1]}`;
      return obj.filter((obj) => {
        if (obj.combinationDate === combiDate) {
          if (obj.letters.includes(letter)) {
            return true;
          }
        }
      });
    });

    let totalWin = 0;
    exist.map((value) => {
      value.map((v) => {
        if (v.bet !== "") {
          totalWin += (parseInt(v.bet) * 720) / v.lettersCount;
        }
      });
    });

    if (totalWin > 0) {
      useWalletStore.getState().deposit(totalWin, "Deposit Winnings");
      set(() => ({ totalWin: totalWin }));
      set(() => ({ isWin: true }));
      // Toast.show({
      //   type: "win",
      //   text1: "🎉 Congratulations 🎉",
      //   text2: " You won: " + totalWin,
      // });
    }

    set(() => ({ lockedInBoards: [] }));
  },
}));
