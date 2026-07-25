import PageHeader from "@/components/shared/PageHeader";

import MembershipStats from "../components/MembershipStats";
import { MembershipTable } from "../components/MembershipTable";

import { useMembers } from "../hooks";

export default function MembersPage() {
  const {
    data = [],
    isLoading,
  } = useMembers();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membership"
        subtitle="Manage customer memberships and loyalty tiers."
      />

      <MembershipStats />

<MembershipTable
  data={data}
/>

      
    </div>
  );
}