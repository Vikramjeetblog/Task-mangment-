import {
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  type LucideIcon,
} from "lucide-react";

export type Priority = "Urgent" | "High" | "Medium" | "Low";

// One glyph per level — the signal bars fill up as the priority rises. Colours
// stay with each screen, since the same level is tinted differently between the
// projects table and the task priority menu.
export const priorityIcons: Record<Priority, LucideIcon> = {
  Urgent: Signal,
  High: SignalHigh,
  Medium: SignalMedium,
  Low: SignalLow,
};
