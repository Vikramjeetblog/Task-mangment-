"use client";

import { useState } from "react";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { Check, Columns3, LayoutGrid, List } from "lucide-react";

// Scaled so the 16px icons draw a true 1.5px stroke (see TaskActionsBar).
const STROKE = (1.5 * 24) / 16;
import { useTaskViewStore } from "../store/useTaskViewStore";

const fieldOptions = [
  "Priority",
  "Members",
  "Due Date",
  "Labels",
  "Status",
  "Reporter",
];

export function FieldsDropdown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useDismiss(open, () => setOpen(false));
  const { view, setView, visibleFields, toggleField } = useTaskViewStore();

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 items-center gap-1.5 rounded-md border px-3 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
      >
        <Columns3 className="h-4 w-4" strokeWidth={(1.5 * 24) / 16} />
        Fields
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-[299px] rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-4 shadow-md">
          {/* One bordered control split into two joined halves — the selected
              half is white, the other picks up the muted fill */}
          <div className="mb-5 flex overflow-hidden rounded-md border border-[var(--base-border)]">
            <button
              onClick={() => setView("list")}
              className={`flex flex-1 items-center justify-center gap-1.5 py-2 font-sans text-sm text-[var(--base-primary)] ${
                view === "list"
                  ? "bg-[var(--base-popover)] font-medium"
                  : "bg-[var(--base-secondary)]"
              }`}
            >
              <List className="h-4 w-4" strokeWidth={STROKE} />
              List
            </button>
            <button
              onClick={() => setView("board")}
              className={`flex flex-1 items-center justify-center gap-1.5 border-l border-[var(--base-border)] py-2 font-sans text-sm text-[var(--base-primary)] ${
                view === "board"
                  ? "bg-[var(--base-popover)] font-medium"
                  : "bg-[var(--base-secondary)]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" strokeWidth={STROKE} />
              Board
            </button>
          </div>

          <div className="flex flex-col">
            {fieldOptions.map((label) => {
              const checked = visibleFields[label];
              return (
                <label
                  key={label}
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-1.5 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
                >
                  {label}
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleField(label)}
                    className="sr-only"
                  />
                  <span
                    style={checked ? { background: "var(--accent)" } : undefined}
                    className={`flex h-4 w-4 items-center justify-center rounded-[4px] ${
                      checked ? "text-white" : "bg-[var(--base-secondary)]"
                    }`}
                  >
                    {checked && (
                      <Check className="h-3 w-3" strokeWidth={(1.5 * 24) / 12} />
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
