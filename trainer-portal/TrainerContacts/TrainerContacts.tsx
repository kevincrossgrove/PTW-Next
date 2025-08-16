"use client";

import { ContactRecord } from "@/app/api/trainer/Types";
import { AppTable } from "@/components/app/AppTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import DashboardPageContainer from "../../components/admin/DashboardPageContainer";
import DashboardPageHeader from "../../components/admin/DashboardPageHeader";
import ContactDetailsDrawer from "./ContactDetailsDrawer";
import CreateContactDrawer from "./CreateContactDrawer";
import useFetchContacts from "./useFetchContacts";

type TrainerContact = ContactRecord & { id: string };

export default function TrainerContacts() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewContactID, setViewContactID] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data: contactsData, isLoading, error, refetch } = useFetchContacts();

  function handleViewContact(contactId: string) {
    setViewContactID(contactId);
  }

  const columns: ColumnDef<TrainerContact>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="inline-flex"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="inline-flex"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => (
        <button
          onClick={() => handleViewContact(row.original.id)}
          className="text-left font-bold hover:underline cursor-pointer text-foreground/80"
        >
          {`${row.original.FirstName} ${row.original.LastName}`}
        </button>
      ),
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

  function handleCreateContact() {
    setIsDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setIsDrawerOpen(false);
    // Refetch contacts when drawer closes (in case a contact was created)
    refetch();
  }

  function handleCloseViewDrawer() {
    setViewContactID(null);
  }

  return (
    <DashboardPageContainer>
      <DashboardPageHeader
        title="My Contacts"
        description="All parents and players you're connected with — track details, follow up, and invite them to join your training app."
        actions={
          <Button onClick={handleCreateContact} className="hidden sm:block">
            Create Contact
          </Button>
        }
      />

      <div className="pb-20 sm:pb-0">
        <AppTable
          columns={columns}
          data={contactsData?.contacts || []}
          isLoading={isLoading}
          error={error?.message}
          enableRowSelection={true}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={handleCreateContact}
        className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
        aria-label="Create Contact"
      >
        <Plus size={24} />
      </button>

      <CreateContactDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />

      <ContactDetailsDrawer
        open={viewContactID !== null}
        onClose={handleCloseViewDrawer}
        contactId={viewContactID}
      />
    </DashboardPageContainer>
  );
}
