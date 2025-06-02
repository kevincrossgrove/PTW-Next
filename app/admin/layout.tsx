import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import MobileHeader from "./MobileHeader";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider className="flex-col md:flex-row">
        <MobileHeader />
        <AdminSidebar />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </>
  );
}
