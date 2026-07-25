import PageHeader from "@/components/shared/PageHeader";

import NotifyStats from "../components/NotifyStats";
import NotifyTable from "../components/NotifyTable";

import { useNotifyRequests } from "../hooks/useNotify";

export default function NotifyRequestsPage() {
  const {
    data: requests = [],
  } = useNotifyRequests();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notify Me"
        subtitle="Customers waiting for out-of-stock products."
      />

      <NotifyStats />

      <NotifyTable
        requests={requests}
      />
    </div>
  );
}