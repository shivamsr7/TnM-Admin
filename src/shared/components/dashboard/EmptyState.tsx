import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}