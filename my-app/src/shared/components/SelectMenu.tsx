"use client";

import { useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useDismiss } from "@/shared/hooks/useDismiss";

const STROKE = (1.5 * 24) / 16;

export type SelectOption<T extends string> = {
  value: T;
  label: string;
  /** Optional leading mark — an icon, a status dot, an avatar. */
  adornment?: ReactNode;
  /** Tailwind text colour for the label, e.g. priority tints. */
  className?: string;
};

/**
 * Small single-choice menu used across the detail rails and the create forms:
 * a compact trigger showing the current value, and a popover of options.
 */
export function SelectMenu<T extends string>({
  value,
  options,
  onChange,
  placeholder = "Select",
  align = "right",
}: {
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  const selected = options.find((option) => option.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 font-sans text-sm ${
          selected?.className ?? "text-[var(--base-primary)]"
        }`}
      >
        {selected?.adornment}
        {selected?.label ?? (
          <span className="text-[var(--base-muted-foreground)]">
            {placeholder}
          </span>
        )}
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={STROKE} />
      </button>

      {open && (
        <div
          className={`absolute z-30 mt-2 w-48 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 font-sans text-sm hover:bg-gray-50 ${
                option.className ?? "text-[var(--base-primary)]"
              }`}
            >
              <span className="flex items-center gap-2">
                {option.adornment}
                {option.label}
              </span>
              {option.value === value && (
                <Check
                  className="h-4 w-4"
                  style={{ color: "var(--accent)" }}
                  strokeWidth={STROKE}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
