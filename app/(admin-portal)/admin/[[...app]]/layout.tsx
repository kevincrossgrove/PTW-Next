import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Providers from "./providers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) notFound();
  if (session.user.role !== "admin") notFound();

  return <Providers>{children}</Providers>;
}
