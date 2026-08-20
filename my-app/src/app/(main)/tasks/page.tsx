"use client";

import { PageToolbar } from "@/features/layout/components/PageToolbar";
import { TasksHeader } from "@/features/tasks/components/TasksHeader";
import { TasksBoard } from "@/features/tasks/components/TasksBoard";
import { TasksList } from "@/features/tasks/components/TasksList";
import { useTaskViewStore } from "@/features/tasks/store/useTaskViewStore";

export default function TasksPage() {
  const view = useTaskViewStore((state) => state.view);

  return (
    <div>
      <PageToolbar />
      <TasksHeader />
      {view === "board" ? <TasksBoard /> : <TasksList />}
    </div>
  );
}
