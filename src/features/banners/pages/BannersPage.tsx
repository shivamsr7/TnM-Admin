import { useMemo, useState } from "react";
import { Plus, Settings2 } from "lucide-react";

import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

import BannerStats from "../components/BannerStats";
import BannerFilters from "../components/BannerFilters";
import BannerTable from "../components/BannerTable";
import BannerDialog from "../components/BannerDialog";
import DeleteBannerDialog from "../components/DeleteBannerDialog";
import HeroSettingsDialog from "../components/HeroSettingsDialog";

import { useBanners } from "../hooks/useBanners";
import type { Banner } from "../types/banner.types";

export default function BannersPage() {
  const { data = [], isLoading } = useBanners();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [selectedBanner, setSelectedBanner] =
    useState<Banner | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const filteredBanners = useMemo(() => {
    let banners = [...data];

    if (search.trim()) {
      const value = search.toLowerCase();

      banners = banners.filter(
        (banner) =>
          banner.title.toLowerCase().includes(value) ||
          banner.position.toLowerCase().includes(value)
      );
    }

    if (status !== "all") {
      banners = banners.filter((banner) =>
        status === "active"
          ? banner.is_active
          : !banner.is_active
      );
    }

    return banners;
  }, [data, search, status]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        subtitle="Manage website banners"
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setOpenSettings(true)}
            >
              <Settings2 className="mr-2 h-4 w-4" />
              Hero Settings
            </Button>

            <Button
              onClick={() => {
                setSelectedBanner(null);
                setOpenDialog(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Button>
          </div>
        }
      />

      <BannerStats banners={data} />

      <BannerFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      <BannerTable
        data={filteredBanners}
        onEdit={(banner) => {
          setSelectedBanner(banner);
          setOpenDialog(true);
        }}
        onDelete={(banner) => {
          setSelectedBanner(banner);
          setDeleteDialog(true);
        }}
      />

      <BannerDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        banner={selectedBanner}
      />

      <HeroSettingsDialog
        open={openSettings}
        onOpenChange={setOpenSettings}
      />

      <DeleteBannerDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        banner={selectedBanner}
      />
    </div>
  );
}