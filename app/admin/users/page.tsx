import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { columns } from "./UsersColumns";
import { AppTable } from "@/components/app/AppTable";

export default async function AdminUserManagementPage() {
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
    <div>
      <AppTable columns={columns} data={users} />
    </div>
  );
}
