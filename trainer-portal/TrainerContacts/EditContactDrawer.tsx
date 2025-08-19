"use client";

import AppDrawer, { DrawerProps } from "@/components/app/AppDrawer";
import AppLoader from "@/components/app/AppLoader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import useContact from "./useContact";
import useUpdateContact from "./useUpdateContact";

// Format phone number as user types
function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/[^\d]/g, "");

  // Don't format if empty
  if (!phoneNumber) return "";

  // Format based on length
  if (phoneNumber.length <= 3) {
    return `(${phoneNumber}`;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }
}

// Validate US phone number format
function isValidUSPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^\d]/g, "");
  return cleaned.length === 10;
}

const contactSchema = z.object({
  role: z.enum(["Parent", "Player", "Coach"], "Please select a role"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email().optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (phone) => !phone || isValidUSPhone(phone),
      "Please enter a valid 10-digit US phone number"
    ),
  notes: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface EditContactDrawerProps extends DrawerProps {
  contactId: string | null;
  onCancel?: () => void;
}

export default function EditContactDrawer({
  open,
  onClose,
  contactId,
  onCancel,
}: EditContactDrawerProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: contactData, isLoading: isLoadingContact } =
    useContact(contactId);
  const updateContact = useUpdateContact(contactId || "");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      role: undefined,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      notes: "",
    },
  });

  // Reset form when contact data is loaded
  useEffect(() => {
    if (contactData?.contact) {
      const contact = contactData.contact;
      form.reset({
        role: contact.Role,
        firstName: contact.FirstName,
        lastName: contact.LastName,
        email: contact.Email,
        phoneNumber: contact.PhoneNumber,
        notes: contact.Notes || "",
      });
    }
  }, [contactData, form]);

  // Reset form when drawer opens/closes
  useEffect(() => {
    if (!open) {
      setErrorMessage(null);
    }
  }, [open]);

  const headerOptions = (
    <Button
      type="submit"
      form="edit-contact-form"
      disabled={updateContact.isPending || isLoadingContact}
      className="md:hidden"
    >
      {updateContact.isPending ? "Updating..." : "Update"}
    </Button>
  );

  const formBody = isLoadingContact ? (
    <div className="flex justify-center items-center py-8">
      <AppLoader />
    </div>
  ) : (
    <Form {...form}>
      <form
        id="edit-contact-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-3">
                  {["Parent", "Player", "Coach"].map((role) => (
                    <Badge
                      key={role}
                      variant={field.value === role ? "default" : "outline"}
                      className="cursor-pointer px-4 py-2 text-sm font-medium hover:opacity-80 transition-opacity"
                      onClick={() =>
                        selectRole(role as "Parent" | "Player" | "Coach")
                      }
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={field.value}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    field.onChange(formatted);
                  }}
                  className={
                    field.value &&
                    !isValidUSPhone(field.value) &&
                    field.value.length > 0
                      ? "border-destructive focus:ring-destructive"
                      : ""
                  }
                  maxLength={14} // (XXX) XXX-XXXX
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about this contact..."
                  className="min-h-[100px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="hidden md:flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={updateContact.isPending}
          >
            Cancel
          </Button>
          <Button
            form="edit-contact-form"
            type="submit"
            disabled={updateContact.isPending}
          >
            {updateContact.isPending ? "Updating..." : "Update Contact"}
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <AppDrawer
      open={open}
      onClose={handleCancel}
      headerTitle="Edit Contact"
      headerDescription="Update contact information"
      headerOptions={headerOptions}
      body={formBody}
      size="lg"
    />
  );

  function handleCancel() {
    setErrorMessage(null);
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  }

  function selectRole(role: "Parent" | "Player" | "Coach") {
    form.setValue("role", role);
  }

  function onSubmit(data: ContactFormData) {
    setErrorMessage(null);

    updateContact.mutate(data, {
      onSuccess: () => {
        onClose();
        setErrorMessage(null);
      },
      onError: (error) => {
        setErrorMessage(error.message || "Failed to update contact");
      },
    });
  }
}
