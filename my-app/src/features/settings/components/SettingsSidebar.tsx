"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Search, User, Sun, Palette } from "lucide-react";

const navItems = [
  { href: "/settings", label: "Profile", icon: User },
  { href: "/settings/theme", label: "Theme", icon: Sun },
  { href: "/settings/color", label: "Color", icon: Palette },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="flex w-full flex-col border-b bg-[var(--base-popover)] p-3 md:h-full md:w-64 md:border-b-0 md:border-r"
      style={{ background: "var(--base-sidebar)" }}
    >
      <Link
        href="/tasks"
        className="mb-3 flex items-center gap-1 text-sm text-[var(--base-muted-foreground)] hover:text-[var(--base-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to app
      </Link>

      <div className="relative mb-2">
        <Search className="absolute left-2 top-2 h-4 w-4 text-[var(--base-muted-foreground)]" />
        <input
          type="text"
          placeholder="Search"
          className="w-full rounded-md border py-1.5 pl-8 pr-2 text-sm outline-none"
        />
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                isActive
                  ? "bg-[var(--base-secondary)] text-[var(--base-primary)]"
                  : "text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
