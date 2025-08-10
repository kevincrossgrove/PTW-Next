"use client";

import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
      <AdminPageContainer>
        <AdminPageHeader title="All Users" />
        <div>Loading...</div>
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="All Users" />
        <div>Error loading users</div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader title="All Users" />
      <AppTable columns={columns} data={data || []} />
    </AdminPageContainer>
  );
}
