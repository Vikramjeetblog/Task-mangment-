"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Eye,
  Lock,
  MoreHorizontal,
  PanelLeft,
  Share2,
  Trash2,
} from "lucide-react";
import { useDismiss } from "@/shared/hooks/useDismiss";

// Lucide strokes are expressed in its 24-unit viewBox, so they shrink with the
// icon: 1.5 in a 14px box renders 0.875px and reads grey. Scale it back up so
// the stroke is the 1.5 CSS pixels the design asks for.
const STROKE = (1.5 * 24) / 14;

const buttonClass =
  "flex h-8 w-9 items-center justify-center rounded-md border text-[var(--base-primary)] hover:bg-[var(--base-accent)]";

export function TaskActionsBar({
  railOpen,
  onToggleRail,
  onDuplicate,
  onDelete,
}: {
  railOpen: boolean;
  onToggleRail: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useDismiss(menuOpen, () => setMenuOpen(false));

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Lock and watchers are placeholders from the design — see the README */}
      <button className={buttonClass} aria-label="Lock task" disabled>
        <Lock className="h-3.5 w-3.5" strokeWidth={STROKE} />
      </button>

      <button
        className="flex h-8 w-9 items-center justify-center gap-1 rounded-md border text-sm text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
        aria-label="Watchers"
        disabled
      >
        <Eye className="h-3.5 w-3.5" strokeWidth={STROKE} />1
      </button>

      <button
        onClick={copyLink}
        className={buttonClass}
        aria-label={copied ? "Link copied" : "Copy link to this task"}
        title={copied ? "Link copied" : "Copy link to this task"}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" strokeWidth={STROKE} />
        ) : (
          <Share2 className="h-3.5 w-3.5" strokeWidth={STROKE} />
        )}
      </button>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={buttonClass}
          aria-label="More actions"
        >
          <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={STROKE} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 z-30 mt-1 w-40 rounded-md border border-[var(--base-border)] bg-[var(--base-popover)] p-1 shadow-md">
            <button
              onClick={() => {
                onDuplicate();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-sans text-xs font-medium text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
            >
              <Copy className="h-3.5 w-3.5" />
              Duplicate
            </button>
            <button
              onClick={() => {
                void copyLink();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-sans text-xs font-medium text-[var(--base-primary)] hover:bg-[var(--base-accent)]"
            >
              <Share2 className="h-3.5 w-3.5" />
              Copy link
            </button>
            <button
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-sans text-xs font-medium text-[var(--base-destructive)] hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete task
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onToggleRail}
        aria-label={railOpen ? "Hide details panel" : "Show details panel"}
        aria-pressed={railOpen}
        className={`flex h-8 w-9 items-center justify-center rounded-md text-[var(--base-primary)] ${
          railOpen ? "bg-[var(--base-secondary)] hover:bg-[var(--base-secondary)]" : "border hover:bg-[var(--base-accent)]"
        }`}
      >
        <PanelLeft className="h-3.5 w-3.5" strokeWidth={STROKE} />
      </button>
    </div>
  );
}
