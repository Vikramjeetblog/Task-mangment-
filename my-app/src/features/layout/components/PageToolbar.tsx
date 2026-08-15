"use client";

import { PanelLeft } from "lucide-react";
import { useLayoutStore } from "@/features/layout/store/useLayoutStore";

export function PageToolbar() {
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <div className="flex items-center gap-3 border-b border-gray-200 px-4 pt-4 pb-2">
      <button
        onClick={toggleSidebar}
        className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
      >
        <PanelLeft className="h-4 w-4" />
      </button>
    </div>
  );
}