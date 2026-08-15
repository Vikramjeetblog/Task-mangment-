import { PageToolbar } from "@/features/layout/components/PageToolbar";
import { TaskProperties } from "@/features/tasks/components/TaskProperties";
import { SubtasksTable } from "@/features/tasks/components/SubtasksTable";
import { TaskComments } from "@/features/tasks/components/TaskComments";
import { TaskActionsBar } from "@/features/tasks/components/TaskActionsBar";
import { TaskDetailsPanel } from "@/features/tasks/components/TaskDetailsPanel";
import { UpdatesPanel } from "@/features/tasks/components/UpdatesPanel";

export default function TaskDetailPage() {
  return (
    <div>
      <PageToolbar />

      <div className="flex">
        <div className="flex-1 p-6">
          <h1 className="font-sans text-xl font-semibold text-[var(--base-primary)]">
            Write API Documentation
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Create clear and detailed API documentation to guide developers in using the inventory and sales metrics effectively.
          </p>

          <TaskProperties />
          <SubtasksTable />
          <TaskComments />
        </div>

        <div className="w-72 border-l border-gray-200 p-4">
          <TaskActionsBar />
          <TaskDetailsPanel />
          <UpdatesPanel />
        </div>
      </div>
    </div>
  );
}