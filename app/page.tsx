import AppNavbar from "@/components/app/AppNavbar";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <>
      <AppNavbar />
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="flex gap-4">
            {session ? (
              <>
                {session.user.appRole === "trainer" && (
                  <Link href="/trainer">
                    <Button variant="secondary">Trainer Dashboard</Button>
                  </Link>
                )}
                {session.user.role === "admin" && (
                  <Link href="/admin">
                    <Button>Admin Dashboard</Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button variant={"secondary"}>Sign Up</Button>
                </Link>
                <Link href="/login">
                  <Button>Login</Button>
                </Link>
              </>
            )}
          </div>
        </main>
        <footer className=""></footer>
      </div>
    </>
  );
}
