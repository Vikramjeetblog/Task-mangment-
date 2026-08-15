import { Paperclip, SmilePlus, MoreHorizontal, Send } from "lucide-react";

export function TaskComments() {
  return (
    <div className="mt-6">
      <p className="mb-2 text-sm font-medium text-[var(--base-primary)]">Subtasks</p>

      <div className="flex flex-col gap-3">
        <div className="rounded-lg border border-gray-200">
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
                <span className="text-sm font-medium text-[var(--base-primary)]">Ankit Dutta</span>
                <span className="text-xs text-gray-400">just now</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <button className="hover:text-gray-600">
                  <SmilePlus className="h-4 w-4" />
                </button>
                <button className="hover:text-gray-600">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-700">dsds</p>
          </div>

          <div className="flex items-center gap-2 border-t border-gray-200 px-3 py-2">
            <div className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
            <input
              type="text"
              placeholder="Leave a reply..."
              className="flex-1 text-sm outline-none placeholder:text-gray-400"
            />
            <button className="text-gray-400 hover:text-gray-600">
              <Paperclip className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-4">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm outline-none placeholder:text-gray-400"
          />
          <button className="text-gray-400 hover:text-gray-600">
            <Paperclip className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}