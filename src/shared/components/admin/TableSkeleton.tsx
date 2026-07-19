interface TableSkeletonProps {
  rows?: number;
}

export default function TableSkeleton({
  rows = 6,
}: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <div className="animate-pulse">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-14 border-b bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
}