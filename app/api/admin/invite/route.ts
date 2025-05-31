import { EMAIL_REGEX } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexepected error while inviting admin:", err);

    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
