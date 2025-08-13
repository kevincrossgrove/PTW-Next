"use client";

import DashboardPageContainer from "@/components/admin/DashboardPageContainer";
import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { columns } from "./UsersColumns";

export default function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {},
      });
      return Array.isArray(result.data?.users) ? result.data.users : [];
    },
  });

  if (isLoading) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader title="All Users" />
        <div>Loading...</div>
      </DashboardPageContainer>
    );
  }

  if (error) {
    return (
      <DashboardPageContainer>
        <DashboardPageHeader title="All Users" />
        <div>Error loading users</div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer>
      <DashboardPageHeader title="All Users" />
      <AppTable columns={columns} data={data || []} />
    </DashboardPageContainer>
  );
}
