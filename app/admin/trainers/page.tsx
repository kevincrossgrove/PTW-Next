import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { trainerColumns } from "./TrainerColumns";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default async function TrainersManagementPage() {
  const data = await authClient.admin.listUsers({
    query: {
      filterField: "appRole",
      filterOperator: "eq",
      filterValue: "trainer",
    },
    fetchOptions: { headers: await headers() },
  });

  const users = Array.isArray(data.data?.users) ? data.data?.users : [];

  return (
    <AdminPageContainer>
      <AdminPageHeader title="Trainers" />
      <AppTable columns={trainerColumns} data={users} />
    </AdminPageContainer>
  );
}
