import type { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  title,
  description,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-6 shadow-sm ${className}`}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}