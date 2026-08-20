"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Plus, type LucideIcon } from "lucide-react";
import { priorityIcons, type Priority } from "@/shared/lib/priority";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { useProjectsStore, type Project } from "../store/useProjectsStore";
import { UserAvatar } from "@/features/auth/components/UserAvatar";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

// Scaled so the 16px icon draws a true 1.5px stroke (see TaskActionsBar).
const ACTION_STROKE = (1.5 * 24) / 16;

// Icons come from the shared map so every table draws the same glyph per level;
// the colours stay local, since this screen tints High red rather than orange.
const priorityStyles: Record<Priority, { icon: LucideIcon; color: string }> = {
  Urgent: { icon: priorityIcons.Urgent, color: "text-red-500" },
  High: { icon: priorityIcons.High, color: "text-red-500" },
  Medium: { icon: priorityIcons.Medium, color: "text-amber-500" },
  Low: { icon: priorityIcons.Low, color: "text-neutral-400" },
};

function LeadAvatar({ lead }: { lead: string }) {
  const user = useAuthStore((state) => state.user);
  if (lead === "CN") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--base-secondary)] text-[10px] font-medium text-[var(--base-muted-foreground)]">
        CN
      </div>
    );
  }

  if (lead === "+") {
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed text-[var(--base-muted-foreground)]">
        <Plus className="h-3 w-3" />
      </div>
    );
  }

  return (
    <UserAvatar user={user} size={24} />
  );
}

/** Row menu — deleting is the only action so far. */
function RowActions({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="ml-auto block text-[var(--base-primary)] hover:opacity-70"
        aria-label="Project actions"
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={ACTION_STROKE} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-32 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md">
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full rounded-md px-3 py-2 text-left font-sans text-xs font-medium text-[var(--base-destructive)] hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export function ProjectsTable() {
  const projects = useProjectsStore((state) => state.projects);
  const addProject = useProjectsStore((state) => state.addProject);
  const deleteProject = useProjectsStore((state) => state.deleteProject);
  const query = useProjectsStore((state) => state.query);
  const priorityFilter = useProjectsStore((state) => state.priorityFilter);
  const loading = useProjectsStore((state) => state.loading);
  const error = useProjectsStore((state) => state.error);

  const [adding, setAdding] = useState(false);
  const [draftName, setDraftName] = useState("");

  const visible: Project[] = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(query.toLowerCase()) &&
      (!priorityFilter || project.priority === priorityFilter),
  );

  function commitDraft() {
    const name = draftName.trim();
    if (name) addProject({ name });
    setDraftName("");
    setAdding(false);
  }

  return (
    <div className="px-4 sm:px-6">
      {/* Table scrolls sideways on narrow screens instead of squashing the columns */}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr style={{ background: "var(--base-accent)" }}>
              {["Projects", "Priority", "Lead", "Due Date", "Actions"].map(
                (heading) => (
                  <th
                    key={heading}
                    className={`px-4 py-3 align-middle font-sans text-sm font-medium text-[var(--base-primary)] ${
                      heading === "Actions" ? "text-right" : ""
                    }`}
                  >
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr style={{ borderTop: "1px solid var(--base-border)" }}>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center align-middle font-sans text-sm text-[var(--base-muted-foreground)]"
                >
                  {error ??
                    (loading
                      ? "Loading projects…"
                      : query || priorityFilter
                        ? "No projects match the current filters"
                        : "No projects yet")}
                </td>
              </tr>
            )}

            {visible.map((project) => {
              const { icon: PriorityIcon, color } =
                priorityStyles[project.priority];
              return (
                <tr
                  key={project.id}
                  style={{ borderTop: "1px solid var(--base-border)" }}
                >
                  <td className="px-4 py-3">
                    <Link
                      href="/projects/1"
                      className="align-middle font-sans text-sm font-medium text-[var(--base-primary)] hover:underline"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`flex items-center gap-1.5 font-sans text-sm ${color}`}
                    >
                      <PriorityIcon className="h-3.5 w-3.5" />
                      {project.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <LeadAvatar lead={project.lead} />
                  </td>
                  <td className="px-4 py-3 align-middle font-sans text-sm font-normal text-[var(--base-primary)]">
                    {project.dueDate}
                  </td>
                  <td className="px-4 py-3 text-right align-middle">
                    <RowActions onDelete={() => deleteProject(project.id)} />
                  </td>
                </tr>
              );
            })}

            {/* Sits inside the table as the final row, matching the design */}
            <tr style={{ borderTop: "1px solid var(--base-border)" }}>
              <td colSpan={5} className="px-4 py-3">
                {adding ? (
                  <input
                    autoFocus
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    onBlur={commitDraft}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") commitDraft();
                      if (event.key === "Escape") {
                        setDraftName("");
                        setAdding(false);
                      }
                    }}
                    placeholder="Project name"
                    className="h-6 w-full font-sans text-xs font-medium text-[var(--base-primary)] outline-none placeholder:text-[var(--base-muted-foreground)]"
                  />
                ) : (
                  <button
                    onClick={() => setAdding(true)}
                    className="flex h-6 items-center gap-1 align-middle font-sans text-xs font-medium text-[var(--base-primary)] hover:underline"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Projects
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
