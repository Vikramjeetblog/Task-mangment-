"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { Skeleton } from "@/shared/components/Skeleton";

// The month grid only loads once a picker is opened — it's the heaviest part
// of this control and most pages never open one.
const CalendarPopover = dynamic(
  () => import("./CalendarPopover").then((mod) => mod.CalendarPopover),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[264px] w-[236px]" />,
  },
);

/**
 * Date trigger + lazily loaded month calendar. Controlled, so forms and detail
 * rails can both use it: `null` renders the placeholder.
 */
export function DatePickerField({
  value,
  onChange,
  placeholder = "No date",
  variant = "pill",
}: {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  /** "pill" is the bordered chip; "plain" is bare text for table cells. */
  variant?: "pill" | "plain";
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      {variant === "plain" ? (
        // Table cells show the date as plain text, matching the design.
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`font-sans text-sm font-normal hover:underline ${
            value
              ? "text-[var(--base-primary)]"
              : "text-[var(--base-muted-foreground)]"
          }`}
        >
          {value ? format(value, "d MMM yyyy") : placeholder}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-1 rounded-full border border-[var(--base-border)] px-2 py-1 font-sans text-xs font-medium ${
            value
              ? "text-[var(--base-primary)]"
              : "text-[var(--base-muted-foreground)]"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" strokeWidth={(1.5 * 24) / 14} />
          {value ? format(value, "d MMM yyyy") : placeholder}
        </button>
      )}

      {open && (
        <div className="absolute left-0 z-30 mt-2 w-max rounded-lg border border-[var(--base-border)] bg-[var(--base-popover)] p-3 shadow-md">
          <CalendarPopover
            value={value}
            onPick={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
