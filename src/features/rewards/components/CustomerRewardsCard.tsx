import {
  Gift,
  Trophy,
  Wallet,
  Crown,
} from "lucide-react";

import StatsCard from "@/components/dashboard/StatsCard";

import {
  useCustomerReward,
} from "../hooks";


interface Props {
  customerId: string;
}


export default function CustomerRewardsCard({
  customerId,
}: Props) {


  const {
    data,
    isLoading,
  } = useCustomerReward(customerId);



  if (isLoading) {

    return (
      <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
        Loading rewards...
      </div>
    );

  }



  if (!data) {

    return (
      <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
        This customer doesn't have a rewards wallet yet.
      </div>
    );

  }



  return (

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">


      <StatsCard

        title="Available Points"

        value={
          data.current_points ?? 0
        }

        icon={Wallet}

        iconBgColor="bg-blue-100"

      />



      <StatsCard

        title="Lifetime Points"

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

  );

}