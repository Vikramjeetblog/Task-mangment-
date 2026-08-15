"use client";

import { useState } from "react";
import { Columns3 } from "lucide-react";
import { useTaskViewStore } from "../store/useTaskViewStore";

const fieldOptions = ["Priority", "Members", "Due Date", "Labels", "Status", "Reporter"];

export function FieldsDropdown() {
  const [open, setOpen] = useState(false);
  const { view, setView, visibleFields, toggleField } = useTaskViewStore();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Columns3 className="h-4 w-4" />
        Fields
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
          <div className="mb-2 flex rounded-md bg-gray-100 p-1">
            <button
              onClick={() => setView("list")}
              className={`flex-1 rounded px-2 py-1 text-sm ${view === "list" ? "bg-white shadow-sm" : "text-gray-500"}`}
            >
              List
            </button>
            <button
              onClick={() => setView("board")}
              className={`flex-1 rounded px-2 py-1 text-sm ${view === "board" ? "bg-white shadow-sm" : "text-gray-500"}`}
            >
              Board
            </button>
          </div>

          <div className="flex flex-col">
            {fieldOptions.map((label) => (
              <label
                key={label}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                {label}
                <input
                  type="checkbox"
                  checked={visibleFields[label]}
                  onChange={() => toggleField(label)}
                  className="h-4 w-4 appearance-auto accent-black"
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}