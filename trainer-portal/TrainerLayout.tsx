import { Outlet } from "react-router";

import { AppSidebar } from "../components/app/AppSidebar/AppSidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function TrainerLayout() {
  const context = {};

  return (
    <>
      <SidebarProvider>
        <AppSidebar
          footer={
            <Button variant="outline" asChild>
              <a href="/admin/home">Admins</a>
            </Button>
          }
        >
          Sidebar
        </AppSidebar>
        <main className="flex-1 flex flex-col h-screen w-screen">
          <Outlet context={context} />
        </main>
      </SidebarProvider>
    </>
  );
}
