import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { parentColumns } from "./ParentColumns";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default async function ParentsPage() {
  const data = await authClient.admin.listUsers({
    query: {
      filterField: "appRole",
      filterOperator: "eq",
      filterValue: "parent",
    },
    fetchOptions: { headers: await headers() },
  });

  const users = Array.isArray(data.data?.users) ? data.data?.users : [];

  return (
    <AdminPageContainer>
      <AdminPageHeader title="Parents" />
      <AppTable columns={parentColumns} data={users} />
    </AdminPageContainer>
  );
}
