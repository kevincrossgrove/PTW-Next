"use client";

import { AppTable } from "@/components/app/AppTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import DashboardPageContainer from "../../components/admin/DashboardPageContainer";
import DashboardPageHeader from "../../components/admin/DashboardPageHeader";
import CreateContactDrawer from "./CreateContactDrawer";

interface TrainerContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "inactive";
  lastContact?: Date;
}

const columns: ColumnDef<TrainerContact>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.getValue("phone") || "-",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "lastContact",
    header: "Last Contact",
    cell: ({ row }) => {
      const date = row.getValue("lastContact") as Date;
      return date ? date.toLocaleDateString() : "-";
    },
  },
];

const mockData: TrainerContact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 123-4567",
    role: "Head Trainer",
    status: "active",
    lastContact: new Date("2025-01-10"),
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike.chen@email.com",
    phone: "(555) 234-5678",
    role: "Assistant Trainer",
    status: "active",
    lastContact: new Date("2025-01-08"),
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@email.com",
    role: "Specialist Trainer",
    status: "inactive",
    lastContact: new Date("2024-12-15"),
  },
];

export default function TrainerContacts() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <DashboardPageContainer>
      <DashboardPageHeader
        title="My Contacts"
        description="All parents and players you're connected with — track details, follow up, and invite them to join your training app."
        actions={<Button onClick={handleCreateContact}>Create Contact</Button>}
      />

      <AppTable columns={columns} data={mockData} />

      <CreateContactDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />
    </DashboardPageContainer>
  );

  function handleCreateContact() {
    setIsDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setIsDrawerOpen(false);
  }
}
