"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Settings, Check, Sun, Moon } from "lucide-react";
import { ACCENT_COLORS, useThemeStore } from "@/features/theme/store/useThemeStore";

export function WorkspaceMenu() {
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const accentColor = useThemeStore((state) => state.accentColor);
  const setAccentColor = useThemeStore((state) => state.setAccentColor);

  return (
    <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
      <div className="flex items-center gap-2 border-b border-gray-100 px-2 py-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
        <div>
          <p className="text-sm font-medium text-[var(--base-primary)]">Dexter</p>
          <p className="text-xs text-gray-400">Dexter@gmail.com</p>
        </div>
      </div>

      <div className="mt-1 flex flex-col">
        <div className="relative">
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Change Theme
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>

          {themeMenuOpen && (
            <div className="absolute left-full top-0 ml-1 flex w-40 flex-col rounded-md border border-gray-200 bg-white p-1 shadow-lg">
              <p className="px-2 py-1 text-xs text-gray-400">Theme</p>
              <button
                onClick={() => setMode("light")}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </span>
                {mode === "light" && <Check className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setMode("dark")}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </span>
                {mode === "dark" && <Check className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setColorMenuOpen(!colorMenuOpen)}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Color Mode
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </button>

          {colorMenuOpen && (
            <div className="absolute left-full top-0 ml-1 flex w-40 flex-col rounded-md border border-gray-200 bg-white p-1 shadow-lg">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setAccentColor(c.name)}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: c.value }} />
                    {c.name}
                  </span>
                  {accentColor === c.name && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
