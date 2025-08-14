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
import { ChevronDown, Home, LayoutDashboard, UserSearch } from "lucide-react";
import AppSidebarPageItem from "./AppSidebarPageItem";

export default function TrainerSidebar() {
  return (
    <AppSidebar>
      <SidebarGroup>
        <SidebarGroupLabel>PTW Trainer</SidebarGroupLabel>
        <AppSidebarPageItem icon={<Home />} title="Home" to="/trainer" />
        <AppSidebarPageItem
          icon={<UserSearch />}
          title="My Contacts"
          to="/trainer/contacts"
        />
      </SidebarGroup>
      {/* <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Training Management
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <AppSidebarPageItem
              icon={<Calendar />}
              title="Training Sessions"
              to="/trainer/sessions"
            />
            <AppSidebarPageItem
              icon={<FileText />}
              title="Training Plans"
              to="/trainer/plans"
            />
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible> */}
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger>
              Links
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarMenuButton asChild title={"Admin Dashboard"}>
              <a href={"/admin/home"} className="flex items-center gap-2">
                <LayoutDashboard />
                <span>Admin Dashboard</span>
              </a>
            </SidebarMenuButton>
          </CollapsibleContent>
        </SidebarGroup>
      </Collapsible>
    </AppSidebar>
  );
}
