"use client";

import DashboardPageContainer from "@/components/admin/DashboardPageContainer";
import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { adminColumns } from "./AdminColumns";
import AdminHeader from "./AdminHeader";

export default function AdminUsers() {
  const { data: session } = authClient.useSession();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const result = await authClient.admin.listUsers({
        query: {
          filterField: "role",
          filterOperator: "eq",
          filterValue: "admin",
        },
      });
      return Array.isArray(result.data?.users) ? result.data.users : [];
    },
  });

  if (isLoading) {
    return (
      <DashboardPageContainer>
        <AdminHeader />
        <div>Loading...</div>
      </DashboardPageContainer>
    );
  }

  if (error) {
    return (
      <DashboardPageContainer>
        <AdminHeader />
        <div>Error loading users</div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer>
      <AdminHeader />
      <AppTable columns={adminColumns(session?.user?.id)} data={data || []} />
    </DashboardPageContainer>
  );
}
