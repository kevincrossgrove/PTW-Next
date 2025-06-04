import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import MobileHeader from "./MobileHeader";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) notFound();
  if (session.user.role !== "admin") notFound();

  return (
    <>
      <SidebarProvider className="flex-col md:flex-row">
        <MobileHeader />
        <AdminSidebar />
        <main className="w-full">{children}</main>
      </SidebarProvider>
    </>
  );
}
