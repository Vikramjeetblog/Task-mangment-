"use client";

import { useState } from "react";
import { IconBrandPrisma } from "@tabler/icons-react";
import { RiGoogleFill } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { guestLogin, googleLoginUrl } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const PRESENCE_COLORS = ["#F97316", "#EC4899", "#171717"];

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
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-[var(--base-popover)] px-4">
      {/* Decorative presence avatar, top-right */}
      <div className="pointer-events-none absolute right-6 top-6 hidden sm:right-10 sm:top-10 md:block lg:right-24 lg:top-24">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-medium text-white shadow-sm"
          style={{ background: PRESENCE_COLORS[2] }}
        >
          M
        </div>
      </div>

      {/* Decorative presence avatar stack, bottom-right */}
      <div className="pointer-events-none absolute bottom-10 right-8 hidden sm:right-16 sm:bottom-16 md:flex lg:right-28 lg:bottom-28">
        <div className="flex -space-x-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-white shadow-sm"
            style={{ background: "#10B981" }}
          >
            <svg
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
            style={{ background: PRESENCE_COLORS[0] }}
          />
          <div
            className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
            style={{ background: PRESENCE_COLORS[2] }}
          />
        </div>
      </div>

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
