import {
  GripVertical,
  Pencil,
} from "lucide-react";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { SECTION_CONFIG } from "../config/section.config";
import { useToggleSectionStatus } from "../hooks/useToggleSectionStatus";
import type { HomepageSection } from "../types/section.types";

interface SectionRowProps {
  section: HomepageSection;
  onEdit: (section: HomepageSection) => void;
}

export default function SectionRow({
  section,
  onEdit,
}: SectionRowProps) {
  const toggleStatus = useToggleSectionStatus();

  const config =
    SECTION_CONFIG[
      section.section_key as keyof typeof SECTION_CONFIG
    ];

  const Icon = config?.icon;

  return (
    <TableRow>
      <TableCell className="w-12">
        <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
      </TableCell>

      <TableCell>
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="rounded-lg border bg-muted p-2">
              <Icon className="h-5 w-5" />
            </div>
          )}

          <div>
            <p className="font-medium">
              {config?.title ?? section.title}
            </p>

            <p className="text-sm text-muted-foreground">
              {config?.description ??
                section.subtitle ??
                "No description"}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <Switch
            checked={section.is_enabled}
            disabled={toggleStatus.isPending}
            onCheckedChange={(checked) =>
              toggleStatus.mutate({
                id: section.id,
                is_enabled: checked,
              })
            }
          />

          <Badge
            variant={
              section.is_enabled
                ? "default"
                : "secondary"
            }
          >
            {section.is_enabled
              ? "Enabled"
              : "Disabled"}
          </Badge>
        </div>
      </TableCell>

      <TableCell>
        {section.display_order}
      </TableCell>

      <TableCell>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(section)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}