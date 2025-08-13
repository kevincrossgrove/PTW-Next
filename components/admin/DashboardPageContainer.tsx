export default function DashboardPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-4 md:p-8">{children}</div>;
}
