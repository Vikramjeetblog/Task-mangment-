"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTaskViewStore } from "../store/useTaskViewStore";

export default function SearchBox() {
  const [open, setOpen] = useState(false);
  const { query, setQuery } = useTaskViewStore();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-md border text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
      >
        <Search className="h-4 w-4" strokeWidth={(1.5 * 24) / 16} />
      </button>
    );
  }

  return (
    <div className="flex h-8 items-center gap-2 rounded-md border px-2">
      <Search className="h-4 w-4 text-[var(--base-muted-foreground)]" />
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => {
          if (!query) setOpen(false);
        }}
        placeholder="Search"
        className="w-48 text-sm outline-none"
      />
      <span className="text-xs text-[var(--base-muted-foreground)]">⌘F</span>
    </div>
  );
}
