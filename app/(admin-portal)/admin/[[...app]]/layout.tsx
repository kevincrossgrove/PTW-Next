import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Providers from "@/lib/providers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login?returnUrl=/admin");
  }
  
  if (session.user.role !== "admin") notFound();

  return <Providers>{children}</Providers>;
}
