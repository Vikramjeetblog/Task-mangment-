"use client";

import { useState } from "react";
import { useDismiss } from "@/shared/hooks/useDismiss";
import {
  Circle,
  SignalHigh,
  Users,
  Calendar,
  Tag,
  User,
  ChevronRight,
  Check,
  Columns3,
} from "lucide-react";
import { RiTeamLine } from "react-icons/ri";
import { priorityIcons } from "@/shared/lib/priority";

// Scaled so the 16px icons draw a true 1.5px stroke (see TaskActionsBar).
const STROKE = (1.5 * 24) / 16;

// Same glyphs and colours as the task priority menu; "No Priority" is a dot.
const priorityOptions = [
  {
    label: "No Priority",
    color: "text-[var(--base-primary)]",
    icon: null,
  },
  { label: "Urgent", color: "text-red-500", icon: priorityIcons.Urgent },
  { label: "High", color: "text-orange-500", icon: priorityIcons.High },
  { label: "Medium", color: "text-amber-500", icon: priorityIcons.Medium },
  { label: "Low", color: "text-[var(--base-muted-foreground)]", icon: priorityIcons.Low },
];

const fieldsMenu = [
  { label: "Status", icon: Circle },
  { label: "Priority", icon: SignalHigh },
  { label: "Members", icon: Users },
  { label: "Due Date", icon: Calendar },
  // The design names Remix Icon's team-line for this row
  { label: "Teams", icon: RiTeamLine },
  { label: "Labels", icon: Tag },
  { label: "Reporter", icon: User },
];

export function ProjectsFieldsMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useDismiss(open, () => setOpen(false));
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [priority, setPriority] = useState("Urgent");

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 items-center gap-1.5 rounded-md border px-3 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
      >
        <Columns3 className="h-4 w-4" strokeWidth={STROKE} />
        Fields
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md">
          {fieldsMenu.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveItem(item.label)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <button className="flex w-full items-center justify-between rounded-md px-3 py-2.5 font-sans text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]">
                <span className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" strokeWidth={STROKE} />
                  {item.label}
                </span>
                <ChevronRight className="h-4 w-4" strokeWidth={STROKE} />
              </button>

              {/* Opens to the left — this menu sits at the right edge of the
                  page — with 8px of gap, matching the workspace menu */}
              {activeItem === item.label && item.label === "Priority" && (
                <div className="absolute right-full top-0 mr-[13px] w-48 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md">
                  <p className="px-3 py-2 font-sans text-xs text-[var(--base-muted-foreground)]">
                    Priority
                  </p>
                  {priorityOptions.map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <button
                        key={option.label}
                        onClick={() => {
                          setPriority(option.label);
                          setOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 font-sans text-sm hover:bg-[var(--base-accent)] ${option.color}`}
                      >
                        <span className="flex items-center gap-2">
                          {OptionIcon ? (
                            <OptionIcon
                              className="h-4 w-4"
                              strokeWidth={STROKE}
                            />
                          ) : (
                            <span className="h-1 w-1 rounded-full bg-gray-400" />
                          )}
                          {option.label}
                        </span>
                        {priority === option.label && (
                          <Check
                            className="h-4 w-4"
                            style={{ color: "var(--accent)" }}
                            strokeWidth={STROKE}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
