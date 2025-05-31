import AppAlert from "@/components/app/AppAlert";
import AppModal, { AppModalProps } from "@/components/app/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appFetch, AppFetchError } from "@/lib/app-fetch";
import { EMAIL_REGEX } from "@/lib/constants";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

type InviteAdminModalProps = AppModalProps;

export default function InviteAdminModal({
  open,
  onClose,
}: InviteAdminModalProps) {
  const [inviteAdminEmail, setInviteAdminEmail] = useState("");
  const [invitingAdmin, setInvitingAdmin] = useState(false);
  const [error, setError] = useState("");

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      title="Invite Admin"
      description="Invite a new admin to your account."
      content={
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            inviteAdmin();
          }}
        >
          <Input
            placeholder="Email"
            className="w-full"
            value={inviteAdminEmail}
            type="email"
            onChange={(event) => setInviteAdminEmail(event.target.value.trim())}
          />
        </form>
      }
      footer={
        <div className="w-full">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={inviteAdmin}
              loadingText="Inviting..."
              loading={invitingAdmin}
            >
              Invite
            </Button>
          </div>
          {error && (
            <AppAlert
              title={error}
              containerClass="w-full mt-4 text-center bg-destructive text-destructive-foreground py-2"
              icon={<AlertCircle />}
            />
          )}
        </div>
      }
    />
  );

  function handleClose() {
    onClose();
  }

  async function inviteAdmin() {
    setError("");

    // Validate email via Regex
    if (!EMAIL_REGEX.test(inviteAdminEmail)) {
      return setError("Invalid email address");
    }

    if (!inviteAdminEmail) return;

    try {
      setInvitingAdmin(true);

      await appFetch<{ success: true }>({
        url: "/api/admin/invite",
        method: "POST",
        body: JSON.stringify({ email: inviteAdminEmail.trim() }),
      });

      handleClose();
    } catch (error) {
      const parsedError = AppFetchError.safeParse(error);

      if (!parsedError.success) {
        setError("Error inviting admin");
      } else {
        setError(parsedError.data.message);
      }
    } finally {
      setInvitingAdmin(false);
    }
  }
}
