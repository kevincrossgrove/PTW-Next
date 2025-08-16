"use client";

import { useQuery } from "@tanstack/react-query";
import { FetchContactsResponse } from "@/app/api/trainer/Types";
import { authClient } from "@/lib/auth-client";

export default function useFetchContacts() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const fetchContacts = useQuery<FetchContactsResponse, Error>({
    queryKey: ["trainer-contacts", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/trainer/contacts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to fetch contacts");
      }

      return response.json();
    },
    enabled: !!session?.user?.id, // Only run query when user ID is available
  });

  return {
    ...fetchContacts,
    isLoading: fetchContacts.isLoading || sessionLoading, // Include session loading state
  };
}