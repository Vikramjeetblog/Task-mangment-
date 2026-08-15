import { Calendar, Tag, Paperclip } from "lucide-react";

export function TaskProperties() {
  return (
    <div className="mt-6 flex flex-col gap-3 text-sm">
      <div className="flex items-center gap-4">
        <span className="w-24 flex-shrink-0 text-gray-500">Properties</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[var(--base-primary)]">
            <div className="h-4 w-4 rounded-full bg-purple-500" />
            Designer
          </div>
          <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
            <Calendar className="h-3 w-3" />
            31 Jul
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="w-24 flex-shrink-0 text-gray-500">Labels</span>
        <div className="flex flex-wrap items-center gap-2">
          {["Research", "Design", "Development", "Testing", "Deployment"].map((label) => (
            <span
              key={label}
              className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
            >
              <Tag className="h-3 w-3" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="w-24 flex-shrink-0 text-gray-500">Resources</span>
        <button className="flex items-center gap-1 text-gray-400 hover:text-gray-600">
          <Paperclip className="h-4 w-4" />
          Add document or link...
        </button>
      </div>
    </div>
  );
}