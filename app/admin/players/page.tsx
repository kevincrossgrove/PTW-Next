import { AppTable } from "@/components/app/AppTable";
import React from "react";
import { playerColumns } from "./PlayerColumns";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

export default async function PlayersPage() {
  const data = await authClient.admin.listUsers({
    query: {
      filterField: "appRole",
      filterOperator: "eq",
      filterValue: "player",
    },
    fetchOptions: { headers: await headers() },
  });

  const users = Array.isArray(data.data?.users) ? data.data?.users : [];

  return (
    <div className="p-8">
      <AppTable columns={playerColumns} data={users} />
    </div>
  );
}
