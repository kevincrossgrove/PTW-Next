"use client";

import { SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Menu, PanelLeftClose } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function AppSidebarHeader() {
  const { theme } = useTheme();
  const { open, toggleSidebar } = useSidebar();

  return (
    <SidebarHeader>
      <div
        className={twMerge(
          "flex w-full items-center gap-6 pt-2",
          open ? "justify-between" : "justify-center"
        )}
      >
        {open ? (
          <Image
            width={30}
            height={30}
            src={theme === "light" ? "/ptw.png" : "/ptw.png"}
            alt="logo"
          />
        ) : null}
        <div className="cursor-pointer" onClick={toggleSidebar}>
          {open ? <PanelLeftClose className="w-6" /> : <Menu className="w-6" />}
        </div>
      </div>
    </SidebarHeader>
  );
}
