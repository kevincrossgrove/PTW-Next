import AppDrawer, { DrawerProps } from "@/components/app/AppDrawer";

type CreateContactDrawerProps = DrawerProps & {};

export default function CreateContactDrawer({
  open,
  onClose,
}: CreateContactDrawerProps) {
  return (
    <AppDrawer
      open={open}
      onClose={onClose}
      headerTitle="Create Contact"
      headerDescription="Add a new contact to your list"
      body={<div>TODO: Implement form</div>}
      size="lg"
    />
  );
}
