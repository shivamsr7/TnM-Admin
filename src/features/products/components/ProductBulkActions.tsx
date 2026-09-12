import { CheckCircle2, Trash2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductBulkActionsProps {
  selectedCount: number;
  onPublish: () => void;
  onDraft: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export default function ProductBulkActions({
  selectedCount,
  onPublish,
  onDraft,
  onDelete,
  onClear,
}: ProductBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {selectedCount} product{selectedCount > 1 ? "s" : ""} selected
          </p>
          <p className="text-xs text-slate-500">
            Choose an action for the selected products.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onPublish}
          className="h-9 rounded-lg bg-white text-xs"
        >
          <Eye className="mr-1.5 h-3.5 w-3.5" />
          Publish
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onDraft}
          className="h-9 rounded-lg bg-white text-xs"
        >
          Draft
        </Button>

        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          className="h-9 rounded-lg text-xs"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Delete
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onClear}
          className="h-9 rounded-lg text-xs"
        >
          <X className="mr-1.5 h-3.5 w-3.5" />
          Clear
        </Button>
      </div>
    </div>
  );
}
