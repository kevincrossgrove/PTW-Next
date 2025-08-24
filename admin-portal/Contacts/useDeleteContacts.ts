import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteContactsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function useDeleteContacts(options: DeleteContactsOptions = {}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
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
    onSuccess: () => {
      // Invalidate admin contacts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["admin-all-contacts"] });
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });

  return {
    deleteContacts: mutation.mutate,
    isDeleting: mutation.isPending,
  };
}