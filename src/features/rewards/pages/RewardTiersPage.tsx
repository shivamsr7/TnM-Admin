import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import RewardTierDialog from "../components/RewardTierDialog";
import RewardTierTable from "../components/RewardTierTable";

export default function RewardTiersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Reward Tiers
          </h1>

          <p className="text-muted-foreground">
            Manage customer reward tiers and point multipliers.
          </p>
        </div>

        <RewardTierDialog
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Tier
            </Button>
          }
        />
      </div>

      <RewardTierTable />
    </div>
  );
}