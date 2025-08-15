import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connect-to-db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { FetchContactResponse } from "../../Types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Validate ObjectId format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid contact ID format",
      });
    }

    // Connect to database and fetch the specific contact
    const { db } = await connectToDatabase();

    // Build query - admins can access any contact, others only their own
    const query: { _id: ObjectId; TrainerID?: string } = {
      _id: new ObjectId(params.id),
    };

    if (session.user.role !== "admin") {
      query.TrainerID = session.user.id;
    }

    const contact = await db.collection("Contacts").findOne(query);

    if (!contact) {
      return NextResponse.json(null, {
        status: 404,
        statusText: "Contact not found",
      });
    }

    // Transform contact to include id field
    const transformedContact = {
      id: contact._id.toString(),
      Role: contact.Role,
      FirstName: contact.FirstName,
      LastName: contact.LastName,
      Email: contact.Email,
      PhoneNumber: contact.PhoneNumber,
      TrainerID: contact.TrainerID,
      CreatedAt: contact.CreatedAt,
      UpdatedAt: contact.UpdatedAt,
      CreatedBy: contact.CreatedBy,
      UpdatedBy: contact.UpdatedBy,
    };

    const response: FetchContactResponse = {
      contact: transformedContact,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching contact:", error);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}
