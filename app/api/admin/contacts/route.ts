import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connect-to-db";
import { NextRequest, NextResponse } from "next/server";
import { FetchAllContactsResponse } from "../Types";

export async function GET(request: NextRequest) {
  try {
    // Get session to verify user is authenticated and is admin
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    // Check if user has admin role
    if (session.user.role !== "admin") {
      return NextResponse.json(null, {
        status: 403,
        statusText: "Access denied. Admin role required.",
      });
    }

    // Connect to database and fetch all contacts with trainer information
    const { db } = await connectToDatabase();

    const contactsWithTrainers = await db
      .collection("Contacts")
      .aggregate([
        {
          $addFields: {
            TrainerObjectId: { $toObjectId: "$TrainerID" }
          }
        },
        {
          $lookup: {
            from: "user",
            localField: "TrainerObjectId",
            foreignField: "_id",
            as: "trainer",
          },
        },
        {
          $unwind: {
            path: "$trainer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            Role: 1,
            FirstName: 1,
            LastName: 1,
            Email: 1,
            PhoneNumber: 1,
            TrainerID: 1,
            CreatedAt: 1,
            UpdatedAt: 1,
            CreatedBy: 1,
            UpdatedBy: 1,
            TrainerName: "$trainer.name",
            TrainerEmail: "$trainer.email",
          },
        },
        {
          $sort: { CreatedAt: -1 },
        },
      ])
      .toArray();


    // Transform contacts to include id field
    const transformedContacts = contactsWithTrainers.map((contact) => ({
      id: contact._id.toString(),
      Role: contact.Role,
      FirstName: contact.FirstName,
      LastName: contact.LastName,
      Email: contact.Email,
      PhoneNumber: contact.PhoneNumber,
      TrainerID: contact.TrainerID,
      TrainerName: contact.TrainerName || "Unknown",
      TrainerEmail: contact.TrainerEmail || "",
      CreatedAt: contact.CreatedAt,
      UpdatedAt: contact.UpdatedAt,
      CreatedBy: contact.CreatedBy,
      UpdatedBy: contact.UpdatedBy,
    }));

    const response: FetchAllContactsResponse = {
      data: {
        contacts: transformedContacts,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching all contacts:", error);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}