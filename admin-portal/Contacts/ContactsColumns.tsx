"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { ContactRecordWithTrainer } from "@/app/api/admin/Types";

export const columns: ColumnDef<ContactRecordWithTrainer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="inline-flex"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="inline-flex"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "FirstName",
    header: "First Name",
  },
  {
    accessorKey: "LastName",
    header: "Last Name",
  },
  {
    accessorKey: "Email",
    header: "Email",
  },
  {
    accessorKey: "PhoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "Role",
    header: "Role",
  },
  {
    accessorKey: "TrainerName",
    header: "Trainer",
  },
  {
    accessorKey: "TrainerEmail",
    header: "Trainer Email",
  },
];