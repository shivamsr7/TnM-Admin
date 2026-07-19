import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-white px-6 py-16 text-center">
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          {icon}
        </div>
      )}

      <h3 className="text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="mt-6"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}