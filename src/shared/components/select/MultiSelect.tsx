import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  value: string[];
  options: MultiSelectOption[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export default function MultiSelect({
  label,
  placeholder = "Select...",
  value,
  options,
  onChange,
  disabled,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="w-full justify-between"
          >
            {value.length > 0
              ? `${value.length} selected`
              : placeholder}

            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[350px] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search..." />

            <CommandList>
              <CommandEmpty>
                No results found.
              </CommandEmpty>

              <CommandGroup>
                {options.map((option) => {
                  const selected = value.includes(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() =>
                        toggleOption(option.value)
                      }
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />

                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((id) => {
            const option = options.find(
              (o) => o.value === id
            );

            if (!option) return null;

            return (
              <Badge
                key={id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {option.label}

                <button
                  type="button"
                  onClick={() => toggleOption(id)}
                  className="rounded-full p-0.5 hover:bg-black/10"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}