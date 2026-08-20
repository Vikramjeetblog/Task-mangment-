"use client";

import { useState } from "react";
import { ChevronDown, Plus, Users } from "lucide-react";
// The design specifies Phosphor's Gear here rather than a lucide icon;
// react-icons ships the Phosphor set under the `pi` namespace.
import { PiGearLight } from "react-icons/pi";
import { SelectMenu } from "@/shared/components/SelectMenu";
import { DatePickerField } from "@/shared/components/DatePickerField";
import { priorityIcons, type Priority } from "@/shared/lib/priority";
import { useKanbanStore } from "../store/useKanbanStore";

// Scaled so the 16px icon draws a true 1.5px stroke (see TaskActionsBar).
const STROKE = (1.5 * 24) / 16;

const priorityTints: Record<Priority, string> = {
  Urgent: "text-red-500",
  High: "text-orange-500",
  Medium: "text-amber-500",
  Low: "text-gray-400",
};

const priorityOptions = (["Urgent", "High", "Medium", "Low"] as Priority[]).map(
  (level) => {
    const Icon = priorityIcons[level];
    return {
      value: level,
      label: level,
      className: priorityTints[level],
      adornment: <Icon className="h-4 w-4" />,
    };
  },
);

const assigneeOptions = [
  "Admin",
  "Designer",
  "QA Team",
  "Security",
  "Product",
  "Engineer",
];

export function TaskDetailsPanel({
  taskId,
  columnId,
  status,
  priority,
  dueDateIso,
  assignee,
  labels,
  reporter,
}: {
  taskId: string;
  columnId: string;
  status: string;
  priority: Priority;
  dueDateIso?: string;
  assignee: string;
  labels: string[];
  reporter: string;
}) {
  const [expanded, setExpanded] = useState(true);
  const columns = useKanbanStore((state) => state.columns);
  const moveTask = useKanbanStore((state) => state.moveTask);
  const setTaskPriority = useKanbanStore((state) => state.setTaskPriority);
  const setTaskDueDate = useKanbanStore((state) => state.setTaskDueDate);
  const setTaskAssignee = useKanbanStore((state) => state.setTaskAssignee);

  return (
    <div className="flex flex-col gap-[9px] rounded-lg border border-[var(--base-border)] p-3">
      <div className="flex h-5 items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 align-middle font-sans text-sm font-medium text-[var(--base-primary)]"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "" : "-rotate-90"}`}
          />
          Details
        </button>
        <div className="flex items-center gap-4 text-[var(--base-primary)]">
          <button aria-label="Add field" className="hover:opacity-70">
            <Plus className="h-4 w-4" strokeWidth={STROKE} />
          </button>
          <button aria-label="Field settings" className="hover:opacity-70">
            <PiGearLight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={`flex flex-col gap-[9px] text-sm ${expanded ? "" : "hidden"}`}>
        <div className="flex min-h-7 items-center gap-2">
          <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">
            Status
          </span>
          <SelectMenu
            value={columnId}
            align="left"
            onChange={(next) => void moveTask(columnId, next, taskId)}
            options={columns.map((column) => ({
              value: column.id,
              label: column.title,
              adornment: (
                <span className="h-2 w-2 rounded-full bg-[var(--base-chart-1)]" />
              ),
            }))}
          />
        </div>

        <div className="flex min-h-7 items-center gap-2">
          <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">Priority</span>
          <SelectMenu
            value={priority}
            options={priorityOptions}
            align="left"
            onChange={(next) => void setTaskPriority(taskId, next)}
          />
        </div>

        <div className="flex min-h-7 items-center gap-2">
          <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">Members</span>

          <SelectMenu
            value={assignee === "Unassigned" ? null : assignee}
            align="left"
            placeholder="Add members"
            onChange={(next) => void setTaskAssignee(taskId, next)}
            options={assigneeOptions.map((name) => ({
              value: name,
              label: name,
              adornment: (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[9px] font-medium text-white">
                  {name.charAt(0)}
                </span>
              ),
            }))}
          />
        </div>

        <div className="flex min-h-7 items-center gap-2">
          <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">Dates</span>
          <DatePickerField
            value={dueDateIso ? new Date(dueDateIso) : null}
            onChange={(date) => void setTaskDueDate(taskId, date.toISOString())}
          />
        </div>

        <div className="flex min-h-7 items-center gap-2">
          <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">
            Labels
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {labels.length ? (
              labels.map((label) => (
                <span
                  key={label}
                  className="flex h-5 items-center gap-1 rounded-3xl bg-[var(--base-secondary)] px-2 font-sans text-xs font-medium text-[var(--base-primary)]"
                >
                  {label}
                </span>
              ))
            ) : (
              <span className="font-sans text-xs text-[var(--base-muted-foreground)]">
                None
              </span>
            )}
          </div>
        </div>

        <div className="flex min-h-7 items-center gap-2">
          <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">
            Teams
          </span>
          {/* No team registry in the API — the design doesn't go that far */}
          <span className="font-sans text-xs text-[var(--base-muted-foreground)]">
            None
          </span>
        </div>

        <div className="flex min-h-7 items-center gap-2">
          <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">
            Reporter
          </span>
          <span className="font-sans text-xs text-[var(--base-primary)]">
            {reporter}
          </span>
        </div>
      </div>
    </div>
  );
}
