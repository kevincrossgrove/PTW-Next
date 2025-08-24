"use client";

import { ContactRecordWithTrainer } from "@/app/api/admin/Types";
import AppEmptyField from "@/components/app/AppEmptyField";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export const createColumns = (
  onViewContact: (contactId: string) => void
): ColumnDef<ContactRecordWithTrainer>[] => [
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
    id: "name",
    header: "Name",
    cell: ({ row }) => (
      <button
        onClick={() => onViewContact(row.original.id)}
        className="text-left font-bold hover:underline cursor-pointer text-foreground/80"
      >
        {`${row.original.FirstName} ${row.original.LastName}`}
      </button>
    ),
  },
  {
    accessorKey: "PhoneNumber",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("PhoneNumber") as string;
      return phone || <AppEmptyField size="sm" />;
    },
  },
  {
    accessorKey: "Role",
    header: "Role",
  },
  {
    accessorKey: "Email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("Email") as string;
      return email || <AppEmptyField size="sm" />;
    },
  },
  {
    accessorKey: "TrainerName",
    header: "Trainer",
  },
];
