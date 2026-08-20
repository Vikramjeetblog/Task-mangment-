"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { priorityIcons, type Priority } from "@/shared/lib/priority";

const STROKE = (1.5 * 24) / 16;

const filterable: Priority[] = ["Urgent", "High", "Medium", "Low"];

/**
 * Funnel button that narrows a list to one priority. The caller owns the
 * selection, so tasks and projects each keep their own filter.
 */
export function PriorityFilterMenu({
  value,
  onChange,
}: {
  value: Priority | null;
  onChange: (priority: Priority | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex h-8 w-8 items-center justify-center rounded-md border text-[var(--base-primary)] hover:bg-gray-50 ${
          value ? "bg-[var(--base-secondary)]" : ""
        }`}
        aria-label="Filter by priority"
      >
        <Filter className="h-4 w-4" strokeWidth={STROKE} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md">
          <p className="px-3 py-2 font-sans text-xs text-[var(--base-muted-foreground)]">
            Priority
          </p>
          {filterable.map((priority) => {
            const Icon = priorityIcons[priority];
            return (
              <button
                key={priority}
                onClick={() => {
                  onChange(value === priority ? null : priority);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2.5 font-sans text-sm text-[var(--base-primary)] hover:bg-gray-50 ${
                  value === priority ? "font-medium" : ""
                }`}
              >
                <Icon className="h-4 w-4" />
                {priority}
              </button>
            );
          })}
          {value && (
            <button
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="w-full rounded-md px-3 py-2.5 text-left font-sans text-sm text-[var(--base-muted-foreground)] hover:bg-gray-50"
            >
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
