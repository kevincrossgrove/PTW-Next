"use client";

import DashboardPageHeader from "@/components/admin/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import InviteAdminModal from "./InviteAdminModal";

export default function AdminHeader() {
  const [inviteAdminOpen, setInviteAdminOpen] = useState(false);

  return (
    <>
      <DashboardPageHeader
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
