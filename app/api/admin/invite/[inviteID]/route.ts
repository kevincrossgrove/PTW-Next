import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/connect-to-db";
import { AcceptInviteResponse, InviteRecord } from "../../Types";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Accept an invite to the Platform
// Deletes the invite on expired, or successful acceptance
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ inviteID: string }> }
) {
  try {
    const { inviteID } = await params;
    const session = await auth.api.getSession({ headers: await headers() });

    const user = session?.user;

    if (!user) {
      return NextResponse.json(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    if (!inviteID) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid invite ID provided.",
      });
    }

    // Fetch invite record from the database, ensure it is still valid
    const { db } = await connectToDatabase();

    const deleteInvite = async () => {
      try {
        await db.collection<InviteRecord>("Invites").deleteOne({
          _id: new ObjectId(inviteID),
        });
      } catch {} // Shallow Delete Error
    };

    const inviteRecord = await db.collection<InviteRecord>("Invites").findOne({
      _id: new ObjectId(inviteID),
    });

    if (!inviteRecord) {
      return NextResponse.json(null, {
        status: 404,
        statusText:
          "The invite was not found. Please request a new invite link.",
      });
    }

    if (inviteRecord.ExpiresAt < dayjs().toISOString()) {
      // Delete the expired invite record
      await deleteInvite();

      const acceptInviteResponse: AcceptInviteResponse = {
        success: false,
        error: "This invite has expired. Please request a new invite link.",
      };

      return NextResponse.json(acceptInviteResponse);
    }

    // Accept the role provided in the Invite Record.
    if (inviteRecord.Role !== user.role) {
      try {
        await db
          .collection("user")
          .updateOne(
            { _id: new ObjectId(user.id) },
            { $set: { role: inviteRecord.Role } }
          );
      } catch {
        return NextResponse.json(null, {
          status: 500,
          statusText: "Server error. Please try again.",
        });
      }
    }

    await deleteInvite();

    const acceptInviteResponse: AcceptInviteResponse = {
      success: true,
      redirectTo: `/admin/home`,
    };

    return NextResponse.json(acceptInviteResponse);
  } catch (err) {
    console.error("Unexepected error while inviting admin:", err);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}
