import { AdminInviteResponse } from "@/app/api/admin/Types";
import AppAlert from "@/components/app/AppAlert";
import AppModal, { AppModalProps } from "@/components/app/AppModal";
import { AppShareLink } from "@/components/app/AppSharelink";
import { Button } from "@/components/ui/button";
import { appFetch, AppFetchError } from "@/lib/app-fetch";
import { EMAIL_REGEX } from "@/lib/constants";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

type InviteAdminModalProps = AppModalProps;

export default function InviteAdminModal({
  open,
  onClose,
}: InviteAdminModalProps) {
  const [inviteAdminEmail] = useState("kevin.crossgrove@growthcloud.com"); // TODO: Remove my email, when Amazon SES API is implemented
  const [invitingAdmin, setInvitingAdmin] = useState(false);
  const [error, setError] = useState("");

  const [adminInviteID, setAdminInviteID] = useState("");

  // Use this Modal once the Amazon SES API is implemented
  // return (
  //   <AppModal
  //     open={open}
  //     onClose={handleClose}
  //     title="Invite Admin"
  //     description="Invite a new admin to your organization"
  //     content={
  //       <form
  //         className="flex flex-col gap-2"
  //         onSubmit={(e) => {
  //           e.preventDefault();
  //           inviteAdmin();
  //         }}
  //       >
  //         <Input
  //           placeholder="Email"
  //           className="w-full"
  //           value={inviteAdminEmail}
  //           type="email"
  //           onChange={(event) => setInviteAdminEmail(event.target.value.trim())}
  //         />
  //       </form>
  //     }
  //     footer={
  //       <div className="w-full">
  //         <div className="flex gap-2 justify-end">
  //           <Button variant="outline" onClick={handleClose}>
  //             Cancel
  //           </Button>
  //           <Button
  //             variant="default"
  //             onClick={inviteAdmin}
  //             loadingText="Inviting..."
  //             loading={invitingAdmin}
  //           >
  //             Invite
  //           </Button>
  //         </div>
  //         {error && (
  //           <AppAlert
  //             title={error}
  //             containerClass="w-full mt-4 text-center bg-destructive text-destructive-foreground py-2"
  //             icon={<AlertCircle />}
  //           />
  //         )}
  //       </div>
  //     }
  //   />
  // );

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      title="Invite Admin"
      description="Generate an invite link to invite a new admin to your organization."
      content={<div></div>}
      footer={
        <div className="w-full">
          {adminInviteID && <AppShareLink url={`/invite/${adminInviteID}`} />}
          {!adminInviteID && (
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
                Create Invite Link
              </Button>
            </div>
          )}
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
    setAdminInviteID("");
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

      const { inviteID } = await appFetch<AdminInviteResponse>({
        url: "/api/admin/invite",
        method: "POST",
        body: JSON.stringify({ email: inviteAdminEmail.trim() }),
      });

      setAdminInviteID(inviteID);
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
