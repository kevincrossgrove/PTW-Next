"use client";

import DashboardPageContainer from "@/components/admin/DashboardPageContainer";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { AppTable } from "@/components/app/AppTable";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createColumns } from "./ContactsColumns";
import { FetchAllContactsResponse, ContactRecordWithTrainer } from "@/app/api/admin/Types";
import ContactDetailsDrawer from "../../trainer-portal/TrainerContacts/ContactDetailsDrawer";

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
  const [selectedContact, setSelectedContact] = useState<ContactRecordWithTrainer | null>(null);

  function handleViewContact(contactId: string) {
    const contact = data?.find(c => c.id === contactId);
    setSelectedContact(contact || null);
  }

  function handleCloseDrawer() {
    setSelectedContact(null);
  }

  const columns = createColumns(handleViewContact);

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
        <div>Error loading contacts: {error instanceof Error ? error.message : "Unknown error"}</div>
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
        contactId={null}
        contactData={selectedContact}
      />
    </DashboardPageContainer>
  );
}