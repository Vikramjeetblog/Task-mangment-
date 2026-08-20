import { PageToolbar } from "@/features/layout/components/PageToolbar";
import { ProjectsHeader } from "@/features/projects/components/ProjectsHeader";
import { ProjectsTable } from "@/features/projects/components/ProjectsTable";

export default function ProjectsPage() {
  return (
    <div>
      <PageToolbar />
      <ProjectsHeader />
      <ProjectsTable />
    </div>
  );
}
