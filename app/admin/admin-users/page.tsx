import { AppTable } from "@/components/app/AppTable";
import AdminHeader from "./AdminHeader";
import { adminColumns } from "./AdminColumns";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export default async function AdminUsersPage() {
  const data = await authClient.admin.listUsers({
    query: {
      filterField: "role",
      filterOperator: "eq",
      filterValue: "admin",
    },
    fetchOptions: { headers: await headers() },
  });

  const users = Array.isArray(data.data?.users) ? data.data?.users : [];

  return (
    <div className="p-8">
      <AdminHeader />
      <AppTable columns={adminColumns} data={users} />
    </div>
  );
}
