"use client";

import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
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
      <AdminPageContainer>
        <AdminPageHeader title="Trainers" />
        <div>Loading...</div>
      </AdminPageContainer>
    );
  }

  if (error) {
    return (
      <AdminPageContainer>
        <AdminPageHeader title="Trainers" />
        <div>Error loading trainers</div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader title="Trainers" />
      <AppTable columns={trainerColumns} data={data || []} />
    </AdminPageContainer>
  );
}
