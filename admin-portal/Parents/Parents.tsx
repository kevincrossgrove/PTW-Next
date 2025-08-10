"use client";

import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
      <AdminPageContainer>
        <AdminPageHeader title="Parents" />
        <div>Loading...</div>
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Parents" />
        <div>Error loading parents</div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader title="Parents" />
      <AppTable columns={parentColumns} data={data || []} />
    </AdminPageContainer>
  );
}
