import type { ReactNode } from "react";

interface SettingSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function SettingSection({
  title,
  description,
  children,
}: SettingSectionProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h2>

        {description && (
          <p className="mt-2 text-sm text-gray-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}