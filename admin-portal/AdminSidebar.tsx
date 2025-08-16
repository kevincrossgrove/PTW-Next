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
  Contact,
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
      </SidebarGroup>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup className="-mt-2">
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
              icon={<Mails />}
              title="Invites"
              to="/admin/invites"
            />
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup className="-mt-2">
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Player Management
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <AppSidebarPageItem
              icon={<Trophy />}
              title="Players"
              to="/admin/players"
            />
            <AppSidebarPageItem
              icon={<Heart />}
              title="Parents"
              to="/admin/parents"
            />
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup className="-mt-2">
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Trainer Management
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <AppSidebarPageItem
              icon={<ChartSpline />}
              title="Trainers"
              to="/admin/trainers"
            />
            <AppSidebarPageItem
              icon={<Contact />}
              title="Contacts"
              to="/admin/contacts"
            />
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup className="-mt-2">
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
