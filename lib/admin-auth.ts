import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

export async function checkAdminRole(request: NextRequest): Promise<NextResponse | null> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has admin role (either role or appRole is admin)
    if (session.user.role !== "admin" && session.user.appRole !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    return null; // No error, user is admin
  } catch (error) {
    console.error("Error checking admin role:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}