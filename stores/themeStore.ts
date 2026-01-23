import { Appearance } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mmkvJSONStateStorage } from "../services/storage/mmkvStorage";

export type ThemeMode = "light" | "dark" | "system";

type State = {
  mode: ThemeMode;
  systemPrefersDark: boolean;
};

type Actions = {
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setSystemPrefersDark: (prefersDark: boolean) => void;
  reset: () => void;
};

const initialState: State = {
  mode: "system",
  systemPrefersDark: Appearance.getColorScheme() === "dark",
};

export const useThemeStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,

      /* ---------- actions ---------- */

      setThemeMode: (mode) => set({ mode }),

      toggleTheme: () => {
        const { mode, systemPrefersDark } = get();

        if (mode === "system") {
          set({ mode: systemPrefersDark ? "light" : "dark" });
          return;
        }

        set({ mode: mode === "dark" ? "light" : "dark" });
      },

      setSystemPrefersDark: (prefersDark) =>
        set({ systemPrefersDark: prefersDark }),

      reset: () =>
        set({
          ...initialState,
          systemPrefersDark: Appearance.getColorScheme() === "dark",
        }),
    }),
    {
      name: "theme-storage",
      storage: mmkvJSONStateStorage,

      partialize: (state) => ({
        mode: state.mode,
      }),

      version: 1,
    },
  ),
);
