import { ChevronDown, Plus, Settings,Users } from "lucide-react";
import { PriorityDropdown } from "./PriorityDropdown";
import { DatesDropdown } from "./DatesDropdown";

export function TaskDetailsPanel() {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1 text-sm font-medium text-[var(--base-primary)]">
          <ChevronDown className="h-4 w-4" />
          Details
        </p>
        <div className="flex items-center gap-2 text-gray-400">
          <Plus className="h-4 w-4" />
          <Settings className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <span className="flex items-center gap-1.5 text-[var(--base-primary)]">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Backlog
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Priority</span>
          <PriorityDropdown />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Members</span>
       
<button className="flex items-center gap-1 text-sm text-[var(--base-primary)] hover:text-gray-600">
  <Users className="h-3.5 w-3.5" />
  Add members
</button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Dates</span>
          <DatesDropdown />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Labels</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Teams</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Reporter</span>
        </div>
      </div>
    </div>
  );
}