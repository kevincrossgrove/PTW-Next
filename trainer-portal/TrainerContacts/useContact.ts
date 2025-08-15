import { FetchContactResponse } from "@/app/api/trainer/Types";
import { useQuery } from "@tanstack/react-query";

export default function useContact(contactId: string | null) {
  return useQuery({
    queryKey: ["contact", contactId],
    queryFn: async (): Promise<FetchContactResponse> => {
      if (!contactId) {
        throw new Error("Contact ID is required");
      }

      const response = await fetch(`/api/trainer/contacts/${contactId}`);

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to fetch contact");
      }

      return response.json();
    },
    enabled: !!contactId, // Only fetch when contactId is provided
  });
}