import { AppTable } from "@/components/app/AppTable";
import AdminHeader from "./AdminHeader";
import { adminColumns } from "./AdminColumns";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import { AdminPageTime } from "../AdminCacheOptions";

export default async function AdminUsersPage() {
  const data = await authClient.admin.listUsers({
    query: {
      filterField: "role",
      filterOperator: "eq",
      filterValue: "admin",
    },
    fetchOptions: { headers: await headers(), ...AdminPageTime },
  });

  const users = Array.isArray(data.data?.users) ? data.data?.users : [];

  return (
    <AdminPageContainer>
      <AdminHeader />
      <AppTable columns={adminColumns} data={users} />
    </AdminPageContainer>
  );
}
