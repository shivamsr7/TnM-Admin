import {
  Card,
  CardContent,
} from "@/components/ui/card";

import SectionTable from "./SectionTable";
import type { HomepageSection } from "../types/section.types";

interface SectionListCardProps {
  sections: HomepageSection[];
  loading: boolean;
  onEdit: (section: HomepageSection) => void;
}

export default function SectionListCard({
  sections,
  loading,
  onEdit,
}: SectionListCardProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <SectionTable
          sections={sections}
          loading={loading}
          onEdit={onEdit}
        />
      </CardContent>
    </Card>
  );
}