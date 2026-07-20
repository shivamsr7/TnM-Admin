import { Activity } from "lucide-react";
import ActivityItem from "./ActivityItem";
import { useRecentActivity } from "../hooks/useRecentActivity";

export default function ActivityTimeline() {
  const {
    data: activities = [],
    isLoading,
  } = useRecentActivity();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-violet-100 p-3">
          <Activity className="h-5 w-5 text-violet-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Recent Activity
          </h2>

          <p className="text-sm text-gray-500">
            Latest actions across your store
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && activities.length === 0 && (
        <div className="py-12 text-center">
          <Activity className="mx-auto mb-4 h-12 w-12 text-gray-300" />

          <h3 className="text-lg font-semibold text-gray-700">
            No Activity Yet
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Recent admin activity will appear here.
          </p>
        </div>
      )}

      {/* Activity List */}
      {!isLoading && activities.length > 0 && (
        <div className="space-y-1">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
            />
          ))}
        </div>
      )}
    </div>
  );
}