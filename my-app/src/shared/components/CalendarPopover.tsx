"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const STROKE = (1.5 * 24) / 16;

// 32px cells on a 2px gutter — seven of them make the calendar 236 wide.
const cellClass =
  "flex h-8 w-8 items-center justify-center rounded-full font-sans text-sm";

/**
 * The month grid itself. Split from DatePickerField so it can be loaded on
 * demand — it pulls in date-fns and renders 42 cells, none of which are needed
 * until someone actually opens a picker.
 */
export function CalendarPopover({
  value,
  onPick,
}: {
  value: Date | null;
  onPick: (date: Date) => void;
}) {
  const [month, setMonth] = useState(value ?? new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  return (
    <div className="w-max">
      <div className="mb-2 flex h-8 items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setMonth(subMonths(month, 1))}
          className="text-[var(--base-primary)] hover:opacity-70"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={STROKE} />
        </button>
        <span className="align-middle font-sans text-sm font-medium text-[var(--base-primary)]">
          {format(month, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => setMonth(addMonths(month, 1))}
          className="text-[var(--base-primary)] hover:opacity-70"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={STROKE} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <span
            key={day}
            className={`${cellClass} font-normal text-[var(--base-muted-foreground)]`}
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const selected = value ? isSameDay(day, value) : false;
          const outside = !isSameMonth(day, month);
          return (
            <button
              key={day.toISOString()}
              type="button"
              style={selected ? { background: "var(--accent)" } : undefined}
              onClick={() => onPick(day)}
              className={`${cellClass} ${
                selected
                  ? "font-medium text-white"
                  : outside
                    ? "font-normal text-gray-300 hover:bg-gray-50"
                    : `font-normal text-[var(--base-primary)] hover:bg-gray-100 ${
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
  );
}
