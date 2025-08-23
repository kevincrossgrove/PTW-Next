import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connect-to-db";
import { createDocument, updateDocument } from "@/lib/db-helpers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { FetchTrainerProfileResponse, UpdateTrainerProfileResponse, TrainerProfile } from "../Types";
import { DefaultFields } from "@/lib/db-helpers";

const timeSlotSchema = z.object({
  StartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  EndTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
});

const dayAvailabilitySchema = z.object({
  IsAvailable: z.boolean(),
  TimeSlots: z.array(timeSlotSchema).min(0, "Time slots array is required"),
});

const sessionTypeSchema = z.object({
  TypeName: z.string().min(1, "Session type name is required"),
  Duration: z.number().min(15, "Duration must be at least 15 minutes"),
  MaxParticipants: z.number().min(1, "Must allow at least 1 participant"),
  Price: z.number().optional(),
  IsActive: z.boolean(),
});

const updateProfileSchema = z.object({
  data: z.object({
    DisplayName: z.string().min(1, "Display name is required"),
    ProfilePicture: z.string().optional(),
    Bio: z.string().optional(),
    DefaultAvailability: z.object({
      Monday: dayAvailabilitySchema,
      Tuesday: dayAvailabilitySchema,
      Wednesday: dayAvailabilitySchema,
      Thursday: dayAvailabilitySchema,
      Friday: dayAvailabilitySchema,
      Saturday: dayAvailabilitySchema,
      Sunday: dayAvailabilitySchema,
    }),
    DefaultSessionDuration: z.number().min(15, "Duration must be at least 15 minutes"),
    DefaultBufferTime: z.number().min(0, "Buffer time cannot be negative"),
    SessionTypes: z.array(sessionTypeSchema),
    BookingWindowDays: z.number().min(1, "Booking window must be at least 1 day"),
    RequireApproval: z.boolean(),
    PhoneNumber: z.string().optional(),
    Email: z.email().optional().or(z.literal("")),
    Location: z.string().optional(),
  }),
});

function createDefaultProfile(trainerID: string, displayName: string): Omit<TrainerProfile, keyof DefaultFields> {
  return {
    TrainerID: trainerID,
    DisplayName: displayName,
    DefaultAvailability: {
      Monday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
      Tuesday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
      Wednesday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
      Thursday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
      Friday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
      Saturday: { IsAvailable: false, TimeSlots: [] },
      Sunday: { IsAvailable: false, TimeSlots: [] },
    },
    DefaultSessionDuration: 60,
    DefaultBufferTime: 15,
    SessionTypes: [
      {
        TypeName: "1-on-1 Training",
        Duration: 60,
        MaxParticipants: 1,
        IsActive: true,
      },
    ],
    BookingWindowDays: 14,
    RequireApproval: false,
  };
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const { db } = await connectToDatabase();

    const profile = await db
      .collection("TrainerProfiles")
      .findOne({ TrainerID: session.user.id });

    let transformedProfile;

    // If no profile exists, create a default one
    if (!profile) {
      const defaultProfileData = createDefaultProfile(
        session.user.id,
        session.user.name || "Trainer"
      );

      const { document: createdProfile } = await createDocument({
        collectionName: "TrainerProfiles",
        data: defaultProfileData,
        userId: session.user.id,
      });

      transformedProfile = createdProfile;
    } else {
      transformedProfile = {
        id: profile._id.toString(),
        TrainerID: profile.TrainerID,
        DisplayName: profile.DisplayName,
        ProfilePicture: profile.ProfilePicture,
        Bio: profile.Bio,
        DefaultAvailability: profile.DefaultAvailability,
        DefaultSessionDuration: profile.DefaultSessionDuration,
        DefaultBufferTime: profile.DefaultBufferTime,
        SessionTypes: profile.SessionTypes,
        BookingWindowDays: profile.BookingWindowDays,
        RequireApproval: profile.RequireApproval,
        PhoneNumber: profile.PhoneNumber,
        Email: profile.Email,
        Location: profile.Location,
        CreatedAt: profile.CreatedAt,
        UpdatedAt: profile.UpdatedAt,
        CreatedBy: profile.CreatedBy,
        UpdatedBy: profile.UpdatedBy,
      };
    }

    const response: FetchTrainerProfileResponse = {
      profile: transformedProfile,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching trainer profile:", error);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(null, {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const body = await request.json();

    let validatedData;
    try {
      validatedData = updateProfileSchema.parse(body);
    } catch {
      return NextResponse.json(null, {
        status: 400,
        statusText: "Invalid data provided",
      });
    }

    const { db } = await connectToDatabase();

    // Update profile
    await updateDocument({
      collectionName: "TrainerProfiles",
      filter: { TrainerID: session.user.id },
      data: validatedData.data,
      userId: session.user.id,
    });

    // Fetch updated profile
    const updatedProfile = await db
      .collection("TrainerProfiles")
      .findOne({ TrainerID: session.user.id });

    if (!updatedProfile) {
      return NextResponse.json(null, {
        status: 404,
        statusText: "Profile not found",
      });
    }

    const transformedProfile = {
      id: updatedProfile._id.toString(),
      TrainerID: updatedProfile.TrainerID,
      DisplayName: updatedProfile.DisplayName,
      ProfilePicture: updatedProfile.ProfilePicture,
      Bio: updatedProfile.Bio,
      DefaultAvailability: updatedProfile.DefaultAvailability,
      DefaultSessionDuration: updatedProfile.DefaultSessionDuration,
      DefaultBufferTime: updatedProfile.DefaultBufferTime,
      SessionTypes: updatedProfile.SessionTypes,
      BookingWindowDays: updatedProfile.BookingWindowDays,
      RequireApproval: updatedProfile.RequireApproval,
      PhoneNumber: updatedProfile.PhoneNumber,
      Email: updatedProfile.Email,
      Location: updatedProfile.Location,
      CreatedAt: updatedProfile.CreatedAt,
      UpdatedAt: updatedProfile.UpdatedAt,
      CreatedBy: updatedProfile.CreatedBy,
      UpdatedBy: updatedProfile.UpdatedBy,
    };

    const response: UpdateTrainerProfileResponse = {
      profile: transformedProfile,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating trainer profile:", error);

    return NextResponse.json(null, {
      status: 500,
      statusText: "Server error. Please try again.",
    });
  }
}