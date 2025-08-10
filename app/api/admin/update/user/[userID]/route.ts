import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/connect-to-db";
import {
  UpdateUserResponse,
  UserRecord,
  UpdateUserSchema,
  UpdateUserPayload,
} from "../../../Types";
import { ObjectId } from "mongodb";
import { UserCollection } from "@/app/api/constants";
import { checkAdminRole } from "@/lib/admin-auth";

// Update a user from the Admin Dashboard
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userID: string }> }
) {
  try {
    // Check if user has admin role
    const authError = await checkAdminRole(request);

    if (authError) return authError;

    const { userID } = await params;

    if (!userID) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid user ID provided.",
      });
    }

    // Parse and validate the request body
    let updatePayload: UpdateUserPayload;

    try {
      const body = await request.json();
      updatePayload = UpdateUserSchema.parse(body);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid payload", details: error },
        { status: 400 }
      );
    }

    const userObjectID = new ObjectId(userID);

    // Fetch user record from the database, ensure it exists
    const { db } = await connectToDatabase();

    const userRecord = await db.collection<UserRecord>(UserCollection).findOne({
      _id: userObjectID,
    });

    if (!userRecord) {
      return NextResponse.json(null, {
        status: 404,
        statusText: "A user with the provided ID was not found.",
      });
    }

    try {
      await db
        .collection("user")
        .updateOne({ _id: userObjectID }, { $set: updatePayload });
    } catch {
      return NextResponse.json(null, {
        status: 500,
        statusText: "Server error. Please try again.",
      });
    }

    // Fetch the updated user document
    const updatedUser = await db.collection<UserRecord>(UserCollection).findOne({
      _id: userObjectID,
    });

    if (!updatedUser) {
      return NextResponse.json(null, {
        status: 500,
        statusText: "Failed to retrieve updated user.",
      });
    }

    const updateUserResponse: UpdateUserResponse = {
      user: updatedUser,
    };

    return NextResponse.json(updateUserResponse);
  } catch (err) {
    console.error("Unexepected error while updating user:", err);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}
