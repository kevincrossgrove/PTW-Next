import { auth } from "@/lib/auth";
import { createDocument } from "@/lib/db-helpers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CreateContactResponse } from "../Types";

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
});

type CreateContactData = z.infer<typeof createContactSchema>;

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
