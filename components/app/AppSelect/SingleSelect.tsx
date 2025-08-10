import { cn } from "@/lib/utils";
import { AppSelect } from "./AppSelect";

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
  }) => React.ReactNode;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function SingleSelect<T>({
  placeholder = "Select...",
  searchPlaceholder,
  labelKey,
  valueKey,
  colorKey,
  descriptionKey,
  dataName = "item",
  data,
  className,
  value,
  onValueChange,
}: Props<T & { [key: string]: string }>) {
  return (
    <AppSelect
      className={className}
      data={data}
      labelKey={labelKey}
      valueKey={valueKey}
      colorKey={colorKey}
      descriptionKey={descriptionKey}
      dataName={dataName}
      CustomTrigger={TableDisplay}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      value={value}
      onValueChange={onValueChange}
    />
  );
}

function TableDisplay({
  displayValue,
  className,
}: {
  displayValue: string | undefined;
  className?: string;
}) {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div
        className={cn(
          "min-w-18 text-xs text-center bg-muted rounded-lg truncate px-2 py-2",
          className
        )}
      >
        {displayValue}
      </div>
    </div>
  ) as React.ReactNode;
}
