"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/features/layout/components/Sidebar";
import { useLayoutStore } from "@/features/layout/store/useLayoutStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const sidebarOpen = useLayoutStore((state) => state.sidebarOpen);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/login");
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated || !token) {
    return null;
  }

  return (
    <div className="flex">
      {sidebarOpen && <Sidebar />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
