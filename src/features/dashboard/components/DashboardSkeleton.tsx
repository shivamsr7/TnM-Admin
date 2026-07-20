function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 w-24 rounded bg-gray-200" />

          <div className="mt-4 h-9 w-32 rounded bg-gray-200" />

          <div className="mt-5 h-4 w-40 rounded bg-gray-200" />
        </div>

        <div className="h-12 w-12 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 h-5 w-40 rounded bg-gray-200" />

      <div className="h-72 rounded-xl bg-gray-100" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 h-5 w-40 rounded bg-gray-200" />

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <div className="space-y-2">
              <div className="h-4 w-36 rounded bg-gray-200" />
              <div className="h-3 w-24 rounded bg-gray-100" />
            </div>

            <div className="h-8 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>

      {/* Sales Chart */}
      <SkeletonChart />

      {/* Tables */}
      <div className="grid gap-6 xl:grid-cols-2">
        <SkeletonTable />
        <SkeletonTable />
      </div>
    </div>
  );
}