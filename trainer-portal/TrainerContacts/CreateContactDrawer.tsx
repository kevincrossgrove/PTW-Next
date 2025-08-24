"use client";

import AppDrawer, { DrawerProps } from "@/components/app/AppDrawer";
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
import PhoneInput, { isValidUSPhone } from "@/components/app/PhoneInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import useCreateContact from "./useCreateContact";


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
      notes: "",
    },
  });

  const headerOptions = (
    <Button
      type="submit"
      form="create-contact-form"
      disabled={createContact.isPending}
      className="md:hidden"
    >
      {createContact.isPending ? "Creating..." : "Create"}
    </Button>
  );

  const formBody = (
    <Form {...form}>
      <form
        id="create-contact-form"
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
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
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
            onClick={handleClose}
            disabled={createContact.isPending}
          >
            Cancel
          </Button>
          <Button
            form="create-contact-form"
            type="submit"
            disabled={createContact.isPending}
          >
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
      headerOptions={headerOptions}
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
