"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateContactResponse } from "@/app/api/trainer/Types";

export interface UpdateContactPayload {
  role: "Parent" | "Player" | "Coach";
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  notes?: string;
}

export default function useUpdateContact(contactId: string) {
  const queryClient = useQueryClient();

  const updateContact = useMutation<UpdateContactResponse, Error, UpdateContactPayload>({
    mutationKey: ["trainer-update-contact", contactId],
    mutationFn: async (payload) => {
      const response = await fetch(`/api/trainer/contacts/${contactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payload }),
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to update contact");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch contact queries
      queryClient.invalidateQueries({ queryKey: ["trainer-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["trainer-contact", contactId] });
    },
  });

  return updateContact;
}