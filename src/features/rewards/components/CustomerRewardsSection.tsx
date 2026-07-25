import {
  Crown,
  Gift,
  Trophy,
  Wallet,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";

import LoadingSpinner from "@/shared/components/LoadingSpinner";

import {
  useCustomerReward,
} from "../hooks";

import CustomerRewardHistory from "./CustomerRewardHistory";


interface Props {
  customerId: string;
}


export default function CustomerRewardsSection({
  customerId,
}: Props) {


  const {
    data,
    isLoading,
  } = useCustomerReward(customerId);



  if (isLoading) {

    return <LoadingSpinner />;

  }



  if (!data) {

    return (

      <div className="rounded-xl border bg-white p-8 text-center text-gray-500">

        Customer has no reward wallet yet.

      </div>

    );

  }



  return (

    <div className="space-y-5">


      <h2 className="text-xl font-semibold">

        Rewards

      </h2>




      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">


        <StatsCard

          title="Available"

          value={
            data.current_points ?? 0
          }

          icon={Wallet}

          iconBgColor="bg-blue-100"

        />



        <StatsCard

          title="Lifetime"

          value={
            data.lifetime_earned ?? 0
          }

          icon={Gift}

          iconBgColor="bg-green-100"

        />



        <StatsCard

          title="Redeemed"

          value={
            data.lifetime_redeemed ?? 0
          }

          icon={Trophy}

          iconBgColor="bg-yellow-100"

        />



        <StatsCard

          title="Tier"

          value={
            data.tier?.tier_name ?? "Silver"
          }

          icon={Crown}

          iconBgColor="bg-purple-100"

        />


      </div>




      <CustomerRewardHistory

        customerId={customerId}

      />


    </div>

  );

}