import { AppTable } from "@/components/app/AppTable";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import React from "react";
import { trainerColumns } from "./TrainerColumns";

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
    <div className="p-8">
      <AppTable columns={trainerColumns} data={users} />
    </div>
  );
}
