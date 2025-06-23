"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";

interface Props<T> {
  hideArrows?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  labelKey: keyof T;
  valueKey: keyof T;
  colorKey: keyof T;
  dataName?: string;
  data: T[];
  className?: string;
}

export function AppSelect<T>({
  hideArrows,
  placeholder = "Select...",
  searchPlaceholder,
  labelKey,
  valueKey,
  colorKey,
  dataName = "item",
  data,
  className,
}: Props<T & { [key: string]: string }>) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  console.log(colorKey);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? data.find((item) => item[valueKey] === value)?.[labelKey]
            : placeholder}
          {!hideArrows && <ChevronsUpDown className="opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder || placeholder}
            className="h-9"
          />
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
                  {item[labelKey]}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item[valueKey] ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
