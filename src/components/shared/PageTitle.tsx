import type { ReactNode } from "react";

interface PageTitleProps {
  title: ReactNode;
  subtitle?: string;
}

export default function PageTitle({
  title,
  subtitle,
}: PageTitleProps) {
  return (
    <div>
      <div>{title}</div>

      {subtitle && (
        <p className="mt-2 text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}