import { Link, Outlet } from "react-router";

import { Button } from "@/components/ui/button";
import { UserSearch } from "lucide-react";
import DashboardMobileHeader from "../components/admin/DashboardMobileHeader";
import { AppSidebar } from "../components/app/AppSidebar/AppSidebar";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarProvider,
} from "../components/ui/sidebar";

export default function TrainerLayout() {
  const context = {};

  return (
    <SidebarProvider className="flex-col md:flex-row">
      <DashboardMobileHeader />
      <AppSidebar
        footer={
          <Button variant="outline" asChild>
            <a href="/admin/home">Admins</a>
          </Button>
        }
      >
        <SidebarGroup>
          <SidebarGroupLabel>PTW Admin</SidebarGroupLabel>
          <SidebarMenuButton asChild title={"Trainer Dashboard"}>
            <Link to={"/trainer/contacts"} className="flex items-center gap-2">
              <UserSearch />
              <span>My Contacts</span>
            </Link>
          </SidebarMenuButton>
        </SidebarGroup>
      </AppSidebar>
      <main className="flex-1 flex flex-col h-screen w-screen">
        <Outlet context={context} />
      </main>
    </SidebarProvider>
  );
}
