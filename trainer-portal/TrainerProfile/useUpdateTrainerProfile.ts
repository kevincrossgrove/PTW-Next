import { UpdateTrainerProfileResponse, TrainerProfile } from "@/app/api/trainer/Types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProfileData {
  DisplayName: string;
  ProfilePicture?: string;
  Bio?: string;
  DefaultAvailability: TrainerProfile["DefaultAvailability"];
  DefaultSessionDuration: number;
  DefaultBufferTime: number;
  SessionTypes: TrainerProfile["SessionTypes"];
  BookingWindowDays: number;
  RequireApproval: boolean;
  PhoneNumber?: string;
  Email?: string;
  Location?: string;
}

async function updateTrainerProfile(data: UpdateProfileData): Promise<UpdateTrainerProfileResponse> {
  const response = await fetch("/api/trainer/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Failed to update profile");
  }

  return response.json();
}

interface UseUpdateTrainerProfileOptions {
  onSuccess?: (data: UpdateTrainerProfileResponse) => void;
  onError?: (error: Error) => void;
}

export default function useUpdateTrainerProfile(options: UseUpdateTrainerProfileOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTrainerProfile,
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["trainerProfile"] });
      options.onSuccess?.(data);
    },
    onError: options.onError,
  });
}