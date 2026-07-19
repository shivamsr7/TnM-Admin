import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SearchableSelect({
  label,
  placeholder = "Select...",
  value,
  options,
  onChange,
  disabled,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find(
    (option) => option.value === value
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}

      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            disabled={disabled}
            className="w-full justify-between"
          >
            {selected?.label ?? placeholder}

            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[350px] p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search..."
            />

            <CommandList>
              <CommandEmpty>
                No results found.
              </CommandEmpty>

              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />

                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}