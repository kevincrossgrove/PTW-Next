"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import InviteAdminModal from "./InviteAdminModal";

export default function AdminHeader() {
  const [inviteAdminOpen, setInviteAdminOpen] = useState(false);

  return (
    <>
      <AdminPageHeader
        title="Admins"
        actions={
          <Button onClick={() => setInviteAdminOpen(true)}>Invite Admin</Button>
        }
      />
      <InviteAdminModal
        open={inviteAdminOpen}
        onClose={() => setInviteAdminOpen(false)}
      />
    </>
  );
}
