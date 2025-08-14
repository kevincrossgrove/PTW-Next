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

const contactSchema = z.object({
  role: z.enum(["parent", "player", "coach"], {
    required_error: "Please select a role",
  }),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((phone) => {
      // Remove all non-digits
      const cleaned = phone.replace(/\D/g, "");
      // Should be 10-11 digits (US format)
      return cleaned.length >= 10 && cleaned.length <= 11;
    }, "Please enter a valid phone number"),
});

type ContactFormData = z.infer<typeof contactSchema>;

type CreateContactDrawerProps = DrawerProps & {};

export default function CreateContactDrawer({
  open,
  onClose,
}: CreateContactDrawerProps) {
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
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-3">
                  {["parent", "player", "coach"].map((role) => (
                    <Badge
                      key={role}
                      variant={field.value === role ? "default" : "outline"}
                      className="cursor-pointer capitalize px-4 py-2 text-sm font-medium hover:opacity-80 transition-opacity"
                      onClick={() =>
                        selectRole(role as "parent" | "player" | "coach")
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Contact</Button>
        </div>
      </form>
    </Form>
  );

  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      headerTitle="Create Contact"
      headerDescription="Add a new contact to your list"
      body={formBody}
      size="lg"
    />
  );

  function selectRole(role: "parent" | "player" | "coach") {
    form.setValue("role", role);
  }

  function onSubmit(data: ContactFormData) {
    try {
      console.log("Form data:", data);
      // TODO: Add API call to create contact
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  }
}
