import { ChevronDown, SignalHigh } from "lucide-react";

export function UpdatesPanel() {
  return (
    <div className="mt-3 rounded-lg border border-gray-200 p-3">
      <p className="mb-3 flex items-center gap-1 text-sm font-medium text-[var(--base-primary)]">
        <ChevronDown className="h-4 w-4" />
        Updates
      </p>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex items-start gap-2">
          <SignalHigh className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-500" />
          <div>
            <span className="font-medium text-[var(--base-primary)]">You</span>
            <p className="text-gray-500">changed priority from No priority to Ur...</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400" />
          <div>
            <span className="font-medium text-[var(--base-primary)]">You</span>
            <p className="text-gray-500">posted an update · Aug 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}