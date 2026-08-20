"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageToolbar } from "@/features/layout/components/PageToolbar";
import { TaskProperties } from "@/features/tasks/components/TaskProperties";
import { SubtasksTable } from "@/features/tasks/components/SubtasksTable";
import { TaskComments } from "@/features/tasks/components/TaskComments";
import { TaskActionsBar } from "@/features/tasks/components/TaskActionsBar";
import { TaskDetailsPanel } from "@/features/tasks/components/TaskDetailsPanel";
import { UpdatesPanel } from "@/features/tasks/components/UpdatesPanel";
import { useKanbanStore } from "@/features/tasks/store/useKanbanStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { ChevronRight } from "lucide-react";

export default function TaskDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const columns = useKanbanStore((state) => state.columns);
  const user = useAuthStore((state) => state.user);
  // The panel button in the actions bar collapses the Details rail.
  const [railOpen, setRailOpen] = useState(true);
  const addResource = useKanbanStore((state) => state.addResource);
  const removeResource = useKanbanStore((state) => state.removeResource);
  const addTask = useKanbanStore((state) => state.addTask);
  const deleteTask = useKanbanStore((state) => state.deleteTask);

  // Tasks live inside their column, so find both — the column name is the
  // task's status, shown in the Details rail.
  const found = columns
    .flatMap((column) => column.tasks.map((task) => ({ column, task })))
    .find((entry) => entry.task.id === params.id);

  if (!found) {
    return (
      <div>
        <PageToolbar>
          <div className="flex items-center gap-1 font-sans text-sm text-[var(--base-muted-foreground)]">
            <Link href="/tasks" className="hover:text-[var(--base-primary)]">
              Tasks
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[var(--base-primary)]">Not found</span>
          </div>
        </PageToolbar>
        <div className="p-6">
          <h1 className="font-sans text-2xl font-medium text-[var(--base-primary)]">
            This task no longer exists
          </h1>
          <p className="mt-2 font-sans text-sm text-[var(--base-muted-foreground)]">
            It may have been deleted.{" "}
            <Link href="/tasks" className="underline">
              Back to tasks
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const { task, column } = found;

  return (
    <div>
      <PageToolbar>
        <div className="flex items-center gap-1 font-sans text-sm text-[var(--base-muted-foreground)]">
          <Link href="/tasks" className="hover:text-[var(--base-primary)]">
            Tasks
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[var(--base-primary)]">{task.title}</span>
        </div>
      </PageToolbar>

      {/* 681 (content column) + 347 (rail) — centred so any extra width on
          large screens splits evenly outside the pair rather than opening a
          gap between them. */}
      <div className="mx-auto flex w-full flex-col lg:max-w-[1028px] lg:flex-row">
        {/* Capped at 633 (content) + 24 padding either side, so the column
            stops growing and the gap to the rail stays fixed on wide screens
            instead of absorbing all the slack. */}
        <div
          className={`min-w-0 flex-1 p-6 ${railOpen ? "lg:max-w-[681px]" : ""}`}
        >
          {/* Title + description block: 581px wide in the design, but capped
              rather than fixed so it reflows on narrow screens. */}
          <div className="flex w-full max-w-[581px] flex-col gap-1.5">
            <h1 className="font-sans text-2xl font-semibold tracking-[-0.4px] text-[var(--base-primary)]">
              {task.title}
            </h1>
            <p className="font-sans text-sm text-[var(--base-muted-foreground)]">
              {task.description ??
                "No description yet — add one from the task composer."}
            </p>
          </div>

          <TaskProperties
            assignee={task.assignee}
            dueDate={task.dueDate}
            labels={task.tags}
            resources={task.resources}
            onAddResource={(name, url) => void addResource(task.id, name, url)}
            onRemoveResource={(resourceId) =>
              void removeResource(task.id, resourceId)
            }
          />
          <SubtasksTable
            taskId={task.id}
            subtasks={task.subtasks}
            assignee={task.assignee}
          />
          <TaskComments taskId={task.id} comments={task.comments} />
        </div>

        {/* Fixed 323px rail beside the content on desktop; below it, full
            width, on narrower screens. Top padding matches the left column's,
            so the actions bar sits level with the page title. */}
        <div
          className={`flex w-full shrink-0 flex-col gap-5 p-4 lg:p-0 lg:pt-6 lg:pr-6 ${
            railOpen ? "lg:w-[347px]" : "lg:w-auto"
          }`}
        >
          <TaskActionsBar
            railOpen={railOpen}
            onToggleRail={() => setRailOpen((open) => !open)}
            onDuplicate={async () => {
              const copyId = await addTask(column.id, {
                title: `${task.title} (copy)`,
                description: task.description,
                assignee: task.assignee,
                tags: task.tags,
                priority: task.priority,
                dueDate: task.dueDateIso,
              });
              router.push(`/tasks/${copyId}`);
            }}
            onDelete={async () => {
              await deleteTask(column.id, task.id);
              router.push("/tasks");
            }}
          />
          {/* Offset so the Details card starts on the Properties row: 126px to
              that row, less the 24px page padding, the 32px actions bar and the
              20px rail gap. */}
          <div
            className={`flex-col gap-5 lg:mt-[50px] ${railOpen ? "flex" : "hidden"}`}
          >
            <TaskDetailsPanel
              taskId={task.id}
              columnId={column.id}
              status={column.title}
              priority={task.priority}
              dueDateIso={task.dueDateIso}
              assignee={task.assignee}
              labels={task.tags}
              reporter={user?.name ?? "You"}
            />
            <UpdatesPanel task={task} reporter={user?.name ?? "You"} />
          </div>
        </div>
      </div>
    </div>
  );
}
