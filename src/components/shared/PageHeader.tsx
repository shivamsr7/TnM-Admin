import type { ReactNode } from "react";
import PageTitle from "./PageTitle";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <PageTitle title={title} subtitle={subtitle} />

      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}