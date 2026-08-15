"use client";

import { useState } from "react";
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
  addMonths,
  subMonths,
} from "date-fns";

export function DatesDropdown() {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [selected, setSelected] = useState(new Date(2026, 0, 10));

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-sm">
        <span className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 text-gray-600">
          <Calendar className="h-3.5 w-3.5" />
          {format(selected, "MMM d")}
        </span>
        <span className="text-gray-300">→</span>
        <span className="rounded-md border border-gray-300 px-2 py-1 text-gray-400">
          End
        </span>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => {
                  setSelected(day);
                  setOpen(false);
                }}
                className={`rounded-full py-1 text-xs ${
                  isSameDay(day, selected)
                    ? "bg-black text-white"
                    : isSameMonth(day, currentMonth)
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300"
                }`}
              >
                {format(day, "d")}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}