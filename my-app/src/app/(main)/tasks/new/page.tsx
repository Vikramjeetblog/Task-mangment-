"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight, Plus, Tag, X } from "lucide-react";
import { PageToolbar } from "@/features/layout/components/PageToolbar";
import { SelectMenu } from "@/shared/components/SelectMenu";
import { DatePickerField } from "@/shared/components/DatePickerField";
import { priorityIcons, type Priority } from "@/shared/lib/priority";
import { useKanbanStore } from "@/features/tasks/store/useKanbanStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const assigneeOptions = [
  "Admin",
  "Designer",
  "QA Team",
  "Security",
  "Product",
  "Engineer",
];

const priorityTints: Record<Priority, string> = {
  Urgent: "text-red-500",
  High: "text-orange-500",
  Medium: "text-amber-500",
  Low: "text-gray-400",
};

const priorityOptions = (["Urgent", "High", "Medium", "Low"] as Priority[]).map(
  (priority) => {
    const Icon = priorityIcons[priority];
    return {
      value: priority,
      label: priority,
      className: priorityTints[priority],
      adornment: <Icon className="h-4 w-4" />,
    };
  },
);

/** Commas separate labels, so one field can add several at once. */
function splitLabels(input: string): string[] {
  return input
    .split(",")
    .map((label) => label.trim())
    .filter(Boolean);
}

/** One labelled row in the left column, matching the task detail layout. */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-9 items-center gap-4">
      <span className="w-24 flex-shrink-0 font-sans text-sm font-medium text-gray-500">
        {label}
      </span>
      {children}
    </div>
  );
}

function NewTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const columns = useKanbanStore((state) => state.columns);
  const addTask = useKanbanStore((state) => state.addTask);
  const addSubtask = useKanbanStore((state) => state.addSubtask);
  const user = useAuthStore((state) => state.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // A board column can deep-link here with ?status=doing so the new task
  // lands where the user clicked. Unknown values fall back to the first column.
  const [status, setStatus] = useState(
    columns.find((column) => column.id === searchParams.get("status"))?.id ??
      columns[0]?.id ??
      "todo",
  );
  const [priority, setPriority] = useState<Priority>("Medium");
  const [assignee, setAssignee] = useState("Admin");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [labelDraft, setLabelDraft] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [subtaskDraft, setSubtaskDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const statusOptions = columns.map((column) => ({
    value: column.id,
    label: column.title,
    adornment: (
      <span className="h-2 w-2 rounded-full bg-[var(--base-chart-1)]" />
    ),
  }));

  function addLabel() {
    const staged = splitLabels(labelDraft);
    if (staged.length) {
      setLabels((current) => [
        ...current,
        ...staged.filter((label) => !current.includes(label)),
      ]);
    }
    setLabelDraft("");
  }

  function stageSubtask() {
    const value = subtaskDraft.trim();
    if (!value) return;
    setSubtasks((current) => [...current, value]);
    setSubtaskDraft("");
  }

  async function handleCreate() {
    if (!title.trim()) {
      setError("Give the task a title before creating it.");
      return;
    }
    setSaving(true);
    try {
      // The task has to exist before its subtasks can hang off it.
      // Text still in the draft fields counts as entered — clicking Create
      // shouldn't silently discard it.
      const pendingLabels = splitLabels(labelDraft).filter(
        (label) => !labels.includes(label),
      );
      const pendingSubtask = subtaskDraft.trim();
      const allSubtasks = pendingSubtask ? [...subtasks, pendingSubtask] : subtasks;

      const taskId = await addTask(status, {
        title: title.trim(),
        description: description.trim() || undefined,
        assignee,
        tags: [...labels, ...pendingLabels],
        priority,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      });
      for (const subtask of allSubtasks) {
        await addSubtask(taskId, subtask);
      }
      router.push("/tasks");
    } catch {
      setError("Couldn't create the task. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div>
      <PageToolbar>
        <div className="flex items-center gap-1 font-sans text-sm text-[var(--base-muted-foreground)]">
          <Link href="/tasks" className="hover:text-[var(--base-primary)]">
            Tasks
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[var(--base-primary)]">New Task</span>
        </div>
      </PageToolbar>

      <div className="mx-auto flex w-full flex-col lg:max-w-[1028px] lg:flex-row">
        <div className="min-w-0 flex-1 p-6 lg:max-w-[681px]">
          <Link
            href="/tasks"
            className="mb-6 inline-flex items-center gap-1 font-sans text-sm text-[var(--base-muted-foreground)] hover:text-[var(--base-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Link>

          <div className="flex w-full max-w-[633px] flex-col gap-1.5">
            <input
              autoFocus
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(null);
              }}
              placeholder="Task title"
              className="w-full bg-transparent font-sans text-2xl font-semibold tracking-[-0.4px] text-[var(--base-primary)] outline-none placeholder:text-gray-300"
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a description..."
              rows={2}
              className="w-full resize-none bg-transparent font-sans text-sm text-[var(--base-muted-foreground)] outline-none placeholder:text-gray-300"
            />
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Field label="Properties">
              <div className="flex flex-wrap items-center gap-2">
                <SelectMenu
                  value={assignee}
                  align="left"
                  onChange={setAssignee}
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
                <DatePickerField value={dueDate} onChange={setDueDate} />
              </div>
            </Field>

            <Field label="Labels">
              <div className="flex flex-wrap items-center gap-2">
                {labels.map((label) => (
                  <span
                    key={label}
                    className="flex h-5 items-center gap-1 rounded-3xl border border-transparent bg-[var(--base-secondary)] px-2 font-sans text-xs font-medium text-[var(--base-primary)]"
                  >
                    <Tag className="h-3 w-3" />
                    {label}
                    <button
                      type="button"
                      onClick={() =>
                        setLabels((current) =>
                          current.filter((item) => item !== label),
                        )
                      }
                      aria-label={`Remove ${label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input
                  value={labelDraft}
                  onChange={(event) => setLabelDraft(event.target.value)}
                  onBlur={addLabel}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addLabel();
                    }
                  }}
                  placeholder="Add label..."
                  className="h-7 w-28 rounded-md border border-[var(--base-border)] px-2 font-sans text-xs text-[var(--base-primary)] outline-none placeholder:text-[var(--base-muted-foreground)]"
                />
              </div>
            </Field>

            <Field label="Subtasks">
              <div className="flex w-full flex-col gap-2">
                {subtasks.map((subtask, index) => (
                  <div
                    key={`${subtask}-${index}`}
                    className="flex items-center justify-between rounded-md border border-[var(--base-border)] px-3 py-2 font-sans text-xs font-medium text-[var(--base-primary)]"
                  >
                    {subtask}
                    <button
                      type="button"
                      onClick={() =>
                        setSubtasks((current) =>
                          current.filter((_, i) => i !== index),
                        )
                      }
                      aria-label={`Remove ${subtask}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {/* Enter or the Add button stages one; repeat for as many as
                    the task needs. They're created after the task itself. */}
                <div className="flex items-center gap-2">
                  <input
                    value={subtaskDraft}
                    onChange={(event) => setSubtaskDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        stageSubtask();
                      }
                    }}
                    placeholder="Add a subtask, then press Enter"
                    className="h-9 w-full rounded-md border border-[var(--base-border)] px-3 font-sans text-sm text-[var(--base-primary)] outline-none placeholder:text-[var(--base-muted-foreground)]"
                  />
                  <button
                    type="button"
                    onClick={stageSubtask}
                    disabled={!subtaskDraft.trim()}
                    className="flex h-9 shrink-0 items-center gap-1 rounded-md border border-[var(--base-border)] px-3 font-sans text-xs font-medium text-[var(--base-primary)] hover:bg-[var(--base-accent)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                {subtasks.length > 0 && (
                  <p className="font-sans text-xs font-normal text-[var(--base-muted-foreground)]">
                    {subtasks.length} subtask{subtasks.length === 1 ? "" : "s"} will be created with this task
                  </p>
                )}
              </div>
            </Field>
          </div>
        </div>

        {/* Details rail — same card as the task detail page, but editable */}
        <div className="flex w-full shrink-0 flex-col gap-5 p-4 lg:w-[347px] lg:p-0 lg:pt-6 lg:pr-6">
          <div className="flex flex-col gap-[9px] rounded-lg border border-[var(--base-border)] p-3">
            <p className="flex h-5 items-center font-sans text-sm font-medium text-[var(--base-primary)]">
              Details
            </p>

            <div className="flex flex-col gap-[9px] text-sm">
              <div className="flex min-h-7 items-center gap-2">
                <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">
                  Status
                </span>
                <SelectMenu
                  value={status}
                  options={statusOptions}
                  onChange={setStatus}
                  align="left"
                />
              </div>

              <div className="flex min-h-7 items-center gap-2">
                <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">
                  Priority
                </span>
                <SelectMenu
                  value={priority}
                  options={priorityOptions}
                  onChange={setPriority}
                  align="left"
                />
              </div>

              <div className="flex min-h-7 items-center gap-2">
                <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">
                  Members
                </span>
                <SelectMenu
                  value={assignee}
                  align="left"
                  onChange={setAssignee}
                  options={assigneeOptions.map((name) => ({
                    value: name,
                    label: name,
                  }))}
                />
              </div>

              <div className="flex min-h-7 items-center gap-2">
                <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">
                  Dates
                </span>
                <DatePickerField value={dueDate} onChange={setDueDate} />
              </div>

              <div className="flex min-h-7 items-center gap-2">
                <span className="w-24 shrink-0 font-sans text-xs font-medium leading-none text-[var(--base-primary)]">
                  Reporter
                </span>
                <span className="font-sans text-sm text-[var(--base-primary)]">
                  {user?.name ?? "You"}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <p className="font-sans text-xs text-[var(--base-destructive)]">
              {error}
            </p>
          )}

          <button
            onClick={handleCreate}
            disabled={saving}
            style={{ background: "var(--accent)" }}
            className="flex h-10 items-center justify-center rounded-md font-sans text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Creating…" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// useSearchParams needs a Suspense boundary to keep the route prerenderable.
export default function NewTaskPage() {
  return (
    <Suspense fallback={null}>
      <NewTaskForm />
    </Suspense>
  );
}
