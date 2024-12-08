import dayjs from "dayjs";
import { create } from "zustand";
import { TBet, TBoard, TTicket } from "../types/game";
import { useWalletStore } from "./wallet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawTimes, prizeMoney } from "../constants/App";
import { supabase } from "../lib/supabase";

type TActivities = {
  type: string;
  bet: TBet | string;
  date: string;
};

type TLockedInBoard = {
  board: TBoard[];
  drawTime: string[];
  timestamp: string;
};

type TResult = {
  id: number;
  result: string;
  drawtime: string;
  create_at: string;
};

type TState = {
  loading: boolean;
  tickets: TTicket[];
  lockedInBoards: TLockedInBoard[];
  boards: TBoard[];
  currentDrawTime: string;
  selectedDrawTime: string[];
  selectedBoardIndex?: number;
  bets: TBet[];
  totalBet: number;
  transactions: TActivities[];
  isWin: boolean;
  totalWin: number;
  winCombination: string;
  isOpenBet: boolean;
};

type TActions = {
  setSelectedBoardIndex: (index: number) => void;
  bet: (data: TBet) => void;
  handleBoards: (data: TBet) => void;
  updateBoards: (data: TBet) => void;
  clearBoard: (data?: TBoard) => void;
  handleResetBoard: () => void;
  getTotal: () => void;
  lockedIn: (amount: number) => void;
  checkWin: (combination: TResult) => void;
  incrementBet: () => void;
  decrementBet: () => void;
  handleWalletBetDeduction: (amount: number) => void;
  handleActivities: (data: TActivities) => void;
  setActivities: (transactions: any) => void;
  setIsWin: (value: boolean) => void;
  setTotalWin: (value: number) => void;
  setSelectedDrawTime: (time: string[]) => void;
  setIsOpenBet: (value: boolean) => void;
  clearTickets: () => void;
  setCurrentDrawTime: (time: string) => void;
  getDrawTime: () => void;
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
  loading: false,
  isWin: false,
  isOpenBet: false,
  totalWin: 0,
  winCombination: "",
  currentDrawTime: "",
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
  totalBet: 0,
  transactions: [],
  selectedDrawTime: [],
  setIsWin: (value: boolean) => {
    set(() => ({ isWin: value }));
  },
  setTotalWin: (value: number) => {
    set(() => ({ totalWin: value }));
  },
  setSelectedBoardIndex: (index: number) => {
    set(() => ({ selectedBoardIndex: index }));
  },
  handleWalletBetDeduction: async (amount: number) => {
    useWalletStore.getState().withdraw(amount, "Bet Deduction");
  },
  incrementBet: () => {
    const targetIndex = get().selectedBoardIndex ?? 0;
    let currentBoards = get().boards;
    let targetBoard = currentBoards[targetIndex];

    targetBoard.bet = (parseInt(targetBoard.bet) + 1).toString();
    currentBoards[targetIndex] = targetBoard;

    set(() => ({ boards: [...currentBoards] }));

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
  lockedIn: async (amount: number) => {
    set(() => ({ loading: true }));
    let ticketList: any[] = [];
    const boards = get().boards;
    const combinations = boards.map((value) => {
      if (value.status === "empty") {
        return null;
      }
      return {
        bet: value.bet,
        combinations: `${parseInt(value.combination.month)}-${
          value.combination.date
        }-${value.combination.letters.join(",")}`,
      };
    });

    const filteredCombinations = combinations.filter((value) => {
      return value !== null;
    });

    const drawtimes = get().selectedDrawTime.sort();
    const user = await supabase.auth.getUser();

    drawtimes.map(async (drawtime, index) => {
      const serial = `E${dayjs().format("YY")}-${dayjs().format(
        "MM"
      )}-${Math.floor(100000 + Math.random() * 900000)}-${dayjs().format(
        "DD"
      )}`;

      const drawNumber = `${dayjs().format("YYYYMMDD")}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      const prepData: TTicket = {
        userid: user.data.user?.id,
        boards: JSON.stringify(boards),
        serial: serial,
        drawTime: drawtime,
        drawNumber: drawNumber,
        totalBet: get().totalBet,
        combinations: JSON.stringify(filteredCombinations),
        drawCount: drawtimes.length,
      };

      const { error } = await supabase.from("tickets").insert(prepData);

      if (!error) {
        // needed for quick ticket generation
        const data = {
          ...prepData,
          dateTimePurchased: dayjs().format("YYYY-MM-DD HH:mm:ss A"),
          drawDate: dayjs().format("YYYY-MM-DD"), // can be a custom range later
        };

        if (drawtime === DrawTimes.ten) {
          ticketList[0] = drawtime === DrawTimes.ten ? data : null;
        }

        if (drawtime === DrawTimes.two) {
          ticketList[1] = drawtime === DrawTimes.two ? data : null;
        }

        if (drawtime === DrawTimes.five) {
          ticketList[2] = drawtime === DrawTimes.five ? data : null;
        }

        if (drawtime === DrawTimes.nine) {
          ticketList[3] = drawtime === DrawTimes.nine ? data : null;
        }

        get().getTotal();

        if (index === 0) {
          get().handleWalletBetDeduction(amount);
        }
      }
    });

    set(() => ({ tickets: ticketList }));
    get().setSelectedDrawTime([]);
    get().getDrawTime();
    set(() => ({ loading: false }));
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
  clearTickets: () => {
    set(() => ({ tickets: [] }));
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

    targetboard.combination = data.combination;
    const newBet = parseInt(data.bet.toString());
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
    const draws =
      get().selectedDrawTime.length === 0 ? 1 : get().selectedDrawTime.length;

    const totalBet = currentBoard.reduce((total, next) => {
      let emptyBet = next.bet;
      if (next.bet === "") {
        emptyBet = "0";
      }
      return total + parseInt(emptyBet);
    }, 0);

    set(() => ({ totalBet: totalBet * draws }));
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
  handleActivities: (data: TActivities) => {
    const prevActivities = get().transactions;
    prevActivities.push(data);
    set(() => ({ transactions: [...prevActivities] }));
    AsyncStorage.setItem("activity", JSON.stringify(prevActivities));
  },
  setActivities: (transactions: any) => {
    set(() => ({ transactions: [...(transactions ?? [])] }));
  },
  checkWin: async (result: TResult) => {
    const user = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .eq("status", "active")
      .eq("drawTime", result.drawtime)
      .eq("userid", user.data.user?.id);

    if (!error && data.length > 0) {
      const ticketIds = data.map((obj) => obj.id);

      const forComputationData = data.map((obj) => {
        const combination = JSON.parse(obj.combinations);
        return combination.map((value: any) => {
          return {
            combinations: value.combinations,
            bet: value.bet,
            drawCount: obj.drawCount,
          };
        });
      });

      const totalWin = forComputationData.map((obj) => {
        return obj.map((value: any) => {
          const bet = value.bet;
          const combinations = value.combinations;

          // prepare result
          const explodeResult = result.result.split("-");
          const monthDate = explodeResult[0] + "-" + explodeResult[1];
          const letter = explodeResult[explodeResult.length - 1];

          // prepare ticket combinations
          const explodedCombinations = combinations.split("-");
          const monthDateCombination =
            explodedCombinations[0] + "-" + explodedCombinations[1];
          const letters = explodedCombinations[explodedCombinations.length - 1];
          const explodedLetters = letters.split(",");

          // check if the ticket won
          if (monthDate === monthDateCombination) {
            if (explodedLetters.includes(letter)) {
              const computedWin = (bet * prizeMoney) / explodedLetters.length;
              return computedWin;
            }
          }

          return 0;
        });
      });

      const actualTotalWin = totalWin.map((obj) => {
        return obj.reduce((total: number, next: number) => +total + +next, 0);
      });

      const finalTotalWin = actualTotalWin.reduce(
        (total, next) => +total + +next,
        0
      );

      if (finalTotalWin > 0) {
        useWalletStore.getState().deposit(finalTotalWin, "Deposit Winnings");
        set(() => ({ totalWin: finalTotalWin }));
        set(() => ({ isWin: true }));
        set(() => ({ totalBet: 0 }));
        set(() => ({ winCombination: result.result }));

        await supabase
          .from("tickets")
          .update({ status: "inactive" })
          .in("id", ticketIds);
      }

      set(() => ({ lockedInBoards: [] }));
    }
  },
  setSelectedDrawTime: (time: string[]) => {
    set(() => ({ selectedDrawTime: time }));
  },
  setIsOpenBet: (value: boolean) => {
    set(() => ({ isOpenBet: value }));
  },
  setCurrentDrawTime: (time: string) => {
    set(() => ({ currentDrawTime: time }));
  },
  getDrawTime: async () => {
    const prevState = get().selectedDrawTime;
    const currentTime = dayjs();
    const tenAm = currentTime
      .set("hour", 10)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);
    const twoPm = currentTime
      .set("hour", 14)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);
    const fivePm = currentTime
      .set("hour", 17)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);
    const ninePm = currentTime
      .set("hour", 21)
      .set("minute", 0)
      .set("second", 0)
      .set("millisecond", 0);

    if (currentTime.isBefore(tenAm)) {
      get().setCurrentDrawTime(DrawTimes.ten);
      if (!prevState.includes(DrawTimes.ten)) {
        prevState.push(DrawTimes.ten);
      }
    } else if (currentTime.isBefore(twoPm)) {
      get().setCurrentDrawTime(DrawTimes.two);
      if (!prevState.includes(DrawTimes.two)) {
        prevState.push(DrawTimes.two);
      }
    } else if (currentTime.isBefore(fivePm)) {
      get().setCurrentDrawTime(DrawTimes.five);
      if (!prevState.includes(DrawTimes.five)) {
        prevState.push(DrawTimes.five);
      }
    } else if (currentTime.isBefore(ninePm)) {
      get().setCurrentDrawTime(DrawTimes.nine);
      if (!prevState.includes(DrawTimes.nine)) {
        prevState.push(DrawTimes.nine);
      }
    } else {
      get().setCurrentDrawTime("");
    }
    get().getTotal();
  },
}));
