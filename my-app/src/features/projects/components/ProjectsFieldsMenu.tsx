"use client";

import { useState } from "react";
import { Circle, SignalHigh, Users, Calendar, Users2, Tag, User, ChevronRight, Check } from "lucide-react";

const priorityOptions = [
  { label: "No Priority", color: "text-gray-400" },
  { label: "Urgent", color: "text-red-500" },
  { label: "High", color: "text-orange-500" },
  { label: "Medium", color: "text-amber-500" },
  { label: "Low", color: "text-gray-400" },
];

const fieldsMenu = [
  { label: "Status", icon: Circle },
  { label: "Priority", icon: SignalHigh },
  { label: "Members", icon: Users },
  { label: "Due Date", icon: Calendar },
  { label: "Teams", icon: Users2 },
  { label: "Labels", icon: Tag },
  { label: "Reporter", icon: User },
];

export function ProjectsFieldsMenu() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [priority, setPriority] = useState("Urgent");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
      >
        Fields
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          {fieldsMenu.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveItem(item.label)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <button className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
                <span className="flex items-center gap-2">
                  <item.icon className="h-3.5 w-3.5 text-gray-400" />
                  {item.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {activeItem === item.label && item.label === "Priority" && (
                <div className="absolute right-full top-0 mr-1 w-40 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                  <p className="px-2 py-1 text-xs text-gray-400">Priority</p>
                  {priorityOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => {
                        setPriority(option.label);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-gray-50 ${option.color}`}
                    >
                      {option.label}
                      {priority === option.label && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}