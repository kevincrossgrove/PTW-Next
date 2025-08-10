"use client";

import { AppRole } from "@/app/api/admin/Types";
import useUpdateAdmin from "@/components/admin/useUpdateAdmin";
import SingleSelect from "@/components/app/AppSelect/SingleSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { UserWithRole } from "better-auth/plugins";
import { toast } from "sonner";

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

function AppRoleCell({
  user,
  currentAppRole,
}: {
  user: UserWithRole;
  currentAppRole: string;
}) {
  const updateAdmin = useUpdateAdmin();
  const queryClient = useQueryClient();

  const handleAppRoleChange = async (newAppRole: string) => {
    const previousAppRole = currentAppRole;
    const appRoleTyped = newAppRole as AppRole;

    try {
      await updateAdmin.mutateAsync({
        userID: user.id,
        payload: {
          appRole: appRoleTyped,
        },
      });

      queryClient.invalidateQueries({ queryKey: ["admin-users"] });

      // Show success toast with undo button
      toast.success(`Updated ${user.name}'s app role to ${newAppRole}`, {
        duration: 5000,
        action: {
          label: "Undo",
          onClick: async () => {
            try {
              await updateAdmin.mutateAsync({
                userID: user.id,
                payload: {
                  appRole: previousAppRole as AppRole,
                },
              });
              queryClient.invalidateQueries({ queryKey: ["admin-users"] });
              toast.success(
                `Reverted ${user.name}'s app role to ${previousAppRole}`
              );
            } catch (undoError) {
              console.error("Failed to undo appRole change:", undoError);
              toast.error("Failed to undo the app role change");
            }
          },
        },
      });
    } catch (error) {
      console.error("Failed to update appRole:", error);
      toast.error(
        `Failed to update ${user.name}'s app role. Please try again.`
      );
    }
  };

  return (
    <SingleSelect
      data={appRoles}
      labelKey={"label"}
      valueKey={"value"}
      colorKey={"color"}
      value={currentAppRole}
      onValueChange={handleAppRoleChange}
    />
  );
}

export const adminColumns = (currentUserId?: string): ColumnDef<UserWithRole>[] => [
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
    cell: ({ row }) => {
      const user = row.original;
      const isCurrentUser = user.id === currentUserId;
      return (
        <span>
          {user.name}
          {isCurrentUser && <span className="text-muted-foreground ml-1">(Me)</span>}
        </span>
      );
    },
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
    cell: ({ cell, row }) => {
      const currentAppRole = cell.getValue() as string;
      const user = row.original;

      return <AppRoleCell user={user} currentAppRole={currentAppRole} />;
    },
  },
];
