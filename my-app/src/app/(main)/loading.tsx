import { ColumnSkeleton } from "@/shared/components/Skeleton";

/**
 * Shown while a route segment loads. Mirrors the board layout so the page
 * doesn't jump when the real columns arrive.
 */
export default function MainLoading() {
  return (
    <div>
      <div className="h-16 border-b border-[var(--base-border)]" />
      <div className="flex items-start gap-4 overflow-x-auto px-6 py-6">
        {[0, 1, 2, 3].map((index) => (
          <ColumnSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
