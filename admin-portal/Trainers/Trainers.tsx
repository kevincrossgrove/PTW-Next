"use client";

import DashboardPageContainer from "@/components/admin/DashboardPageContainer";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { trainerColumns } from "./TrainerColumns";

export default function Trainers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {
          filterField: "appRole",
          filterOperator: "eq",
          filterValue: "trainer",
        },
      });
      return Array.isArray(result.data?.users) ? result.data.users : [];
    },
  });

  if (isLoading) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader title="Trainers" />
        <div>Loading...</div>
      </DashboardPageContainer>
    );
  }

  if (error) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader title="Trainers" />
        <div>Error loading trainers</div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer>
      <DashboardPageHeader title="Trainers" />
      <AppTable columns={trainerColumns} data={data || []} />
    </DashboardPageContainer>
  );
}
