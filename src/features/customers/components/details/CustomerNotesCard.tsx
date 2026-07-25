import { FileText } from "lucide-react";

interface CustomerNotesCardProps {
  notes: string | null;
}

export default function CustomerNotesCard({
  notes,
}: CustomerNotesCardProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <div className="border-b p-6">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />

          <h2 className="text-lg font-semibold">
            Customer Notes
          </h2>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Internal notes visible only to administrators.
        </p>
      </div>

      <div className="p-6">
        {notes?.trim() ? (
          <div className="whitespace-pre-wrap break-words text-sm leading-7">
            {notes}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No notes available for this customer.
          </div>
        )}
      </div>
    </div>
  );
}