"use client";

import AppDrawer, { DrawerProps } from "@/components/app/AppDrawer";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useCreateContact from "./useCreateContact";

// Format phone number as user types
function formatPhoneNumber(value: string): string {
  // Remove all non-numeric characters
  const phoneNumber = value.replace(/[^\d]/g, '');
  
  // Don't format if empty
  if (!phoneNumber) return '';
  
  // Format based on length
  if (phoneNumber.length <= 3) {
    return `(${phoneNumber}`;
  } else if (phoneNumber.length <= 6) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  } else {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  }
}

// Validate US phone number format
function isValidUSPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^\d]/g, '');
  return cleaned.length === 10;
}

const contactSchema = z.object({
  role: z.enum(["Parent", "Player", "Coach"], {
    required_error: "Please select a role",
  }),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((phone) => isValidUSPhone(phone), "Please enter a valid 10-digit US phone number"),
});

type ContactFormData = z.infer<typeof contactSchema>;

type CreateContactDrawerProps = DrawerProps & {};

export default function CreateContactDrawer({
  open,
  onClose,
}: CreateContactDrawerProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const createContact = useCreateContact();
  
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
    },
  });

  const formBody = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    field.value && !isValidUSPhone(field.value) && field.value.length > 0
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

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose} disabled={createContact.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={createContact.isPending}>
            {createContact.isPending ? "Creating..." : "Create Contact"}
          </Button>
        </div>
      </form>
    </Form>
  );

  return (
    <AppDrawer
      open={open}
      onClose={handleClose}
      headerTitle="Create Contact"
      headerDescription="Add a new contact to your list"
      body={formBody}
      size="lg"
    />
  );

  function handleClose() {
    form.reset();
    setErrorMessage(null);
    onClose();
  }

  function selectRole(role: "Parent" | "Player" | "Coach") {
    form.setValue("role", role);
  }

  function onSubmit(data: ContactFormData) {
    setErrorMessage(null);
    
    createContact.mutate(data, {
      onSuccess: () => {
        onClose();
        form.reset();
        setErrorMessage(null);
      },
      onError: (error) => {
        setErrorMessage(error.message || "Failed to create contact");
      },
    });
  }
}
