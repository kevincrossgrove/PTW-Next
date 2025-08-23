import { DefaultFields } from "@/lib/db-helpers";

export interface ContactRecord extends DefaultFields {
  Role: "Parent" | "Player" | "Coach";
  FirstName: string;
  LastName: string;
  Email?: string;
  PhoneNumber?: string;
  TrainerID: string;
  Notes?: string;
}

export interface CreateContactResponse {
  contact: ContactRecord & { id: string };
}

export interface FetchContactsResponse {
  contacts: (ContactRecord & { id: string })[];
}

export interface FetchContactResponse {
  contact: ContactRecord & { id: string };
}

export interface UpdateContactResponse {
  contact: ContactRecord & { id: string };
}

export interface DeleteContactResponse {
  success: boolean;
}

export interface BulkDeleteContactsResponse {
  success: boolean;
  deletedCount: number;
}

// Trainer Profile Types
export interface TimeSlot {
  StartTime: string; // "09:00"
  EndTime: string; // "17:00"
}

export interface DayAvailability {
  IsAvailable: boolean;
  TimeSlots: TimeSlot[]; // Multiple time blocks per day
}

export interface SessionType {
  TypeName: string;
  Duration: number; // minutes
  MaxParticipants: number;
  Price?: number;
  IsActive: boolean;
}

export interface TrainerProfile extends DefaultFields {
  TrainerID: string;
  DisplayName: string;
  ProfilePicture?: string;
  Bio?: string;

  // Default availability settings
  DefaultAvailability: {
    Monday: DayAvailability;
    Tuesday: DayAvailability;
    Wednesday: DayAvailability;
    Thursday: DayAvailability;
    Friday: DayAvailability;
    Saturday: DayAvailability;
    Sunday: DayAvailability;
  };

  // Default session settings
  DefaultSessionDuration: number; // 60 minutes
  DefaultBufferTime: number; // 5 minutes

  // Session types offered
  SessionTypes: SessionType[];

  // Booking preferences
  BookingWindowDays: number; // 14 days default
  RequireApproval: boolean; // Auto-approve or manual

  // Contact/business info
  PhoneNumber?: string;
  Email?: string;
  Location?: string;
}

export interface FetchTrainerProfileResponse {
  profile: TrainerProfile & { id: string };
}

export interface UpdateTrainerProfileResponse {
  profile: TrainerProfile & { id: string };
}
