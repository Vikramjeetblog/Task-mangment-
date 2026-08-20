/**
 * Grey placeholder blocks shown while data loads. Sized to match the real
 * content so the layout doesn't jump when it arrives.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[var(--base-secondary)] ${className}`}
    />
  );
}

/** Placeholder for one board column: a heading and a few cards. */
export function ColumnSkeleton() {
  return (
    <div
      className="flex w-72 flex-shrink-0 flex-col gap-3 rounded-lg p-3"
      style={{
        background: "var(--base-accent)",
        border: "1px solid var(--base-border)",
      }}
    >
      <Skeleton className="h-5 w-24" />
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="flex flex-col gap-2 rounded-md p-3"
          style={{
            background: "var(--base-background)",
            border: "1px solid var(--base-border)",
          }}
        >
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Placeholder rows for a table, matching the 44px row rhythm. */
export function TableSkeleton({
  rows = 3,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-[var(--base-border)]"
          style={{ height: 44 }}
        >
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <td key={columnIndex} className="p-3">
              <Skeleton className="h-4 w-20" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
