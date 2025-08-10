import { AppSidebar } from "@/components/app/AppSidebar/AppSidebar";
import AppSidebarPageItem from "./AppSidebarPageItem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import {
  ChartSpline,
  ChevronDown,
  Heart,
  Home,
  Mails,
  ShieldUser,
  Trophy,
  Users,
} from "lucide-react";

export default function AdminSidebar() {
  return (
    <AppSidebar>
      <SidebarGroup>
        <SidebarGroupLabel>PTW Admin</SidebarGroupLabel>
        <AppSidebarPageItem icon={<Home />} title="Home" to="/admin/home" />
        <AppSidebarPageItem
          icon={<Mails />}
          title="Invites"
          to="/admin/invites"
        />
      </SidebarGroup>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              User Management
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <AppSidebarPageItem
              icon={<Users />}
              title="All Users"
              to="/admin/users"
            />
            <AppSidebarPageItem
              icon={<ShieldUser />}
              title="Admins"
              to="/admin/admin-users"
            />
            <AppSidebarPageItem
              icon={<ChartSpline />}
              title="Trainers"
              to="/admin/trainers"
            />
            <AppSidebarPageItem
              icon={<Heart />}
              title="Parents"
              to="/admin/parents"
            />
            <AppSidebarPageItem
              icon={<Trophy />}
              title="Players"
              to="/admin/players"
            />
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </AppSidebar>
  );
}