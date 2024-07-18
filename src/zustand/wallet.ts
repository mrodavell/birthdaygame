import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { create } from "zustand";

type TTransactions = {
  type: string;
  amount: number;
  date: string;
};

type TState = {
  wallet: string | null;
  transactions: TTransactions[];
};

type TActions = {
  fetchWallet: () => void;
  setWallet: (amount: string) => void;
  betDeduction: (amount: number) => void;
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
  logTransaction: (data: TTransactions) => void;
};

export const useWalletStore = create<TState & TActions>((set, get) => ({
  wallet: "0.00",
  transactions: [],
  fetchWallet: async () => {
    const amount = await AsyncStorage.getItem("wallet");
    set(() => ({ wallet: amount }));
  },
  setWallet: async (amount: string) => {
    await AsyncStorage.setItem("wallet", amount);
  },
  deposit: (amount: number) => {
    const myWallet = get().wallet ?? "0.00";
    const finalAmount = parseInt(myWallet) + amount;

    set(() => ({ wallet: parseFloat(finalAmount.toString()).toFixed(2) }));
    get().setWallet(parseFloat(finalAmount.toString()).toFixed(2));

    const data: TTransactions = {
      type: "Deposit",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      amount: amount,
    };
    get().logTransaction(data);
  },
  withdraw: (amount: number) => {
    const myWallet = get().wallet ?? "0.00";
    const finalAmount = parseInt(myWallet) - amount;

    set(() => ({ wallet: parseFloat(finalAmount.toString()).toFixed(2) }));
    get().setWallet(parseFloat(finalAmount.toString()).toFixed(2));

    const data: TTransactions = {
      type: "Withdraw",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      amount: amount,
    };
    get().logTransaction(data);
  },
  betDeduction: (amount: number) => {
    const myWallet = get().wallet ?? "0.00";
    const finalAmount = parseInt(myWallet) - amount;

    set(() => ({ wallet: parseFloat(finalAmount.toString()).toFixed(2) }));
    get().setWallet(parseFloat(finalAmount.toString()).toFixed(2));

    const data: TTransactions = {
      type: "Bet Deduction",
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      amount: amount,
    };
    get().logTransaction(data);
  },
  logTransaction: (data: TTransactions) =>
    set((state) => ({ transactions: [...state.transactions, data] })),
}));
