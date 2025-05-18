import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  label?: string;
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function SearchableSelect({
  label,
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="w-full">
      {label && <Label className="mb-2">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedOption ? selectedOption.label : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" side="bottom">
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}