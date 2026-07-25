import PageHeader from "@/components/shared/PageHeader";
import { useHomepage } from "../hooks/useHomepage";
import BannerListCard from "../cards/BannerListCard";

export default function HomepagePage() {
  const { bannersQuery } = useHomepage();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homepage"
        subtitle="Manage homepage content and hero banners."
      />
<BannerListCard />
      <pre className="overflow-auto rounded-lg border bg-muted p-4 text-sm">
        {JSON.stringify(bannersQuery.data, null, 2)}
      </pre>
    </div>
  );
}