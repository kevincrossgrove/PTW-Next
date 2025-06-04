import { AppSidebar } from "@/components/app/AppSidebar/AppSidebar";
import AppSidebarPageItem from "@/components/app/AppSidebar/AppSidebarPageItem";
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
        <AppSidebarPageItem icon={<Home />} title="Home" href="/admin/home" />
        <AppSidebarPageItem
          icon={<Mails />}
          title="Invites"
          href="/admin/invites"
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
              href="/admin/users"
            />
            <AppSidebarPageItem
              icon={<ShieldUser />}
              title="Admins"
              href="/admin/admin-users"
            />
            <AppSidebarPageItem
              icon={<ChartSpline />}
              title="Trainers"
              href="/admin/trainers"
            />
            <AppSidebarPageItem
              icon={<Heart />}
              title="Parents"
              href="/admin/parents"
            />
            <AppSidebarPageItem
              icon={<Trophy />}
              title="Players"
              href="/admin/players"
            />
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </AppSidebar>
  );
}
