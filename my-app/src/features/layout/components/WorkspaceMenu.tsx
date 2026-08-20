"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Settings, Check, Sun, Moon, LogOut } from "lucide-react";
import {
  ACCENT_COLORS,
  useThemeStore,
} from "@/features/theme/store/useThemeStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { UserAvatar } from "@/features/auth/components/UserAvatar";

export function WorkspaceMenu() {
  const router = useRouter();
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const accentColor = useThemeStore((state) => state.accentColor);
  const setAccentColor = useThemeStore((state) => state.setAccentColor);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const displayName = user?.name ?? "User";
  // Guest accounts don't have an email, so show that instead of a blank line.
  const secondaryLabel = user?.email ?? "Guest account";

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="absolute left-2 top-full z-20 mt-1 w-60 min-w-48 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] py-1 shadow-md">
      {/* Identity block is centred under a large avatar, not a compact row */}
      <div className="flex flex-col items-center gap-1 border-b px-3 py-4">
        <UserAvatar user={user} size={64} />
        <p className="font-sans text-sm font-medium text-[var(--base-primary)]">
          {displayName}
        </p>
        <p className="font-sans text-xs text-[var(--base-muted-foreground)]">
          {secondaryLabel}
        </p>
      </div>

      {/* Submenu offset is 8px of visible gap plus the 5px the rows are inset */}
      <div className="mt-1 flex flex-col px-1">
        <div className="relative">
          <button
            onClick={() => setThemeMenuOpen(!themeMenuOpen)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2.5 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
          >
            <span className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Change Theme
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>

          {themeMenuOpen && (
            <div className="absolute left-full top-0 ml-[13px] flex w-44 flex-col rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md">
              <p className="px-3 py-2 font-sans text-xs text-[var(--base-muted-foreground)]">Theme</p>
              <button
                onClick={() => setMode("light")}
                className="flex items-center justify-between rounded-md px-3 py-2.5 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
              >
                <span className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </span>
                {mode === "light" && (
                  <Check className="h-4 w-4" style={{ color: "var(--accent)" }} />
                )}
              </button>
              <button
                onClick={() => setMode("dark")}
                className="flex items-center justify-between rounded-md px-3 py-2.5 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
              >
                <span className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </span>
                {mode === "dark" && (
                  <Check className="h-4 w-4" style={{ color: "var(--accent)" }} />
                )}
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setColorMenuOpen(!colorMenuOpen)}
            className="flex w-full items-center justify-between rounded-md px-3 py-2.5 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
          >
            <span className="flex items-center gap-2">
              {/* Swatch mirrors the chosen accent, not a fixed colour */}
              <span
                className="h-4 w-4 rounded-sm"
                style={{ background: "var(--accent)" }}
              />
              Color Mode
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>

          {colorMenuOpen && (
            <div className="absolute left-full top-0 ml-[13px] flex w-44 flex-col rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setAccentColor(c.name)}
                  className="flex items-center justify-between rounded-md px-3 py-2.5 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: c.value }}
                    />
                    {c.name}
                  </span>
                  {accentColor === c.name && (
                    <Check
                      className="h-4 w-4"
                      style={{ color: "var(--accent)" }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-md px-3 py-2.5 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-left font-sans text-sm text-[var(--base-destructive)] hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
