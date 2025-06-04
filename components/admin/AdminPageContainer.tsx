export default function AdminPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-8">{children}</div>;
}
