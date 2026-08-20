"use client";

import { useState } from "react";
import { Search } from "lucide-react";

/**
 * Collapsed search button that expands into an input. The caller owns the
 * query, so the same box serves the tasks page and the projects page.
 */
export function SearchBox({
  query,
  onQueryChange,
  placeholder = "Search",
}: {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md border text-[var(--base-primary)] hover:bg-gray-50"
        aria-label="Search"
      >
        <Search className="h-4 w-4" strokeWidth={(1.5 * 24) / 16} />
      </button>
    );
  }

  return (
    <div className="flex h-8 items-center gap-2 rounded-md border px-2">
      <Search className="h-4 w-4 text-gray-400" />
      <input
        autoFocus
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onBlur={() => {
          if (!query) setOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onQueryChange("");
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        className="w-48 bg-transparent font-sans text-sm text-[var(--base-primary)] outline-none"
      />
      <span className="text-xs text-gray-400">⌘F</span>
    </div>
  );
}
