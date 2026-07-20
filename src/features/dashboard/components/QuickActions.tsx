

import QuickActionCard from "./QuickActionCard";
import { quickActions } from "./quick-Actions";


export default function QuickActions() {

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Frequently used shortcuts
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
  <QuickActionCard
    key={action.title}
    title={action.title}
    icon={action.icon}
    path={action.path}
  />
))}
      </div>
    </div>
  );
}