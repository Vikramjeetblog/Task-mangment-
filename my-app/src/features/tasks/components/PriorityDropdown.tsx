"use client";

import { useState } from "react";
import { SignalHigh, ChevronUp, Check } from "lucide-react";

const priorityOptions = [
  { label: "No Priority", color: "text-gray-400" },
  { label: "Urgent", color: "text-red-500" },
  { label: "High", color: "text-orange-500" },
  { label: "Medium", color: "text-amber-500" },
  { label: "Low", color: "text-gray-400" },
];

export function PriorityDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Urgent");

  const current = priorityOptions.find((p) => p.label === selected);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-sm ${current?.color}`}
      >
        <SignalHigh className="h-3.5 w-3.5" />
        {selected}
        <ChevronUp className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          <p className="px-2 py-1 text-xs text-gray-400">Priority</p>
          {priorityOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => {
                setSelected(option.label);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-gray-50 ${option.color}`}
            >
              <span className="flex items-center gap-1.5">
                {option.label === "No Priority" ? (
                  <span className="h-1 w-1 rounded-full bg-current" />
                ) : (
                  <SignalHigh className="h-3.5 w-3.5" />
                )}
                {option.label}
              </span>
              {selected === option.label && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}