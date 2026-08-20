"use client";

import { useState } from "react";
import { IconBrandPrisma } from "@tabler/icons-react";
import { RiGoogleFill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { guestLogin, googleLoginUrl } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export default function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGuestLogin() {
    setError(null);
    setIsGuestLoading(true);
    try {
      const session = await guestLogin();
      setSession(session);
      router.push("/tasks");
    } catch {
      setError("Couldn't sign in as guest. Please try again.");
      setIsGuestLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = googleLoginUrl();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--base-popover)] px-4">
      <div className="flex items-center justify-center gap-2">
        <div style={{ background: "var(--accent)" }}
          className="flex h-6 w-6 items-center justify-center rounded-md text-white">
          <IconBrandPrisma className="h-3.5 w-3.5" stroke={2} />
        </div>
        <span className="font-sans text-sm font-semibold leading-none text-[var(--base-foreground)]">
          Pyramid
        </span>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6 rounded-4xl border p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-sans text-center text-xl font-semibold leading-none text-[var(--base-card-foreground)]">
            Let&apos;s get back on track
          </h1>
          <p className="font-sans text-center text-sm font-normal text-[var(--base-muted-foreground)]">
            Enter your email below to login to your account.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={isGuestLoading}
            style={{ background: "var(--accent)" }}
            className="font-sans flex w-full items-center justify-center rounded-xl py-2.5 text-sm font-medium leading-none text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGuestLoading ? "Signing in…" : "Continue as Guest"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="font-sans flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium leading-none text-[var(--base-foreground)] hover:bg-[var(--base-accent)]"
          >
            <RiGoogleFill className="h-4 w-4" />
            Login with Google
          </button>
        </div>

        {error && (
          <p className="text-center text-xs font-medium text-red-500">
            {error}
          </p>
        )}
      </div>

      <p className="font-sans max-w-[200px] text-center text-xs font-normal text-[var(--base-muted-foreground)]">
        By clicking continue, you agree to our{" "}
        <a
          href="#"
          className="underline decoration-solid text-[var(--base-muted-foreground)]"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline decoration-solid text-[var(--base-muted-foreground)]"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
