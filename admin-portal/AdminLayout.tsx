import DashboardMobileHeader from "@/components/admin/DashboardMobileHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Toaster } from "../components/ui/sonner";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <>
      <SidebarProvider className="flex-col md:flex-row">
        <DashboardMobileHeader />
        <AdminSidebar />
        <main className="w-full h-screen">
          <Outlet />
        </main>
      </SidebarProvider>
      <Toaster />
    </>
  );
}
