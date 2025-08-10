"use client";

import { useMutation } from "@tanstack/react-query";
import { UpdateUserPayload, UpdateUserResponse } from "@/app/api/admin/Types";

interface UpdateUserParams {
  userID: string;
  payload: UpdateUserPayload;
}

export default function useUpdateAdmin() {
  const updateAdmin = useMutation<UpdateUserResponse, Error, UpdateUserParams>({
    mutationKey: ["admin-update-user"],
    mutationFn: async ({ userID, payload }) => {
      const response = await fetch(`/api/admin/update/user/${userID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(response.statusText || "Failed to update user");
      }

      return response.json();
    },
  });

  return updateAdmin;
}
