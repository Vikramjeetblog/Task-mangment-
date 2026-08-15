import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

export const ACCENT_COLORS = [
  { name: "Amber", value: "#F59E0B" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Emerald", value: "#10B981" },
  { name: "Black", value: "#171717" },
] as const;

export type AccentColorName = (typeof ACCENT_COLORS)[number]["name"];

type ThemeStore = {
  mode: ThemeMode;
  accentColor: AccentColorName;
  setMode: (mode: ThemeMode) => void;
  setAccentColor: (name: AccentColorName) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: "light",
      accentColor: "Blue",
      setMode: (mode) => set({ mode }),
      setAccentColor: (accentColor) => set({ accentColor }),
    }),
    { name: "theme-storage" },
  ),
);
