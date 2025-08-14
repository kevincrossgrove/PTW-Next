"use client";

import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { NotebookText } from "lucide-react";
import { Link, useLocation } from "react-router";

interface Props {
  icon?: React.ReactNode;
  to: string;
  title: string;
  isActive?: boolean;
}

export default function AppSidebarPageItem({ icon, to, title }: Props) {
  const location = useLocation();
  const { isMobile, toggleSidebar } = useSidebar();

  const isActive = location.pathname === to;

  return (
    <SidebarMenuButton asChild title={title} isActive={isActive}>
      <Link
        to={to}
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