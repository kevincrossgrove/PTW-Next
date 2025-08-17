"use client";

import { ContactRecord } from "@/app/api/trainer/Types";
import { AppTable } from "@/components/app/AppTable";
import { FloatingActionBar } from "@/components/app/FloatingActionBar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { Mail, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import DashboardPageContainer from "../../components/admin/DashboardPageContainer";
import DashboardPageHeader from "../../components/admin/DashboardPageHeader";
import ContactDetailsDrawer from "./ContactDetailsDrawer";
import CreateContactDrawer from "./CreateContactDrawer";
import EditContactDrawer from "./EditContactDrawer";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import EmailContactsDrawer from "./EmailContactsDrawer";
import useDeleteContacts from "./useDeleteContacts";
import useFetchContacts from "./useFetchContacts";

type TrainerContact = ContactRecord & { id: string };

export default function TrainerContacts() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewContactID, setViewContactID] = useState<string | null>(null);
  const [editContactID, setEditContactID] = useState<string | null>(null);
  const [previousViewContactID, setPreviousViewContactID] = useState<string | null>(null);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data: contactsData, isLoading, error, refetch } = useFetchContacts();

  const { deleteContacts, isDeleting } = useDeleteContacts({
    onSuccess: () => {
      setRowSelection({});
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Failed to delete contacts:", error);
    },
  });

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

  function handleEditContact(contactId: string) {
    setPreviousViewContactID(viewContactID); // Remember which contact was being viewed
    setEditContactID(contactId);
    setViewContactID(null); // Close view drawer if open
  }

  function handleCloseEditDrawer() {
    setEditContactID(null);
    setPreviousViewContactID(null);
    // Refetch contacts when drawer closes (in case a contact was updated)
    refetch();
  }

  function handleCancelEditDrawer() {
    setEditContactID(null);
    // Restore the previous view drawer if there was one
    if (previousViewContactID) {
      setViewContactID(previousViewContactID);
    }
    setPreviousViewContactID(null);
  }

  function handleCloseActionBar() {
    setRowSelection({});
  }

  function handleDeleteSelected() {
    setIsDeleteDialogOpen(true);
  }

  function handleConfirmDelete() {
    const selectedIndices = Object.keys(rowSelection);

    const selectedContactIds = selectedIndices
      .map((index) => contactsData?.contacts[parseInt(index)]?.id)
      .filter((id): id is string => Boolean(id));

    if (selectedContactIds.length > 0) {
      deleteContacts(selectedContactIds);
    }
  }

  function handleCloseDeleteDialog() {
    setIsDeleteDialogOpen(false);
  }

  function handleEmailSelected() {
    setIsEmailDrawerOpen(true);
  }

  function handleCloseEmailDrawer() {
    setIsEmailDrawerOpen(false);
    setRowSelection({});
  }

  const selectedCount = Object.keys(rowSelection).length;
  const selectedContacts =
    contactsData?.contacts.filter((_, index) => rowSelection[index]) || [];

  return (
    <DashboardPageContainer>
      <DashboardPageHeader
        title="My Contacts"
        description="All parents and players you're connected with — track details, follow up, and invite them to join your training app."
        actions={
          <Button
            onClick={handleCreateContact}
            size="icon"
            className="hidden sm:flex w-10 h-10"
          >
            <Plus className="size-6" />
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
      <Button
        onClick={handleCreateContact}
        className="fixed bottom-8 right-6 sm:hidden shadow-lg hover:shadow-xl transition-all duration-200 z-50 w-12 h-12"
        aria-label="Create Contact"
      >
        <Plus className="size-7" />
      </Button>

      <CreateContactDrawer open={isDrawerOpen} onClose={handleCloseDrawer} />

      <ContactDetailsDrawer
        open={viewContactID !== null}
        onClose={handleCloseViewDrawer}
        contactId={viewContactID}
        onEdit={handleEditContact}
      />

      <EditContactDrawer
        open={editContactID !== null}
        onClose={handleCloseEditDrawer}
        onCancel={handleCancelEditDrawer}
        contactId={editContactID}
      />

      <FloatingActionBar
        isVisible={selectedCount > 0}
        selectedCount={selectedCount}
        onClose={handleCloseActionBar}
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEmailSelected}
              className="gap-2 bg-blue-500 hover:bg-blue-600 text-white border-none sm:px-3 px-2"
            >
              <Mail size={16} />
              <span className="hidden sm:inline">Email</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
              className="gap-2 bg-red-500 hover:bg-red-600 text-white border-none sm:px-3 px-2"
            >
              <Trash2 size={16} />
              <span className="hidden sm:inline">
                {isDeleting ? "Deleting..." : "Delete"}
              </span>
            </Button>
          </>
        }
      />

      <EmailContactsDrawer
        open={isEmailDrawerOpen}
        onClose={handleCloseEmailDrawer}
        contacts={selectedContacts}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        contactCount={selectedCount}
        isLoading={isDeleting}
      />
    </DashboardPageContainer>
  );
}
