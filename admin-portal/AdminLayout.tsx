import { Outlet } from "react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";

export default function AdminLayout() {
  return (
    <>
      <SidebarProvider className="flex-col md:flex-row">
        <AdminMobileHeader />
        <AdminSidebar />
        <main className="w-full h-screen">
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}