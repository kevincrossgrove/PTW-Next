"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function DashboardMobileHeader() {
  const { setOpenMobile } = useSidebar();

  return (
    <div className="md:hidden bg-sidebar py-3 flex justify-between items-center px-4">
      <Image width={30} height={30} src={"/ptw.png"} alt="logo" />
      <div className="cursor-pointer" onClick={() => setOpenMobile(true)}>
        <Menu className="w-6" />
      </div>
    </div>
  );
}
