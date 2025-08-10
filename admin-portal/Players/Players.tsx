"use client";

import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
      <AdminPageContainer>
        <AdminPageHeader title="Players" />
        <div>Loading...</div>
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Players" />
        <div>Error loading players</div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader title="Players" />
      <AppTable columns={playerColumns} data={data || []} />
    </AdminPageContainer>
  );
}
