interface AdminPageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex justify-between items-center w-full pb-6 h-16">
      <h1 className="text-2xl font-bold">{title}</h1>
      {actions}
    </div>
  );
}
