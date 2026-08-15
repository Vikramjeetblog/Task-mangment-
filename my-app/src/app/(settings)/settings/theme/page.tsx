"use client";

import { Check } from "lucide-react";
import { useThemeStore, type ThemeMode } from "@/features/theme/store/useThemeStore";

const themes: { name: string; mode: ThemeMode; bg: string; border: string }[] = [
  { name: "Light", mode: "light", bg: "#FFFFFF", border: "#E5E7EB" },
  { name: "Dark", mode: "dark", bg: "#171717", border: "#171717" },
];

export default function ThemeSettingsPage() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-4 font-sans text-xl font-semibold text-[var(--base-primary)]">Theme</h1>

        <div className="flex gap-4">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => setMode(theme.mode)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className="flex h-20 w-32 items-center justify-center rounded-lg border-2"
                style={{
                  background: theme.bg,
                  borderColor: mode === theme.mode ? "var(--base-primary)" : theme.border,
                }}
              >
                {mode === theme.mode && (
                  <Check className={theme.mode === "dark" ? "h-5 w-5 text-white" : "h-5 w-5 text-black"} />
                )}
              </div>
              <span className="text-sm text-gray-600">{theme.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
