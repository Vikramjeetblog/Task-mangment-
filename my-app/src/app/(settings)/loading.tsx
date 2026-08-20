import { Skeleton } from "@/shared/components/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="px-8 pb-8 pt-[118px]">
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-[334px] w-full rounded-lg" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
