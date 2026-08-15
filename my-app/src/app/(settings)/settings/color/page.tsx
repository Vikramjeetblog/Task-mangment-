"use client";

import { Check } from "lucide-react";
import { ACCENT_COLORS, useThemeStore } from "@/features/theme/store/useThemeStore";

export default function ColorSettingsPage() {
  const accentColor = useThemeStore((state) => state.accentColor);
  const setAccentColor = useThemeStore((state) => state.setAccentColor);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-4 font-sans text-xl font-semibold text-[var(--base-primary)]">Color Mode</h1>

        <div className="flex flex-col gap-1 rounded-lg border border-gray-200 p-2">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => setAccentColor(c.name)}
              className="flex items-center justify-between rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full" style={{ background: c.value }} />
                {c.name}
              </span>
              {accentColor === c.name && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
