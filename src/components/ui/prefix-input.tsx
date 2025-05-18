import { Input } from "@/components/ui/input";
import { ReactNode } from "react";

interface PrefixedInputProps {
  icon?: ReactNode;
  prefix: string;
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  type?: string;
}

export function PrefixedInput({
  icon,
  prefix,
  value,
  onChange,
  id,
  placeholder = "Enter value",
  type = "text",
}: PrefixedInputProps) {
  return (
    <div className="flex items-center gap-3">
      {icon && (
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-muted/50 rounded-md transition-colors hover:bg-muted">
          {icon}
        </div>
      )}
      <div className="flex-1 flex items-center border border-input rounded-md overflow-hidden transition-shadow focus-within:border-primary">
        <div className="py-2 px-3 text-sm font-medium text-muted-foreground bg-muted/50 whitespace-nowrap border-r border-input">
          {prefix}
        </div>
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-0 focus-visible:ring-0 bg-transparent"
        />
      </div>
    </div>
  );
}
