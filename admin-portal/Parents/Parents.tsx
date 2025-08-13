"use client";

import DashboardPageContainer from "@/components/admin/DashboardPageContainer";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { parentColumns } from "./ParentColumns";

export default function Parents() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["parents"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {
          filterField: "appRole",
          filterOperator: "eq",
          filterValue: "parent",
        },
      });
      return Array.isArray(result.data?.users) ? result.data.users : [];
    },
  });

  if (isLoading) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader title="Parents" />
        <div>Loading...</div>
      </DashboardPageContainer>
    );
  }

  if (error) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader title="Parents" />
        <div>Error loading parents</div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer>
      <DashboardPageHeader title="Parents" />
      <AppTable columns={parentColumns} data={data || []} />
    </DashboardPageContainer>
  );
}
