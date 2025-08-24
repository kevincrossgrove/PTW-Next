import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BulkUpdateContactsRequest, BulkUpdateContactsResponse } from "@/app/api/admin/Types";

interface UseBulkUpdateContactsOptions {
  onSuccess?: (data: BulkUpdateContactsResponse) => void;
  onError?: (error: Error) => void;
}

interface BulkUpdateData {
  contactIds: string[];
  updates: {
    field: string;
    value: string;
    clearField: boolean;
  }[];
}

export default function useBulkUpdateContacts(options: UseBulkUpdateContactsOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (updateData: BulkUpdateData): Promise<BulkUpdateContactsResponse> => {
      const requestBody: BulkUpdateContactsRequest = {
        data: updateData,
      };

      const response = await fetch("/api/admin/contacts/bulk-update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to update contacts");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate the contacts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["admin-all-contacts"] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });

  return {
    bulkUpdateContacts: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
}