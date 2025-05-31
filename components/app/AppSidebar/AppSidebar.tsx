import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import AppSidebarHeader from "./AppSidebarHeader";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <Sidebar collapsible="icon">
      <AppSidebarHeader />
      <SidebarContent>{children}</SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
