interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full pb-6 h-16">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions}
    </div>
  );
}
