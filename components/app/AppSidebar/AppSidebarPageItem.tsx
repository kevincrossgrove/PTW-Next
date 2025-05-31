import Link from "next/link";
import { SidebarMenuButton } from "../../ui/sidebar";
import { NotebookText } from "lucide-react";

interface Props {
  icon?: React.ReactNode;
  href: string;
  title: string;
  isActive?: boolean;
}

export default function AppSidebarPageItem({
  icon,
  href,
  title,
  isActive,
}: Props) {
  return (
    <SidebarMenuButton asChild title={title} isActive={isActive}>
      <Link href={href} className="flex items-center gap-2">
        {icon ? icon : <NotebookText />}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
