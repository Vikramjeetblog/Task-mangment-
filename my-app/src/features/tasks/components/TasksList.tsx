"use client";

import { useState } from "react";
import { ChevronDown, SignalHigh } from "lucide-react";
import { useTaskViewStore } from "../store/useTaskViewStore";

const groups = [
  { title: "To Do" },
  { title: "Doing" },
  { title: "Completed" },
];

const rows = [
  { task: "Design Homepage", priority: "High", dueDate: "12 Sep 2026" },
  { task: "Develop Login Feature", priority: "Low", dueDate: "15 Sep 2026" },
  { task: "Test Payment Gateway", priority: "Medium", dueDate: "18 Sep 2026" },
];

export function TasksList() {
  const { query, visibleFields } = useTaskViewStore();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const filteredRows = rows.filter((row) =>
    row.task.toLowerCase().includes(query.toLowerCase())
  );

  function toggleGroup(title: string) {
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <div className="flex flex-col gap-6 px-6 pb-6">
      {groups.map((group) => {
        if (filteredRows.length === 0) return null;
        const isCollapsed = collapsed[group.title];

        return (
          <div key={group.title}>
            <button
              onClick={() => toggleGroup(group.title)}
              className="font-sans mb-2 flex items-center gap-1 text-sm font-medium text-[var(--base-primary)]"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
              {group.title}
            </button>

            {!isCollapsed && (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-gray-500">
                      <th className="font-sans py-2 px-4 font-medium text-[var(--base-primary)]">Task</th>
                      {visibleFields.Priority && <th className="font-sans py-2 px-4 font-normal">Priority</th>}
                      {visibleFields.Members && <th className="font-sans py-2 px-4 font-normal">Members</th>}
                      {visibleFields["Due Date"] && <th className="font-sans py-2 px-4 font-normal">Due Date</th>}
                      <th className="font-sans py-2 px-4 font-normal">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.task} className="border-b border-gray-100">
                        <td className="py-2 px-4 text-gray-900">{row.task}</td>
                        {visibleFields.Priority && (
                          <td className="py-2 px-4">
                            <span
                              className={`flex items-center gap-1 ${
                                row.priority === "High"
                                  ? "text-red-500"
                                  : row.priority === "Medium"
                                  ? "text-orange-500"
                                  : "text-gray-400"
                              }`}
                            >
                              <SignalHigh className="h-3.5 w-3.5" />
                              {row.priority}
                            </span>
                          </td>
                        )}
                        {visibleFields.Members && (
                          <td className="py-2 px-4">
                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
                          </td>
                        )}
                        {visibleFields["Due Date"] && <td className="py-2 px-4 text-gray-500">{row.dueDate}</td>}
                        <td className="py-2 px-4 text-gray-400">···</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button className="m-3 text-sm text-gray-500 hover:text-gray-700">
                  + Add Task
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}