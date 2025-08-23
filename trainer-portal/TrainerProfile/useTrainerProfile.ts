import { FetchTrainerProfileResponse } from "@/app/api/trainer/Types";
import { useQuery } from "@tanstack/react-query";

async function fetchTrainerProfile(): Promise<FetchTrainerProfileResponse> {
  const response = await fetch("/api/trainer/profile", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Failed to fetch profile");
  }

  return response.json();
}

export default function useTrainerProfile() {
  return useQuery({
    queryKey: ["trainerProfile"],
    queryFn: fetchTrainerProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}