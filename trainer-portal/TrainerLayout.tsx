import { Outlet } from "react-router";

import DashboardMobileHeader from "../components/admin/DashboardMobileHeader";
import { SidebarProvider } from "../components/ui/sidebar";
import TrainerSidebar from "./TrainerSidebar";

export default function TrainerLayout() {
  const context = {};

  return (
    <SidebarProvider className="flex-col md:flex-row">
      <DashboardMobileHeader />
      <TrainerSidebar />
      <main className="flex-1 flex flex-col h-screen min-w-0">
        <Outlet context={context} />
      </main>
    </SidebarProvider>
  );
}
