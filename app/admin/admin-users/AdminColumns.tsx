"use client";

import SingleSelect from "@/components/app/AppSelect/SingleSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";

const appRoles = [
  {
    label: "Admin",
    value: "admin",
    color: "red",
  },
  {
    label: "Trainer",
    value: "trainer",
    color: "blue",
  },
  {
    label: "Parent",
    value: "parent",
    color: "green",
  },
  {
    label: "Player",
    value: "player",
    color: "yellow",
  },
];

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
      console.log(cell.getValue());
      return (
        <SingleSelect
          data={appRoles}
          labelKey={"label"}
          valueKey={"value"}
          colorKey={"color"}
        />
      );
    },
  },
];
