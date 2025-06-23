"use client";

import { AppSelect } from "@/components/app/AppSelect/AppSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";

export const adminColumns: ColumnDef<UserWithRole>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "appRole",
    header: "App Role",
    cell: ({ cell }) => {
      console.log(cell);
      return (
        <AppSelect
          hideArrows
          data={[]}
          labelKey={"label"}
          valueKey={"value"}
          colorKey={"color"}
          className="w-32"
        />
      );
    },
  },
];
