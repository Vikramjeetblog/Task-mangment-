"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SettingsSidebar } from "@/features/settings/components/SettingsSidebar";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { getMe } from "@/features/auth/api/auth.api";
import type { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  // Settings page reads the logged-in user, so it needs the same guard as (main).
  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => {
        logout();
        router.replace("/login");
      });
  }, [hasHydrated, token, router, setUser, logout]);

  if (!hasHydrated || !token) {
    return null;
  }

  return (
    <div className="flex flex-col md:h-screen md:flex-row md:overflow-hidden">
      <SettingsSidebar />
      <main className="min-w-0 flex-1 md:overflow-y-auto">{children}</main>
    </div>
  );
}
