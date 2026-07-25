import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import SettingCard from "@/features/settings/components/SettingCard";

import BannerTable from "../components/BannerTable";
import CreateBannerDialog from "../dialogs/CreateBannerDialog";

export default function BannerListCard() {
  return (
    <SettingCard
      title="Hero Banners"
      description="Manage homepage hero banners."
    >
      <div className="space-y-5">

        <div className="flex justify-end">
          <CreateBannerDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </CreateBannerDialog>
        </div>

        <BannerTable />

      </div>
    </SettingCard>
  );
}