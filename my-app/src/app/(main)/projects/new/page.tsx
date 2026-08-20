"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { PageToolbar } from "@/features/layout/components/PageToolbar";
import { SelectMenu } from "@/shared/components/SelectMenu";
import { DatePickerField } from "@/shared/components/DatePickerField";
import { priorityIcons, type Priority } from "@/shared/lib/priority";
import { useProjectsStore } from "@/features/projects/store/useProjectsStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

const leadOptions = ["Admin", "Designer", "QA Team", "Product", "Engineer"];

const priorityTints: Record<Priority, string> = {
  Urgent: "text-red-500",
  High: "text-red-500",
  Medium: "text-amber-500",
  Low: "text-neutral-400",
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

export default function NewProjectPage() {
  const router = useRouter();
  const addProject = useProjectsStore((state) => state.addProject);
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [lead, setLead] = useState("Admin");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCreate() {
    if (!name.trim()) {
      setError("Give the project a name before creating it.");
      return;
    }
    addProject({
      name: name.trim(),
      priority,
      lead,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    });
    router.push("/projects");
  }

  return (
    <div>
      <PageToolbar>
        <div className="flex items-center gap-1 font-sans text-sm text-[var(--base-muted-foreground)]">
          <Link href="/projects" className="hover:text-[var(--base-primary)]">
            Projects
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[var(--base-primary)]">New Project</span>
        </div>
      </PageToolbar>

      <div className="mx-auto flex w-full flex-col lg:max-w-[1028px] lg:flex-row">
        <div className="min-w-0 flex-1 p-6 lg:max-w-[681px]">
          <Link
            href="/projects"
            className="mb-6 inline-flex items-center gap-1 font-sans text-sm text-[var(--base-muted-foreground)] hover:text-[var(--base-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className="flex w-full max-w-[633px] flex-col gap-1.5">
            <input
              autoFocus
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              placeholder="Project name"
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
            <Field label="Priority">
              <SelectMenu
                value={priority}
                options={priorityOptions}
                onChange={setPriority}
                align="left"
              />
            </Field>

            <Field label="Lead">
              <SelectMenu
                value={lead}
                align="left"
                onChange={setLead}
                options={leadOptions.map((option) => ({
                  value: option,
                  label: option,
                  adornment: (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[9px] font-medium text-white">
                      {option.charAt(0)}
                    </span>
                  ),
                }))}
              />
            </Field>

            <Field label="Due Date">
              <DatePickerField value={dueDate} onChange={setDueDate} />
            </Field>

            <Field label="Reporter">
              <span className="font-sans text-sm text-[var(--base-primary)]">
                {user?.name ?? "You"}
              </span>
            </Field>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-5 p-4 lg:w-[347px] lg:p-0 lg:pt-6 lg:pr-6">
          <div className="flex flex-col gap-[9px] rounded-lg border border-[var(--base-border)] p-3">
            <p className="flex h-5 items-center font-sans text-sm font-medium text-[var(--base-primary)]">
              Summary
            </p>
            <p className="font-sans text-sm text-[var(--base-muted-foreground)]">
              {name.trim() || "Untitled project"} · {priority} ·{" "}
              {dueDate ? format(dueDate, "d MMM yyyy") : "No date"}
            </p>
          </div>

          {error && (
            <p className="font-sans text-xs text-[var(--base-destructive)]">
              {error}
            </p>
          )}

          <button
            onClick={handleCreate}
            style={{ background: "var(--accent)" }}
            className="flex h-10 items-center justify-center rounded-md font-sans text-sm font-medium text-white"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
