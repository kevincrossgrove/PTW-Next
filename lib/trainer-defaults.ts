import { TrainerProfile } from "@/app/api/trainer/Types";

export interface DefaultTrainerConfig {
  availability: TrainerProfile["DefaultAvailability"];
  sessionDuration: number;
  bufferTime: number;
  sessionTypes: TrainerProfile["SessionTypes"];
  bookingWindowDays: number;
  requireApproval: boolean;
}

export const DEFAULT_TRAINER_CONFIG: DefaultTrainerConfig = {
  availability: {
    Monday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
    Tuesday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
    Wednesday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
    Thursday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
    Friday: { IsAvailable: true, TimeSlots: [{ StartTime: "09:00", EndTime: "17:00" }] },
    Saturday: { IsAvailable: false, TimeSlots: [] },
    Sunday: { IsAvailable: false, TimeSlots: [] },
  },
  sessionDuration: 60,
  bufferTime: 15,
  sessionTypes: [
    {
      TypeName: "1-on-1 Training",
      Duration: 60,
      MaxParticipants: 1,
      IsActive: true,
    },
  ],
  bookingWindowDays: 14,
  requireApproval: false,
};

export function createDefaultProfile(trainerID: string, displayName: string, config = DEFAULT_TRAINER_CONFIG) {
  return {
    TrainerID: trainerID,
    DisplayName: displayName,
    DefaultAvailability: config.availability,
    DefaultSessionDuration: config.sessionDuration,
    DefaultBufferTime: config.bufferTime,
    SessionTypes: config.sessionTypes,
    BookingWindowDays: config.bookingWindowDays,
    RequireApproval: config.requireApproval,
  };
}