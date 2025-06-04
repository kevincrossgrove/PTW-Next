import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { columns } from "./UsersColumns";
import { AppTable } from "@/components/app/AppTable";
import AdminPageContainer from "@/components/admin/AdminPageContainer";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

export default async function AdminUserManagementPage() {
  const data = await authClient.admin.listUsers({
    query: {},
    fetchOptions: { headers: await headers() },
  });

  const users = Array.isArray(data.data?.users) ? data.data?.users : [];

  return (
    <AdminPageContainer>
      <AdminPageHeader title="All Users" />
      <AppTable columns={columns} data={users} />
    </AdminPageContainer>
  );
}
