import { create } from "zustand";

type TState = {
  phone?: string | number;
};

type TActions = {
  setUser: (user?: string | number) => void;
};

export const useUserStore = create<TState & TActions>((set, get) => ({
  phone: undefined,
  setUser: (user?: string | number) => {
    set(() => ({ phone: user }));
  },
}));
