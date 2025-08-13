"use client";

import DashboardPageContainer from "@/components/admin/DashboardPageContainer";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { playerColumns } from "./PlayerColumns";

export default function Players() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {
          filterField: "appRole",
          filterOperator: "eq",
          filterValue: "player",
        },
      });
      return Array.isArray(result.data?.users) ? result.data.users : [];
    },
  });

  if (isLoading) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader title="Players" />
        <div>Loading...</div>
      </DashboardPageContainer>
    );
  }

  if (error) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader title="Players" />
        <div>Error loading players</div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer>
      <DashboardPageHeader title="Players" />
      <AppTable columns={playerColumns} data={data || []} />
    </DashboardPageContainer>
  );
}
