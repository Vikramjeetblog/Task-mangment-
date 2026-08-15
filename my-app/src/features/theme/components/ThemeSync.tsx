"use client";

import { useEffect } from "react";
import { useThemeStore } from "../store/useThemeStore";

export function ThemeSync() {
  const mode = useThemeStore((state) => state.mode);
  const accentColor = useThemeStore((state) => state.accentColor);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.dataset.accent = accentColor;
  }, [mode, accentColor]);

  return null;
}
