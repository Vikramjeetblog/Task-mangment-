import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageToolbar } from "@/features/layout/components/PageToolbar";
import { TasksHeader } from "@/features/tasks/components/TasksHeader";
import { TasksList } from "@/features/tasks/components/TasksList";

export default function ProjectTasksPage() {
  return (
    <div>
      <PageToolbar />

      <div className="flex items-center gap-1 px-6 pt-4 text-sm text-gray-500">
        <Link href="/projects" className="hover:text-gray-700">
          Projects
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-[var(--base-primary)]">Design Homepage</span>
      </div>

      <TasksHeader />
      <TasksList />
    </div>
  );
}