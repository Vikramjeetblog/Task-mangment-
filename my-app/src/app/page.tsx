"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export default function Home() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(token ? "/tasks" : "/login");
  }, [hasHydrated, token, router]);

  return null;
}
