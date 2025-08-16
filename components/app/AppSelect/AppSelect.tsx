"use client";

import { Check } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props<T> {
  placeholder?: string;
  searchPlaceholder?: string;
  labelKey: keyof T;
  valueKey: keyof T;
  colorKey: keyof T;
  descriptionKey?: keyof T;
  dataName?: string;
  data: T[];
  CustomTrigger?: (props: {
    displayValue: string | undefined;
    className?: string;
  }) => React.ReactNode;
  className?: string;
  disableSearch?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function AppSelect<T>({
  placeholder = "Select...",
  searchPlaceholder,
  labelKey,
  valueKey,
  colorKey,
  descriptionKey,
  dataName = "item",
  data,
  CustomTrigger,
  disableSearch,
  value: controlledValue,
  onValueChange,
}: Props<T & { [key: string]: string }>) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const isMobile = useIsMobile();

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onValueChange || setInternalValue;

  const selectedItem = data.find((item) => item[valueKey] === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {CustomTrigger && (
          <div>
            <CustomTrigger
              displayValue={selectedItem?.[labelKey] || placeholder}
              className={getColorCSS(selectedItem?.[colorKey])}
            />
          </div>
        )}
        {/* <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? data.find((item) => item[valueKey] === value)?.[labelKey]
            : placeholder}
          {!hideArrows && <ChevronsUpDown className="opacity-50" />}
        </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0">
        <Command>
          {!disableSearch && (
            <CommandInput
              placeholder={searchPlaceholder || placeholder}
              className="h-9"
              autoFocus={!isMobile}
            />
          )}
          <CommandList>
            <CommandEmpty>No {dataName} found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item[valueKey] as React.Key}
                  value={item[valueKey]}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div>
                      {item[labelKey]}
                      <div className="text-foreground/60 text-xs">
                        {descriptionKey ? item[descriptionKey] : ""}
                      </div>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item[valueKey] ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function getColorCSS(color: string | undefined) {
  if (!color) return "";

  if (color === "red") return "bg-red-500";
  if (color === "blue") return "bg-blue-500";
  if (color === "green") return "bg-green-500";
  if (color === "yellow") return "bg-yellow-500";
  if (color === "purple") return "bg-purple-500";
  if (color === "pink") return "bg-pink-500";
  if (color === "gray") return "bg-gray-500";
}
