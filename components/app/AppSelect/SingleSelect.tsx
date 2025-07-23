import { AppSelect } from "./AppSelect";

interface Props<T> {
  placeholder?: string;
  searchPlaceholder?: string;
  labelKey: keyof T;
  valueKey: keyof T;
  colorKey: keyof T;
  dataName?: string;
  data: T[];
  CustomTrigger?: (props: {
    displayValue: string | undefined;
  }) => React.ReactNode;
  className?: string;
}

export default function SingleSelect<T>({
  placeholder = "Select...",
  searchPlaceholder,
  labelKey,
  valueKey,
  colorKey,
  dataName = "item",
  data,
  className,
}: Props<T & { [key: string]: string }>) {
  return (
    <AppSelect
      className={className}
      data={data}
      labelKey={labelKey}
      valueKey={valueKey}
      colorKey={colorKey}
      dataName={dataName}
      CustomTrigger={TableDisplay}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
    />
  );
}

function TableDisplay({ displayValue }: { displayValue: string | undefined }) {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <div className="min-w-18 text-xs bg-muted rounded-lg truncate px-2 py-2">
        {displayValue}
      </div>
    </div>
  ) as React.ReactNode;
}
