"use client";

import type { ReactNode } from "react";
import { PanelLeft } from "lucide-react";
import { useLayoutStore } from "@/features/layout/store/useLayoutStore";

// The single top bar: sidebar toggle on the left, with the page's breadcrumb
// (when it has one) sitting inline beside it rather than on its own row.
export function PageToolbar({ children }: { children?: ReactNode }) {
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <div className="flex h-16 items-center gap-3 border-b border-[var(--base-border)] px-4">
      <button
        onClick={toggleSidebar}
        className="rounded-md p-1.5 text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
      >
        <PanelLeft className="h-4 w-4" strokeWidth={(1.5 * 24) / 16} />
      </button>
      {/* Vertical rule separating the toggle from the page's breadcrumb */}
      <span className="h-4 w-px bg-[var(--base-border)]" />
      {children}
    </div>
  );
}
