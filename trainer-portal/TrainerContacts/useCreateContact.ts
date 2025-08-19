"use client";

import { useMutation } from "@tanstack/react-query";
import { CreateContactResponse } from "@/app/api/trainer/Types";

export interface CreateContactPayload {
  role: "Parent" | "Player" | "Coach";
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  notes?: string;
}

export default function useCreateContact() {
  const createContact = useMutation<CreateContactResponse, Error, CreateContactPayload>({
    mutationKey: ["trainer-create-contact"],
    mutationFn: async (payload) => {
      const response = await fetch("/api/trainer/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to create contact");
      }

      return response.json();
    },
  });

  return createContact;
}