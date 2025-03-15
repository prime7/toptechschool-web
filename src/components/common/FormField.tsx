import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, required = false, children, className }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="text-sm font-medium mb-1.5 block">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  className?: string;
}

export function InputField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  type = "text",
  className
}: InputFieldProps) {
  return (
    <FormField label={label} required={required} className={className}>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </FormField>
  );
}

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  minHeight?: string;
}

export function TextareaField({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  className,
  minHeight = "100px"
}: TextareaFieldProps) {
  return (
    <FormField label={label} required={required} className={className}>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`min-h-[${minHeight}]`}
      />
    </FormField>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function SelectField<T extends string>({ 
  label, 
  value, 
  onChange, 
  options,
  placeholder = "Select an option", 
  required = false,
  className
}: SelectFieldProps<T>) {
  return (
    <FormField label={label} required={required} className={className}>
      <Select value={value} onValueChange={(value) => onChange(value as T)}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
} 