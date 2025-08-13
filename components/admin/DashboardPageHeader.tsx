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
    <div className="flex justify-between items-center w-full pb-6 h-16">
      <div className="mb-2">
        <h1 className="text-[22px] font-bold mb-1">{title}</h1>
        {description && <p className=" text-muted-foreground">{description}</p>}
      </div>
      {actions}
    </div>
  );
}
