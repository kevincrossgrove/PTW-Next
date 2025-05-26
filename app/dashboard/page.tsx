"use client";

import { Button } from "../../components/ui/button";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div>
      DashboardPage<Button onClick={signout}>Signout</Button>
    </div>
  );

  async function signout() {
    await authClient.signOut();
    router.push("/");
  }
}
