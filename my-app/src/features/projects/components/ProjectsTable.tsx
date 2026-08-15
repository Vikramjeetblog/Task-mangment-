import Link from "next/link";

const projects = [
  { name: "Design Homepage", priority: "High", lead: "avatar", dueDate: "12 Sep 2026" },
  { name: "Develop Login Feature", priority: "Low", lead: "CN", dueDate: "15 Sep 2026" },
  { name: "Test Payment Gateway", priority: "Medium", lead: "+", dueDate: "18 Sep 2026" },
];

export function ProjectsTable() {
  return (
    <div className="px-6">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 font-normal">Projects</th>
            <th className="py-2 font-normal">Priority</th>
            <th className="py-2 font-normal">Lead</th>
            <th className="py-2 font-normal">Due Date</th>
            <th className="py-2 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.name} className="border-b border-gray-100">
              <td className="py-2">
                <Link href="/projects/1" className="text-[var(--base-primary)] hover:underline">
                  {project.name}
                </Link>
              </td>
              <td
                className={`py-2 ${
                  project.priority === "High"
                    ? "text-red-500"
                    : project.priority === "Medium"
                    ? "text-orange-500"
                    : "text-gray-400"
                }`}
              >
                {project.priority}
              </td>
              <td className="py-2">
                {project.lead === "CN" ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600">
                    CN
                  </div>
                ) : project.lead === "+" ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    +
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
                )}
              </td>
              <td className="py-2 text-gray-500">{project.dueDate}</td>
              <td className="py-2 text-gray-400">···</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="mt-2 text-sm text-gray-500 hover:text-gray-700">
        + Add Projects
      </button>
    </div>
  );
}