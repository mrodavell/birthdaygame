import { create } from "zustand";

type TResult = {
  id: number;
  result: string;
  create_at: string;
};

type TState = {
  results: TResult[];
};

type TActions = {
  setResults: (result: TResult) => void;
};

export const useResultsStore = create<TState & TActions>((set, get) => ({
  results: [],
  setResults: (result) => {
    set((state) => ({ results: [...state.results, result] }));
  },
}));
