"use client";

import { useState } from "react";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { ChevronUp, Check } from "lucide-react";
import { priorityIcons } from "@/shared/lib/priority";

// Each level has its own signal glyph — bars fill up as the priority rises —
// and "No Priority" is a plain dot rather than an icon.
const priorityOptions = [
  // "No Priority" reads in the default text colour — only its dot is muted.
  { label: "No Priority", color: "text-[var(--base-primary)]", icon: null },
  { label: "Urgent", color: "text-red-500", icon: priorityIcons.Urgent },
  { label: "High", color: "text-orange-500", icon: priorityIcons.High },
  { label: "Medium", color: "text-amber-500", icon: priorityIcons.Medium },
  { label: "Low", color: "text-[var(--base-muted-foreground)]", icon: priorityIcons.Low },
];

const ICON_PX = 21.33;
const iconClass = "h-[21.33px] w-[21.33px]";
// Lucide strokes scale with the 24-unit viewBox, so a raw 1.5 renders thinner
// than 1.5px and reads grey. Scale it to the icon box for a true 1.5px stroke.
const STROKE = (1.5 * 24) / ICON_PX;

export function PriorityDropdown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useDismiss(open, () => setOpen(false));
  const [selected, setSelected] = useState("Urgent");

  const current = priorityOptions.find((p) => p.label === selected);
  const CurrentIcon = current?.icon;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-sm ${current?.color}`}
      >
        {CurrentIcon ? (
          <CurrentIcon className={iconClass} strokeWidth={STROKE} />
        ) : (
          <span className="h-1 w-1 rounded-full bg-gray-400" />
        )}
        {selected}
        {/* The chevron stays neutral — it belongs to the control, not to the
            selected priority, so it doesn't take the priority colour. */}
        <ChevronUp className="h-3.5 w-3.5 text-[var(--base-primary)]" />
      </button>

      {open && (
        <div className="absolute -left-3.5 z-20 mt-2 w-48 min-w-48 rounded-lg border border-[var(--base-border)] bg-[var(--base-popover)] p-1.5 shadow-md">
          <p className="flex h-9 items-center px-2 text-xs text-[var(--base-muted-foreground)]">
            Priority
          </p>
          {priorityOptions.map((option) => {
            const OptionIcon = option.icon;
            return (
              <button
                key={option.label}
                onClick={() => {
                  setSelected(option.label);
                  setOpen(false);
                }}
                className={`flex h-9 w-full items-center justify-between rounded-md px-2 font-sans text-sm font-normal hover:bg-[var(--base-accent)] ${option.color}`}
              >
                <span className="flex items-center gap-1.5">
                  {OptionIcon ? (
                    <OptionIcon className={iconClass} strokeWidth={STROKE} />
                  ) : (
                    <span className="h-1 w-1 rounded-full bg-gray-400" />
                  )}
                  {option.label}
                </span>
                {selected === option.label && (
                  <Check className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
