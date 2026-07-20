interface LoadingCardProps {
  rows?: number;
}

export default function LoadingCard({
  rows = 5,
}: LoadingCardProps) {
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-6">
      <div className="mb-6 h-6 w-48 rounded bg-gray-200" />

      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="h-16 rounded-lg bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
}