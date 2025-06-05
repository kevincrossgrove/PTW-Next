import { AppTable } from "@/components/app/AppTable";
import { playerColumns } from "./PlayerColumns";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { AdminPageTime } from "../AdminCacheOptions";

export default async function PlayersPage() {
  const data = await authClient.admin.listUsers({
    query: {
      filterField: "appRole",
      filterOperator: "eq",
      filterValue: "player",
    },
    fetchOptions: {
      headers: await headers(),
      ...AdminPageTime,
    },
  });

  const users = Array.isArray(data.data?.users) ? data.data?.users : [];

  return (
    <AdminPageContainer>
      <AdminPageHeader title="Players" />
      <AppTable columns={playerColumns} data={users} />
    </AdminPageContainer>
  );
}
