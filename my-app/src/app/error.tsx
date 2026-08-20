"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

/**
 * Route-level error boundary. Next renders this instead of the page when a
 * render or data error escapes, keeping the sidebar and shell intact.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Somewhere to hook a reporting service up later.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
      <h1 className="font-sans text-2xl font-medium text-[var(--base-primary)]">
        Something went wrong
      </h1>
      <p className="max-w-md font-sans text-sm text-[var(--base-muted-foreground)]">
        {error.message || "An unexpected error occurred while loading this page."}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={reset}
          style={{ background: "var(--accent)" }}
          className="flex h-9 items-center gap-1.5 rounded-md px-4 font-sans text-sm font-medium text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/tasks"
          className="flex h-9 items-center rounded-md border border-[var(--base-border)] px-4 font-sans text-sm font-medium text-[var(--base-primary)] hover:bg-gray-50"
        >
          Back to tasks
        </Link>
      </div>
    </div>
  );
}
