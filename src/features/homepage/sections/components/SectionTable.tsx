import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import SectionRow from "./SectionRow";
import type { HomepageSection } from "../types/section.types";

interface SectionTableProps {
  sections: HomepageSection[];
  loading: boolean;
  onEdit: (section: HomepageSection) => void;
}

export default function SectionTable({
  sections,
  loading,
  onEdit,
}: SectionTableProps) {
  if (loading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading sections...
      </div>
    );
  }

  if (!sections.length) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No sections found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12" />
          <TableHead>Section</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="w-[120px] text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {sections.map((section) => (
          <SectionRow
            key={section.id}
            section={section}
            onEdit={onEdit}
          />
        ))}
      </TableBody>
    </Table>
  );
}