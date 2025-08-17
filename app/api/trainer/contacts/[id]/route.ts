import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connect-to-db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ContactRecord, FetchContactResponse } from "../../Types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Await params to get the id
    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid contact ID format",
      });
    }

    // Connect to database and fetch the specific contact
    const { db } = await connectToDatabase();

    // Build query - admins can access any contact, others only their own
    const query: { _id: ObjectId; TrainerID?: string } = {
      _id: new ObjectId(id),
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
    const transformedContact: ContactRecord & { id: string } = {
      id: contact._id.toString(),
      Role: contact.Role,
      FirstName: contact.FirstName,
      LastName: contact.LastName,
      Email: contact.Email,
      PhoneNumber: contact.PhoneNumber,
      TrainerID: contact.TrainerID,
      Notes: contact.Notes,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Await params to get the id
    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid contact ID format",
      });
    }

    // Parse request body
    const body = await request.json();

    // Validate payload structure
    if (!body.payload) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Payload is required",
      });
    }

    // Validate required fields
    const { role, firstName, lastName, email, phoneNumber, notes } =
      body.payload;

    if (!role || !firstName || !lastName || !email || !phoneNumber) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Missing required fields",
      });
    }

    // Validate role
    if (!["Parent", "Player", "Coach"].includes(role)) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid role",
      });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Build query - admins can update any contact, others only their own
    const query: { _id: ObjectId; TrainerID?: string } = {
      _id: new ObjectId(id),
    };

    if (session.user.role !== "admin") {
      query.TrainerID = session.user.id;
    }

    // First check if contact exists and user has permission
    const existingContact = await db.collection("Contacts").findOne(query);

    if (!existingContact) {
      return NextResponse.json(null, {
        status: 404,
        statusText: "Contact not found or access denied",
      });
    }

    // Update the contact
    const updateData = {
      Role: role,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNumber: phoneNumber,
      Notes: notes || null,
      UpdatedAt: new Date().toISOString(),
      UpdatedBy: session.user.id,
    };

    const result = await db.collection("Contacts").updateOne(query, {
      $set: updateData,
    });

    if (result.matchedCount === 0) {
      return NextResponse.json(null, {
        status: 404,
        statusText: "Contact not found or access denied",
      });
    }

    // Fetch the updated contact
    const updatedContact = await db.collection("Contacts").findOne(query);

    if (!updatedContact) {
      return NextResponse.json(null, {
        status: 500,
        statusText: "Failed to fetch updated contact",
      });
    }

    // Transform contact to include id field
    const transformedContact: ContactRecord & { id: string } = {
      id: updatedContact._id.toString(),
      Role: updatedContact.Role,
      FirstName: updatedContact.FirstName,
      LastName: updatedContact.LastName,
      Email: updatedContact.Email,
      PhoneNumber: updatedContact.PhoneNumber,
      TrainerID: updatedContact.TrainerID,
      Notes: updatedContact.Notes,
      CreatedAt: updatedContact.CreatedAt,
      UpdatedAt: updatedContact.UpdatedAt,
      CreatedBy: updatedContact.CreatedBy,
      UpdatedBy: updatedContact.UpdatedBy,
    };

    const response: FetchContactResponse = {
      contact: transformedContact,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating contact:", error);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    // Await params to get the id
    const { id } = await params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid contact ID format",
      });
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Build query - admins can delete any contact, others only their own
    const query: { _id: ObjectId; TrainerID?: string } = {
      _id: new ObjectId(id),
    };

    if (session.user.role !== "admin") {
      query.TrainerID = session.user.id;
    }

    // First check if contact exists and user has permission
    const existingContact = await db.collection("Contacts").findOne(query);

    if (!existingContact) {
      return NextResponse.json(null, {
        status: 404,
        statusText: "Contact not found or access denied",
      });
    }

    // Delete the contact
    const result = await db.collection("Contacts").deleteOne(query);

    if (result.deletedCount === 0) {
      return NextResponse.json(null, {
        status: 404,
        statusText: "Contact not found or access denied",
      });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("Error deleting contact:", error);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}
