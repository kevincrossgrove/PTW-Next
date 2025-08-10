"use client";

import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { adminColumns } from "./AdminColumns";
import AdminHeader from "./AdminHeader";

export default function AdminUsers() {
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
      <AdminPageContainer>
        <AdminHeader />
        <div>Loading...</div>
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <AdminHeader />
        <div>Error loading users</div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminHeader />
      <AppTable columns={adminColumns} data={data || []} />
    </AdminPageContainer>
  );
}
