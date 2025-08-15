"use client";

import AppDrawer from "@/components/app/AppDrawer";
import AppLoader from "@/components/app/AppLoader";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import useContact from "./useContact";

interface ContactDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  contactId: string | null;
}

interface ContactFieldProps {
  label: string;
  value: string;
  className?: string;
}

function ContactField({
  label,
  value,
  className = "text-base",
}: ContactFieldProps) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <p className={className}>{value}</p>
    </div>
  );
}

export default function ContactDetailsDrawer({
  open,
  onClose,
  contactId,
}: ContactDetailsDrawerProps) {
  const { data: contactData, isLoading, error } = useContact(contactId);

  const contact = contactData?.contact;

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      headerTitle={contact ? `${contact.FirstName} ${contact.LastName}` : "Contact Details"}
      headerOptions={
        contact ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`tel:${contact.PhoneNumber}`)}
              disabled={!contact.PhoneNumber}
            >
              <Phone size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`mailto:${contact.Email}`)}
            >
              <Mail size={16} />
            </Button>
          </div>
        ) : null
      }
      body={
        isLoading ? (
          <AppLoader />
        ) : error ? (
          <div className="p-4 text-center text-red-600">
            <p>Error loading contact details</p>
            <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
          </div>
        ) : !contact ? (
          <div className="p-4 text-center text-muted-foreground">
            No contact data available
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <ContactField label="Email" value={contact.Email} />

              <ContactField
                label="Phone Number"
                value={contact.PhoneNumber || "Not provided"}
              />

              <ContactField label="Role" value={contact.Role} />

              <ContactField
                label="Added"
                value={new Date(contact.CreatedAt).toLocaleDateString()}
              />
            </div>
          </div>
        )
      }
    />
  );
}
