import { Filter, Plus, PanelLeft } from "lucide-react";
import { FieldsDropdown } from "./FieldsDropdown";
import  SearchBox  from "./SearchBox";

export function TasksHeader() {
  return (
    <div>
      

      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="font-sans text-lg font-semibold text-gray-900">Tasks</h1>
        </div>

        <div className="flex items-center gap-2">
          <SearchBox />

          <FieldsDropdown />

          <button className="rounded-md border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50">
            <Filter className="h-4 w-4" />
          </button>

          <button className="flex items-center gap-1 rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800">
            <Plus className="h-4 w-4" />
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}