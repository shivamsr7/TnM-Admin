import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white"
        >
          {actionLabel}
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}