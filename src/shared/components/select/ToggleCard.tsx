import { Switch } from "@/components/ui/switch";

interface ToggleCardProps {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function ToggleCard({
  title,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted/30">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
      />
    </div>
  );
}