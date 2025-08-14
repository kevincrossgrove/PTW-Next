interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function DashboardPageHeader({
  title,
  description,
  actions,
}: DashboardPageHeaderProps) {
  return (
    <div className="w-full pb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-[22px] font-bold mb-1 break-words">
            {title}
          </h1>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground break-words pr-2">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">{actions}</div>
      </div>
    </div>
  );
}
