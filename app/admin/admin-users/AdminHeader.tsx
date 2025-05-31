"use client";

import { Button } from "@/components/ui/button";
import InviteAdminModal from "./InviteAdminModal";
import { useState } from "react";

export default function AdminHeader() {
  const [inviteAdminOpen, setInviteAdminOpen] = useState(false);

  return (
    <div className="flex justify-between w-full">
      <h1>Admins</h1>
      <Button onClick={() => setInviteAdminOpen(true)}>Invite Admin</Button>
      <InviteAdminModal
        open={inviteAdminOpen}
        onClose={() => setInviteAdminOpen(false)}
      />
    </div>
  );
}
