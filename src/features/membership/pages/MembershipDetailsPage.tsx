import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";

import MembershipSummary from "../components/MembershipSummary";
import { useMember } from "../hooks/useMembership";
import MembershipCard from "../components/MembershipCard";
import MembershipBenefits from "../components/MembershipBenefits";
import RewardHistory from "../components/RewardHistory";
export default function MembershipDetailsPage() {
  const { customerId = "" } = useParams();

  const {
    data: member,
    isLoading,
    isError,
  } = useMember(customerId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError || !member) {
    return (
      <div className="space-y-4">
        <Button
          asChild
          variant="outline"
        >
          <Link to="/membership">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="py-20 text-center">
          <h2 className="text-xl font-semibold">
            Member not found
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        asChild
        variant="outline"
      >
        <Link to="/membership">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>
<PageHeader
  title={member.customer_name}
  subtitle={`${member.tier_name} Member`}
/>

<MembershipCard member={member} />

<MembershipSummary member={member} />
      <PageHeader
        title={member.customer_name}
        subtitle={`${member.tier_name} Member`}
      />

      <MembershipSummary member={member} />
      <MembershipBenefits
  benefits={member.benefits}
/>
<RewardHistory
  customerId={member.customer_id}
/>
    </div>
  );
}