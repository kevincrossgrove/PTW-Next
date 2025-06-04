"use client";

import { Button } from "@/components/ui/button";
import InviteAdminModal from "./InviteAdminModal";
import { useState } from "react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";

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
