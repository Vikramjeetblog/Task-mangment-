"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
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
 *
 * Days before `minDate` are unselectable. Due dates default to "today or
 * later", since a task can't fall due in the past.
 */
export function CalendarPopover({
  value,
  onPick,
  minDate = startOfDay(new Date()),
}: {
  value: Date | null;
  onPick: (date: Date) => void;
  minDate?: Date;
}) {
  const [month, setMonth] = useState(value ?? new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });

  // Nothing to reach by paging further back once the grid holds minDate's
  // month, so the chevron turns off rather than scrolling through empty years.
  const atFloor = !isBefore(startOfMonth(minDate), startOfMonth(month));

  return (
    <div className="w-max">
      <div className="mb-2 flex h-8 items-center justify-between px-1">
        <button
          type="button"
          onClick={() => setMonth(subMonths(month, 1))}
          disabled={atFloor}
          className="text-[var(--base-primary)] hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:opacity-30"
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
          const disabled = isBefore(day, minDate);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              aria-disabled={disabled}
              style={selected ? { background: "var(--accent)" } : undefined}
              onClick={() => onPick(day)}
              className={`${cellClass} ${
                selected
                  ? "font-medium text-white"
                  : disabled
                    ? "cursor-not-allowed font-normal text-[var(--base-muted-foreground)] opacity-30"
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
  );
}
