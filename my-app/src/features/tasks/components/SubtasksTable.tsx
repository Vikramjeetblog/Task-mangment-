import { ChevronDown, Plus, SignalHigh } from "lucide-react";

export function SubtasksTable() {
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center gap-1 text-sm font-medium text-[var(--base-primary)]">
        <ChevronDown className="h-4 w-4" />
        Subtasks
      </div>

      <div className="rounded-lg border border-gray-200 p-3">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2 font-normal">Task</th>
              <th className="py-2 font-normal">Priority</th>
              <th className="py-2 font-normal">Members</th>
              <th className="py-2 font-normal">Due Date</th>
              <th className="py-2 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-[var(--base-primary)]">Subtask 1</td>
              <td className="py-2">
                <span className="flex items-center gap-1 text-red-500">
                  <SignalHigh className="h-3.5 w-3.5" />
                  High
                </span>
              </td>
              <td className="py-2">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
              </td>
              <td className="py-2 text-gray-500">12 Sep 2026</td>
              <td className="py-2 text-gray-400">···</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-2 text-[var(--base-primary)]">Subtask 2</td>
              <td className="py-2">
                <span className="flex items-center gap-1 text-gray-400">
                  <SignalHigh className="h-3.5 w-3.5" />
                  Low
                </span>
              </td>
              <td className="py-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium text-gray-600">
                  CN
                </div>
              </td>
              <td className="py-2 text-gray-500">15 Sep 2026</td>
              <td className="py-2 text-gray-400">···</td>
            </tr>
            <tr>
              <td className="py-2 text-[var(--base-primary)]">Subtask 3</td>
              <td className="py-2">
                <span className="flex items-center gap-1 text-orange-500">
                  <SignalHigh className="h-3.5 w-3.5" />
                  Medium
                </span>
              </td>
              <td className="py-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  +
                </div>
              </td>
              <td className="py-2 text-gray-500">18 Sep 2026</td>
              <td className="py-2 text-gray-400">···</td>
            </tr>
          </tbody>
        </table>

        <button className="mt-2 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <Plus className="h-4 w-4" />
          Add Subtasks
        </button>
      </div>
    </div>
  );
}