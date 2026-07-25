import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  Pencil,
  Trash2,
} from "lucide-react";

import type { HomepageBanner } from "../types/homepage.types";

interface BannerRowProps {
  banner: HomepageBanner;
  dragHandle?: React.ReactNode;
}
import EditBannerDialog from "../dialogs/EditBannerDialog";
import DeleteBannerDialog from "../dialogs/DeleteBannerDialog";
import { Switch } from "@/components/ui/switch";
import { useToggleBannerStatus } from "../hooks/useToggleBannerStatus";
export default function BannerRow({
  banner,
}: BannerRowProps) {
  const toggleStatus = useToggleBannerStatus();
const {
  attributes,
  listeners,
  setNodeRef,
  transform,
  transition,
} = useSortable({
  id: banner.id,
});

const style = {
  transform: CSS.Transform.toString(transform),
  transition,
};
  return (
    <TableRow
  ref={setNodeRef}
  style={style}
>
<TableCell className="w-12">
  <button
    type="button"
    {...attributes}
    {...listeners}
    className="cursor-grab rounded p-1 hover:bg-muted active:cursor-grabbing"
  >
    <GripVertical className="h-4 w-4 text-muted-foreground" />
  </button>
</TableCell>
      {/* Banner */}
      <TableCell>
        <div className="flex items-center gap-4">

          <div className="h-16 w-28 overflow-hidden rounded-lg border bg-muted">
            {banner.desktop_image ? (
              <img
                src={banner.desktop_image}
                alt={banner.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          <div>
            <p className="font-medium">
              {banner.title}
            </p>

            {banner.subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {banner.subtitle}
              </p>
            )}
          </div>

        </div>
      </TableCell>

      {/* Status */}
      <TableCell>
  <div className="flex items-center gap-3">
    <Switch
      checked={banner.is_active}
      disabled={toggleStatus.isPending}
      onCheckedChange={(checked) =>
        toggleStatus.mutate({
          id: banner.id,
          isActive: checked,
        })
      }
    />

    <Badge
      variant={banner.is_active ? "default" : "secondary"}
    >
      {banner.is_active ? "Active" : "Inactive"}
    </Badge>
  </div>
</TableCell>

      {/* Order */}
      <TableCell>
        {banner.display_order}
      </TableCell>

      {/* Actions */}
      <TableCell>
        <div className="flex justify-end gap-2">

          <EditBannerDialog banner={banner}>
  <Button
    variant="outline"
    size="icon"
  >
    <Pencil className="h-4 w-4" />
  </Button>
</EditBannerDialog>

          <DeleteBannerDialog banner={banner}>
  <Button
    variant="destructive"
    size="icon"
  >
    <Trash2 className="h-4 w-4" />
  </Button>
</DeleteBannerDialog>

        </div>
      </TableCell>

    </TableRow>
  );
}