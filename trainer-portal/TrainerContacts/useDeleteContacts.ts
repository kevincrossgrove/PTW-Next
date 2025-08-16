"use client";

import { BulkDeleteContactsResponse } from "@/app/api/trainer/Types";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseDeleteContactsParams {
  onSuccess?: (deletedCount: number) => void;
  onError?: (error: string) => void;
}

export default function useDeleteContacts({
  onSuccess,
  onError,
}: UseDeleteContactsParams = {}) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const deleteContacts = useMutation<
    BulkDeleteContactsResponse,
    Error,
    string[]
  >({
    mutationFn: async (contactIds: string[]) => {
      const response = await fetch("/api/trainer/contacts/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contactIds }),
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to delete contacts");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch contacts query to update the list
      queryClient.invalidateQueries({
        queryKey: ["trainer-contacts", session?.user?.id],
      });

      onSuccess?.(data.deletedCount);
    },
    onError: (error) => {
      onError?.(error.message);
    },
  });

  return {
    deleteContacts: deleteContacts.mutate,
    isDeleting: deleteContacts.isPending,
    error: deleteContacts.error?.message,
  };
}
