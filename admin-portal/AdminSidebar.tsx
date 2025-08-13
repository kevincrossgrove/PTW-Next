import { AppSidebar } from "@/components/app/AppSidebar/AppSidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  ChartSpline,
  ChevronDown,
  Heart,
  Home,
  LayoutDashboard,
  Mails,
  ShieldUser,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import AppSidebarPageItem from "./AppSidebarPageItem";

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
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Links
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarMenuButton asChild title={"Trainer Dashboard"}>
              <Link href={"/trainer"} className="flex items-center gap-2">
                <LayoutDashboard />
                <span>Trainer Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </AppSidebar>
  );
}
