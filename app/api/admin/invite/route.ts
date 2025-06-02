import { connectToDatabase } from "@/lib/connect-to-db";
import { EMAIL_REGEX } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";
import dayjs from "dayjs";

// Inviting an Admin to the Platform
// Invites are trackable, as we are creating an Invite Record in the database
// The Invite Record ID will be used in the Invite URL - Which will be sent to the Admin via Email
export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Missing required field: email" },
        { status: 400 }
      );
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid email address provided.",
      });
    }

    // Generate an Invite Record. This will be used in the Invite URL
    const { db } = await connectToDatabase();

    const createdAt = dayjs();

    const invitePayload = {
      Email: email,
      ExpiresAt: createdAt.add(1, "day").toISOString(),
      CreatedAt: createdAt.toISOString(),
      UpdatedAt: createdAt.toISOString(),
      CreatedBy: "",
    };

    const invite = await db.collection("Invites").insertOne(invitePayload);

    return NextResponse.json({ inviteID: invite.insertedId });
  } catch (err) {
    console.error("Unexepected error while inviting admin:", err);

    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
