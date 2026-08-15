"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTaskViewStore } from "../store/useTaskViewStore";

export  default function  SearchBox() {
  const [open, setOpen] = useState(false);
  const { query, setQuery } = useTaskViewStore();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50"
      >
        <Search className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-gray-300 px-2 py-1.5">
      <Search className="h-4 w-4 text-gray-400" />
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
      <span className="text-xs text-gray-400">⌘F</span>
    </div>
  );
}