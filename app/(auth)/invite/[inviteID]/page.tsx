import { AcceptInviteResponse } from "@/app/api/admin/Types";
import { Button } from "@/components/ui/button";
import { appFetch } from "@/lib/app-fetch";
import { auth } from "@/lib/auth";
import { Params } from "next/dist/server/request/params";
import { headers as headas } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

// Used to accept Invites
export default async function AcceptInvitePage({ params }: { params: Params }) {
  const { inviteID } = await params;
  const headers = await headas();
  const session = await auth.api.getSession({ headers });

  if (!session?.user) {
    return redirect("/login?inviteID=" + inviteID);
  }

  if (!inviteID) return redirect("/dashboard");

  let error;

  const customHeaders: Record<string, string> = {};

  headers.forEach((value, key) => {
    customHeaders[key] = value;
  });

  try {
    const result = await appFetch<AcceptInviteResponse>({
      url: `${process.env.BETTER_AUTH_URL}/api/admin/invite/${inviteID}`,
      method: "PUT",
      headers: customHeaders,
    });

    if (result.success) {
      return redirect(result.redirectTo);
    } else {
      error = result.error;
    }
  } catch (err) {
    console.log(err);
    error = "An unexpected error occurred.";
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="m-4 p-4 border rounded w-sm flex flex-col items-center text-center">
        <Image
          src="/ptw.png"
          alt="PTW Logo"
          width={80}
          height={80}
          className="mb-4"
        />
        {error}
        <Button className="self-center mt-6" variant="outline">
          <Link href={"/dashboard"} replace>
            Go To Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}
