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
  deposit: (amount: number, transaction: string) => void;
  withdraw: (amount: number, transaction: string) => void;
  handleTransactions: (data: TTransactions) => void;
  setTransactions: (transactions: any) => void;
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
  deposit: (amount: number, transaction = "Deposit") => {
    const myWallet = get().wallet ?? "0.00";
    const finalAmount = parseInt(myWallet) + amount;

    set(() => ({ wallet: parseFloat(finalAmount.toString()).toFixed(2) }));
    get().setWallet(parseFloat(finalAmount.toString()).toFixed(2));

    const data: TTransactions = {
      type: transaction,
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      amount: amount,
    };
    get().handleTransactions(data);
  },
  withdraw: (amount: number, transaction = "Withdraw") => {
    const myWallet = get().wallet ?? "0.00";
    const finalAmount = parseInt(myWallet) - amount;

    set(() => ({ wallet: parseFloat(finalAmount.toString()).toFixed(2) }));
    get().setWallet(parseFloat(finalAmount.toString()).toFixed(2));

    const data: TTransactions = {
      type: transaction,
      date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      amount: amount,
    };
    get().handleTransactions(data);
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
    get().handleTransactions(data);
  },
  handleTransactions: (data: TTransactions) => {
    const prevTransactions = get().transactions;
    prevTransactions.push(data);
    set(() => ({ transactions: [...prevTransactions] }));
    AsyncStorage.setItem("transactions", JSON.stringify(prevTransactions));
  },
  setTransactions: (transactions: any) => {
    set(() => ({ transactions: [...(transactions ?? [])] }));
  },
}));
