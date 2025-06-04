"use client";

import Image from "next/image";
import { AppThemeSelector } from "./AppThemeSelector";

export default function AppNavbar() {
  return (
    <div className="bg-sidebar py-3 flex justify-between items-center px-4 border-b border-accent">
      <Image width={30} height={30} src={"/ptw.png"} alt="logo" />
      <div className="cursor-pointer">
        <AppThemeSelector />
      </div>
    </div>
  );
}
