import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import HeroSettingsForm from "./HeroSettingsForm";

interface HeroSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HeroSettingsDialog({
  open,
  onOpenChange,
}: HeroSettingsDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>
            Hero Settings
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <HeroSettingsForm
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}