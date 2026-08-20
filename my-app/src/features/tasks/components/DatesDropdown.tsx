"use client";

import { useState } from "react";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";

// Scaled so the 16px chevrons draw a true 1.5px stroke (see TaskActionsBar).
const STROKE = (1.5 * 24) / 16;

// 32px cells on a 2px gutter — seven of them make the calendar 236 wide.
const cellClass =
  "flex h-8 w-8 items-center justify-center rounded-full font-sans text-sm";

export function DatesDropdown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useDismiss(open, () => setOpen(false));
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [selected, setSelected] = useState(new Date(2026, 0, 10));

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm"
      >
        <span className="flex items-center gap-1 rounded-full border border-[var(--base-border)] px-2 py-1 font-sans text-xs font-medium text-[var(--base-primary)]">
          <Calendar className="h-3.5 w-3.5" strokeWidth={(1.5 * 24) / 14} />
          {format(selected, "MMM d")}
        </span>
        <span className="text-[var(--base-muted-foreground)]">→</span>
        <span className="flex items-center gap-1 rounded-full border border-[var(--base-border)] px-2 py-1 font-sans text-xs font-medium text-[var(--base-muted-foreground)]">
          <Calendar className="h-3.5 w-3.5" strokeWidth={(1.5 * 24) / 14} />
          End
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-max rounded-lg border border-[var(--base-border)] bg-[var(--base-popover)] p-3 shadow-md">
          <div className="mb-2 flex h-8 items-center justify-between px-1">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="text-[var(--base-primary)] hover:opacity-70"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={STROKE} />
            </button>
            <span className="align-middle font-sans text-sm font-medium text-[var(--base-primary)]">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="text-[var(--base-primary)] hover:opacity-70"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={STROKE} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span
                key={d}
                className={`${cellClass} font-normal text-[var(--base-muted-foreground)]`}
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {days.map((day) => {
              const isSelected = isSameDay(day, selected);
              const outside = !isSameMonth(day, currentMonth);
              return (
                <button
                  key={day.toISOString()}
                  style={isSelected ? { background: "var(--accent)" } : undefined}
                  onClick={() => {
                    setSelected(day);
                    setOpen(false);
                  }}
                  className={`${cellClass} ${
                    isSelected
                      ? "font-medium text-white"
                      : outside
                        ? "font-normal text-[var(--base-muted-foreground)] opacity-50 hover:bg-[var(--base-accent)]"
                        : `font-normal text-[var(--base-primary)] hover:bg-[var(--base-accent)] ${
                            isToday(day) ? "bg-[var(--base-accent)]" : ""
                          }`
                  }`}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
