import { Lock, Eye, Share2, MoreHorizontal, PanelRight } from "lucide-react";

export function TaskActionsBar() {
  return (
    <div className="mb-4 flex items-center justify-end gap-2">
      <button className="flex h-8 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
        <Lock className="h-4 w-4" />
      </button>
      <button className="flex h-8 w-9 items-center justify-center gap-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
        <Eye className="h-4 w-4" />
        1
      </button>
      <button className="flex h-8 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
        <Share2 className="h-4 w-4" />
      </button>
      <button className="flex h-8 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50">
        <MoreHorizontal className="h-4 w-4" />
      </button>
      <button className="flex h-8 w-9 items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200">
        <PanelRight className="h-4 w-4" />
      </button>
    </div>
  );
}