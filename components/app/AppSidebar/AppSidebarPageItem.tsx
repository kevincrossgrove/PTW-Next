"use client";

import Link from "next/link";
import { SidebarMenuButton, useSidebar } from "../../ui/sidebar";
import { NotebookText } from "lucide-react";
import { usePathname } from "next/navigation";

interface Props {
  icon?: React.ReactNode;
  href: string;
  title: string;
  isActive?: boolean;
}

export default function AppSidebarPageItem({ icon, href, title }: Props) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  const isActive = pathname === href;

  return (
    <SidebarMenuButton asChild title={title} isActive={isActive}>
      <Link
        href={href}
        className="flex items-center gap-2"
        onClick={() => {
          if (isMobile) toggleSidebar();
        }}
      >
        {icon ? icon : <NotebookText />}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
