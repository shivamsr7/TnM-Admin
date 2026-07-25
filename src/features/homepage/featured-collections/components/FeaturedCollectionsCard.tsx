import {
  Card,
  CardContent,
} from "@/components/ui/card";

import FeaturedCollectionsTable from "./FeaturedCollectionsTable";

export default function FeaturedCollectionsCard() {
  return (
    <Card>
      <CardContent className="p-0">
        <FeaturedCollectionsTable />
      </CardContent>
    </Card>
  );
}