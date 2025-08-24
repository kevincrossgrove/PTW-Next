import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connect-to-db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  BulkUpdateContactsRequest,
  BulkUpdateContactsResponse,
  ContactRecordWithTrainer,
} from "../../Types";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(null, {
        status: 403,
        statusText: "Access denied. Admin role required.",
      });
    }

    const requestBody: BulkUpdateContactsRequest = await request.json();
    const { contactIds, updates } = requestBody.data;

    if (!contactIds?.length || !updates?.length) {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Contact IDs and updates are required",
      });
    }

    const { db } = await connectToDatabase();
    const contactsCollection = db.collection("Contacts");

    // Build update operations for each contact
    const updateOperations = [];

    for (const contactId of contactIds) {
      const updateDoc: Record<string, string> = {
        UpdatedAt: new Date().toISOString(),
        UpdatedBy: session.user.id,
      };

      // Apply each field update
      for (const update of updates) {
        const { field, value, clearField } = update;

        // Validate field name and permissions
        const allowedFields = {
          Role: { canUpdate: true, canClear: true },
          Email: { canUpdate: false, canClear: true },
          PhoneNumber: { canUpdate: false, canClear: true },
        };
        
        if (!allowedFields[field as keyof typeof allowedFields]) {
          return NextResponse.json(null, {
            status: 400,
            statusText: `Invalid field: ${field}`,
          });
        }

        const fieldConfig = allowedFields[field as keyof typeof allowedFields];
        
        // Check if trying to update a clear-only field
        if (!clearField && !fieldConfig.canUpdate) {
          return NextResponse.json(null, {
            status: 400,
            statusText: `Field ${field} can only be cleared, not updated with new values`,
          });
        }

        if (clearField) {
          updateDoc[field] = "";
        } else {
          // Only Role field can be updated with new values
          if (field === "Role") {
            // Validate Role value
            const validRoles = ["Parent", "Player", "Coach"];
            if (!validRoles.includes(value)) {
              return NextResponse.json(null, {
                status: 400,
                statusText: `Invalid role value: ${value}`,
              });
            }
            updateDoc[field] = value;
          }
        }
      }

      updateOperations.push({
        updateOne: {
          filter: { _id: new ObjectId(contactId) },
          update: { $set: updateDoc },
        },
      });
    }

    // Execute bulk update
    const result = await contactsCollection.bulkWrite(updateOperations);

    // Fetch updated contacts with trainer information
    const pipeline = [
      {
        $match: {
          _id: { $in: contactIds.map((id) => new ObjectId(id)) },
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "TrainerID",
          foreignField: "_id",
          as: "trainer",
        },
      },
      {
        $addFields: {
          id: { $toString: "$_id" },
          TrainerName: {
            $ifNull: [{ $arrayElemAt: ["$trainer.name", 0] }, "Unknown"],
          },
        },
      },
      {
        $project: {
          _id: 0,
          trainer: 0,
        },
      },
    ];

    const updatedContacts = await contactsCollection
      .aggregate(pipeline)
      .toArray();

    const response: BulkUpdateContactsResponse = {
      data: {
        updatedCount: result.modifiedCount,
        contacts: updatedContacts as ContactRecordWithTrainer[], // MongoDB Document[] to ContactRecordWithTrainer[] conversion
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in bulk update contacts:", error);
    return NextResponse.json(null, {
      status: 500,
      statusText: "Failed to update contacts",
    });
  }
}
