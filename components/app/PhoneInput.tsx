import { Input } from "@/components/ui/input";

// Format phone number as user types
function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/[^\d]/g, "");

  // Don't format if empty
  if (!phoneNumber) return "";

  // Format based on length
  if (phoneNumber.length <= 3) {
    return `(${phoneNumber}`;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }
}

// Validate US phone number format
export function isValidUSPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^\d]/g, "");
  return cleaned.length === 10;
}

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export default function PhoneInput({
  value = "",
  onChange,
  placeholder = "(555) 123-4567",
  className,
  id,
}: PhoneInputProps) {
  return (
    <Input
      id={id}
      type="tel"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        const formatted = formatPhoneNumber(e.target.value);
        onChange(formatted);
      }}
      className={
        value && !isValidUSPhone(value) && value.length > 0
          ? `border-destructive focus:ring-destructive ${className || ""}`
          : className
      }
      maxLength={14} // (XXX) XXX-XXXX
    />
  );
}