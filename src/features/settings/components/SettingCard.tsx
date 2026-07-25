import type { ReactNode } from "react";

interface SettingCardProps {
  title: string;
  description?: string;
    icon?: React.ReactNode;
  children: ReactNode;

}

export default function SettingCard({
  title,
  description,

  children,
  
}: SettingCardProps) {
  return (
    <section
      className="
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-200
        hover:border-slate-300
        hover:shadow-md
      "
    >
      <header className="border-b border-slate-100 px-8 py-6">
        <h3 className="text-xl font-semibold tracking-tight text-slate-900">
          {title}
        </h3>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </header>

      <div className="space-y-8 p-8">
        {children}
      </div>
    </section>
  );
}