"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMe } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Store the token first so the axios interceptor can attach it to /auth/me.
    useAuthStore.setState({ token });

    getMe()
      .then((user) => {
        setSession({ token, user });
        router.replace("/tasks");
      })
      .catch(() => {
        useAuthStore.setState({ token: null });
        router.replace("/login");
      });
  }, [router, searchParams, setSession]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-black" />
      <p className="text-sm text-gray-500">Signing you in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackHandler />
    </Suspense>
  );
}
