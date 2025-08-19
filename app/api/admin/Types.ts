import { ObjectId } from "mongodb";
import { z } from "zod/v4";

export interface AdminInviteResponse {
  inviteID: string;
}

export type AcceptInviteResponse =
  | { success: true; redirectTo: string }
  | { success: false; error: string };

interface DefaultFields {
  _id: ObjectId;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: string;
}

export interface InviteRecord extends DefaultFields {
  Email: string;
  Role: "admin";
  ExpiresAt: string;
}

// Type for creating new invite records (without _id)
export type CreateInviteRecord = Omit<InviteRecord, "_id">;

export type AppRole = "trainer" | "parent" | "player" | "admin";

export interface UserRecord {
  _id: ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null; // Image can be a URL string or null
  createdAt: string;
  updatedAt: string;
  role: "admin" | "user"; // Core role used by Better Auth
  appRole: AppRole; // Specific roles for the application itself
}

export interface UpdateUserResponse {
  user: UserRecord;
}

// Zod schema for validating user update payload
export const UpdateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z.email().optional(),
    emailVerified: z.boolean().optional(),
    image: z.string().nullable().optional(),
    role: z.enum(["admin", "user"]).optional(),
    appRole: z.enum(["trainer", "parent", "player", "admin"]).optional(),
  })
  .strict(); // strict() ensures no extra fields are allowed

export type UpdateUserPayload = z.infer<typeof UpdateUserSchema>;

export interface ContactRecordWithTrainer {
  id: string;
  Role: "Parent" | "Player" | "Coach";
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  TrainerID: string;
  TrainerName: string;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: string;
  UpdatedBy: string;
}

export interface FetchAllContactsResponse {
  data: {
    contacts: ContactRecordWithTrainer[];
  };
}
