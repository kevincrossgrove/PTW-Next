"use client";

import { AppTable } from "@/components/app/AppTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import DashboardPageContainer from "../../components/admin/DashboardPageContainer";
import DashboardPageHeader from "../../components/admin/DashboardPageHeader";
import CreateContactDrawer from "./CreateContactDrawer";
import useFetchContacts from "./useFetchContacts";
import { ContactRecord } from "@/app/api/trainer/Types";

type TrainerContact = ContactRecord & { id: string };

const columns: ColumnDef<TrainerContact>[] = [
  {
    id: "name",
    header: "Name",
    cell: ({ row }) => `${row.original.FirstName} ${row.original.LastName}`,
  },
  {
    accessorKey: "Email",
    header: "Email",
  },
  {
    accessorKey: "PhoneNumber",
    header: "Phone",
    cell: ({ row }) => row.getValue("PhoneNumber") || "-",
  },
  {
    accessorKey: "Role",
    header: "Role",
  },
  {
    accessorKey: "CreatedAt",
    header: "Added",
    cell: ({ row }) => {
      const date = row.getValue("CreatedAt") as string;
      return new Date(date).toLocaleDateString();
    },
  },
];


export default function TrainerContacts() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { data: contactsData, isLoading, error, refetch } = useFetchContacts();

  return (
    <DashboardPageContainer>
      <DashboardPageHeader
        title="My Contacts"
        description="All parents and players you're connected with — track details, follow up, and invite them to join your training app."
        actions={<Button onClick={handleCreateContact}>Create Contact</Button>}
      />

      <AppTable 
        columns={columns} 
        data={contactsData?.contacts || []} 
        isLoading={isLoading}
        error={error?.message}
      />

      <CreateContactDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />
    </DashboardPageContainer>
  );

  function handleCreateContact() {
    setIsDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setIsDrawerOpen(false);
    // Refetch contacts when drawer closes (in case a contact was created)
    refetch();
  }
}
