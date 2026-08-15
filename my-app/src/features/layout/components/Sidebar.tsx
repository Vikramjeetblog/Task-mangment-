"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, GalleryVerticalEnd, ChevronsUpDown } from "lucide-react";
import { DashboardSquare03Icon } from "hugeicons-react";
import { WorkspaceMenu } from "@/features/layout/components/WorkspaceMenu";

const navItems = [
  { href: "/tasks", label: "Tasks", icon: DashboardSquare03Icon },
  { href: "/projects", label: "Projects", icon: GalleryVerticalEnd },
];

export function Sidebar() {
  const pathname = usePathname();
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);

  return (
    <aside
      className="flex h-screen w-64 flex-col border-r border-gray-200"
      style={{ background: "var(--base-sidebar)" }}
    >
      <div className="relative p-3">
        <button
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          className="flex w-full items-center justify-between rounded-md px-2 py-1.5 hover:bg-gray-100"
        >
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-purple-500" />
            <span className="font-sans text-sm font-medium leading-none text-[var(--base-card-foreground)]">
              Dexter
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 text-[var(--base-card-foreground)]" />
        </button>

        {workspaceMenuOpen && <WorkspaceMenu />}
      </div>

      <div className="flex-1 p-3">
        <button
          onClick={() => setNavOpen(!navOpen)}
          className="mb-1 flex w-full items-center justify-between rounded-md px-2 py-1 hover:bg-gray-100"
        >
          <span className="font-sans text-sm font-medium leading-none text-[var(--base-card-foreground)]">
            Workspace
          </span>
          <ChevronDown
            className={`h-4 w-4 text-[var(--base-card-foreground)] transition-transform ${
              navOpen ? "" : "-rotate-90"
            }`}
          />
        </button>

        {navOpen && (
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium leading-none ${
                    isActive
                      ? "bg-gray-100 text-[var(--sidebar-accent-foreground)]"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <Link
        href="/settings"
        className="flex items-center gap-2 border-t border-gray-200 p-3 hover:bg-gray-100"
      >
        <div className="h-6 w-6 rounded-full bg-purple-500" />
        <span className="text-sm text-gray-700">Dexter</span>
      </Link>
    </aside>
  );
}