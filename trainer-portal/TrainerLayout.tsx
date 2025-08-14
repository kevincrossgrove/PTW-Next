import { Outlet } from "react-router";

import { Button } from "@/components/ui/button";
import DashboardMobileHeader from "../components/admin/DashboardMobileHeader";
import { SidebarProvider } from "../components/ui/sidebar";
import TrainerSidebar from "./TrainerSidebar";

export default function TrainerLayout() {
  const context = {};

  return (
    <SidebarProvider className="flex-col md:flex-row">
      <DashboardMobileHeader />
      <TrainerSidebar />
      <main className="flex-1 flex flex-col h-screen w-screen">
        <Outlet context={context} />
      </main>
    </SidebarProvider>
  );
}
