"use client";

import AppNavbar from "@/components/app/AppNavbar";
import { Button } from "../../components/ui/button";
import { authClient } from "../../lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen">
      <AppNavbar />
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/home">Admin Dashboard</Link>
          </Button>
          <Button onClick={signout}>Sign Out</Button>
        </div>
      </div>
    </div>
  );

  async function signout() {
    await authClient.signOut();
    router.push("/");
  }
}
