import { auth } from "@/lib/auth";
import { createDocument } from "@/lib/db-helpers";
import { connectToDatabase } from "@/lib/connect-to-db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateContactResponse, FetchContactsResponse } from "../Types";

const createContactSchema = z.object({
  role: z.enum(["Parent", "Player", "Coach"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .refine((phone) => {
      const cleaned = phone.replace(/\D/g, "");
      return cleaned.length >= 10 && cleaned.length <= 11;
    }, "Please enter a valid phone number"),
  notes: z.string().optional(),
});

type CreateContactData = z.infer<typeof createContactSchema>;

export async function GET(request: NextRequest) {
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

    // Connect to database and fetch contacts for this trainer
    const { db } = await connectToDatabase();

    const contacts = await db
      .collection("Contacts")
      .find({ TrainerID: session.user.id })
      .sort({ CreatedAt: -1 })
      .toArray();

    // Transform contacts to include id field
    const transformedContacts = contacts.map((contact) => ({
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
    }));

    const response: FetchContactsResponse = {
      contacts: transformedContacts,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching contacts:", error);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}

export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();

    let validatedData: CreateContactData;
    try {
      validatedData = createContactSchema.parse(body);
    } catch {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid data provided",
      });
    }

    // Create contact document following MongoDB naming conventions
    const contactData = {
      Role: validatedData.role,
      FirstName: validatedData.firstName,
      LastName: validatedData.lastName,
      Email: validatedData.email,
      PhoneNumber: validatedData.phoneNumber,
      TrainerID: session.user.id,
      ...(validatedData.notes && { Notes: validatedData.notes }),
    };

    // Create contact with default fields
    const { document: createdContact } = await createDocument({
      collectionName: "Contacts",
      data: contactData,
      userId: session.user.id,
    });

    const response: CreateContactResponse = {
      contact: createdContact,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating contact:", error);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}
