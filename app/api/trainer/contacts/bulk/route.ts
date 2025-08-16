import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connect-to-db";
import { ObjectId } from "mongodb";

import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    // Get session to verify user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    // Parse request body
    const body = await request.json();
    const { contactIds } = body;

    if (!Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid contact IDs provided",
      });
    }

    // Validate all ObjectId formats
    const invalidIds = contactIds.filter((id) => !ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "One or more contact IDs have invalid format",
      });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Build query - admins can delete any contact, others only their own
    const query: { _id: { $in: ObjectId[] }; TrainerID?: string } = {
      _id: { $in: contactIds.map((id) => new ObjectId(id)) },
    };

    if (session.user.role !== "admin") {
      query.TrainerID = session.user.id;
    }

    // Delete the contacts
    const result = await db.collection("Contacts").deleteMany(query);

    return NextResponse.json({
      data: {
        success: true,
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error("Error deleting contacts:", error);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}
