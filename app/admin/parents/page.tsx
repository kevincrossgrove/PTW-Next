import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import { parentColumns } from "./ParentColumns";

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
    <div className="p-8">
      <AppTable columns={parentColumns} data={users} />
    </div>
  );
}
