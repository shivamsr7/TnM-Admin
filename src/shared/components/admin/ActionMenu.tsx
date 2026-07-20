import { MoreHorizontal, type LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

export interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  destructive?: boolean;
  onClick: () => void;
}

interface ActionMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;

  extraActions?: ActionMenuItem[];
}

export default function ActionMenu({
  onView,
  onEdit,
  onDelete,
  extraActions = [],
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

        {extraActions.length > 0 && (
          <>
            <DropdownMenuSeparator />

            {extraActions.map((action) => {
              const Icon = action.icon;

              return (
                <DropdownMenuItem
                  key={action.label}
                  onClick={action.onClick}
                  className={
                    action.destructive
                      ? "text-red-600"
                      : ""
                  }
                >
                  {Icon && (
                    <Icon className="mr-2 h-4 w-4" />
                  )}

                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </>
        )}

        {onDelete && (
          <>
            {(onView || onEdit || extraActions.length > 0) && (
              <DropdownMenuSeparator />
            )}

            <DropdownMenuItem
              onClick={onDelete}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}