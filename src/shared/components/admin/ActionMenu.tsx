import { MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

interface ActionMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export default function ActionMenu({
  onView,
  onEdit,
  onDelete,
}: ActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {onView && (
          <DropdownMenuItem onClick={onView}>
            View
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            Edit
          </DropdownMenuItem>
        )}

        {onDelete && (
          <DropdownMenuItem
            onClick={onDelete}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}