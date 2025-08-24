"use client";

import {
  ContactRecordWithTrainer,
  FetchAllContactsResponse,
} from "@/app/api/admin/Types";
import DashboardPageContainer from "@/components/admin/DashboardPageContainer";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { AppTable } from "@/components/app/AppTable";
import { FloatingActionBar } from "@/components/app/FloatingActionBar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Mail, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";
import ContactDetailsDrawer from "../../trainer-portal/TrainerContacts/ContactDetailsDrawer";
import DeleteConfirmationDialog from "../../trainer-portal/TrainerContacts/DeleteConfirmationDialog";
import EmailContactsDrawer from "../../trainer-portal/TrainerContacts/EmailContactsDrawer";
import BulkUpdateContactsDrawer, { BulkUpdateData } from "./BulkUpdateContactsDrawer";
import { createColumns } from "./ContactsColumns";
import useDeleteContacts from "./useDeleteContacts";
import useBulkUpdateContacts from "./useBulkUpdateContacts";

export default function Contacts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-all-contacts"],
    queryFn: async () => {
      const response = await fetch("/api/admin/contacts");

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to fetch contacts");
      }

      const result: FetchAllContactsResponse = await response.json();
      return result.data.contacts;
    },
  });

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedContact, setSelectedContact] =
    useState<ContactRecordWithTrainer | null>(null);
  const [isEmailDrawerOpen, setIsEmailDrawerOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkUpdateDrawerOpen, setIsBulkUpdateDrawerOpen] = useState(false);

  const { deleteContacts, isDeleting } = useDeleteContacts({
    onSuccess: () => {
      setRowSelection({});
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error("Failed to delete contacts:", error);
    },
  });

  const { bulkUpdateContacts, isUpdating } = useBulkUpdateContacts({
    onSuccess: () => {
      setRowSelection({});
      setIsBulkUpdateDrawerOpen(false);
    },
    onError: (error) => {
      console.error("Failed to update contacts:", error);
    },
  });

  const columns = createColumns(handleViewContact);
  const selectedCount = Object.keys(rowSelection).length;
  const selectedContacts = data?.filter((_, index) => rowSelection[index]) || [];

  if (isLoading) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader
          title="All Contacts"
          description="View all contacts in the system across all trainers, including their associated trainer information."
        />
        <div>Loading...</div>
      </DashboardPageContainer>
    );
  }

  if (error) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader
          title="All Contacts"
          description="View all contacts in the system across all trainers, including their associated trainer information."
        />
        <div>
          Error loading contacts:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer>
      <DashboardPageHeader
        title="All Contacts"
        description="View all contacts in the system across all trainers, including their associated trainer information."
      />
      <AppTable
        columns={columns}
        data={data || []}
        enableRowSelection={true}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      <ContactDetailsDrawer
        open={selectedContact !== null}
        onClose={handleCloseDrawer}
        contactId={selectedContact?.id || null}
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
              onClick={handleBulkUpdateSelected}
              className="gap-2 bg-green-500 hover:bg-green-600 text-white border-none sm:px-3 px-2"
            >
              <Edit3 size={16} />
              <span className="hidden sm:inline">Update</span>
            </Button>
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

      <BulkUpdateContactsDrawer
        open={isBulkUpdateDrawerOpen}
        onClose={handleCloseBulkUpdateDrawer}
        contacts={selectedContacts}
        onUpdate={handleBulkUpdate}
        isLoading={isUpdating}
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

  function handleViewContact(contactId: string) {
    const contact = data?.find((c) => c.id === contactId);
    setSelectedContact(contact || null);
  }

  function handleCloseDrawer() {
    setSelectedContact(null);
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
      .map((index) => data?.[parseInt(index)]?.id)
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

  function handleBulkUpdateSelected() {
    setIsBulkUpdateDrawerOpen(true);
  }

  function handleCloseBulkUpdateDrawer() {
    setIsBulkUpdateDrawerOpen(false);
    setRowSelection({});
  }

  function handleBulkUpdate(updateData: BulkUpdateData) {
    bulkUpdateContacts(updateData);
  }
}
