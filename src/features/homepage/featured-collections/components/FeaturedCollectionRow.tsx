import { forwardRef } from "react";
import EditFeaturedCollectionDialog from "../dialogs/EditFeaturedCollectionDialog";
import { useState } from "react";
import {
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

import { useToggleFeaturedCollectionStatus } from "../hooks/useToggleFeaturedCollectionStatus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRemoveFeaturedCollection } from "../hooks/useRemoveFeaturedCollection";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { FeaturedCollection } from "../types/featuredCollection.types";

interface FeaturedCollectionRowProps {
  collection: FeaturedCollection;

  style?: React.CSSProperties;

  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const FeaturedCollectionRow = forwardRef<
  HTMLTableRowElement,
  FeaturedCollectionRowProps
>(
(
{
  collection,
  style,
  dragHandleProps,
},
ref
) => {
    const removeMutation =
  useRemoveFeaturedCollection();
  const toggleMutation =
  useToggleFeaturedCollectionStatus();
  const [editOpen, setEditOpen] = useState(false);
  return (
    <TableRow
  ref={ref}
  style={style}
>
      <TableCell className="w-12">
        <div
  {...dragHandleProps}
  className="cursor-grab active:cursor-grabbing"
>
  <GripVertical className="h-4 w-4 text-muted-foreground" />
</div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-lg border bg-muted">
            {collection.collection?.thumbnail_image ? (
              <img
                src={collection.collection.thumbnail_image}
                alt={collection.collection.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div>
            <p className="font-medium">
              {collection.collection?.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {collection.collection?.slug}
            </p>
          </div>
        </div>
      </TableCell>

      <TableCell>
  <div className="flex items-center gap-3">
    <Switch
      checked={collection.is_active}
      disabled={toggleMutation.isPending}
      onCheckedChange={(checked) =>
        toggleMutation.mutate({
          id: collection.id,
          is_active: checked,
        })
      }
    />

    <Badge
      variant={
        collection.is_active
          ? "default"
          : "secondary"
      }
    >
      {collection.is_active
        ? "Active"
        : "Inactive"}
    </Badge>
  </div>
</TableCell>

      <TableCell>
        {collection.display_order}
      </TableCell>

      <TableCell>
        <div className="flex justify-end gap-2">
          <Button
  variant="outline"
  size="icon"
  onClick={() => setEditOpen(true)}
>
  <Pencil className="h-4 w-4" />
</Button>

          <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      size="icon"
      variant="destructive"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Remove Featured Collection?
      </AlertDialogTitle>

      <AlertDialogDescription>
        This will remove{" "}
        <span className="font-medium">
          {collection.collection?.name}
        </span>{" "}
        from the homepage.

        <br />
        <br />

        The original collection will remain in your
        Collections module.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        disabled={removeMutation.isPending}
        onClick={() =>
          removeMutation.mutate(collection.id)
        }
      >
        {removeMutation.isPending
          ? "Removing..."
          : "Remove"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        </div>
      </TableCell>
      <EditFeaturedCollectionDialog
  open={editOpen}
  onOpenChange={setEditOpen}
  featuredCollection={collection}
/>
    </TableRow>
  );
}
);

FeaturedCollectionRow.displayName =
  "FeaturedCollectionRow";

export default FeaturedCollectionRow;