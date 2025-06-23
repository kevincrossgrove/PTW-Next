import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";

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
        <AdminMobileHeader />
        <AdminSidebar />
        <main className="w-full h-full">{children}</main>
      </SidebarProvider>
    </>
  );
}
