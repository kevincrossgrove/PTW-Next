"use client";

import {
  SessionType,
  TimeSlot,
  TrainerProfile as TrainerProfileType,
} from "@/app/api/trainer/Types";
import AppAlert from "@/components/app/AppAlert";
import { AppAlertDestructive } from "@/components/app/AppAlertDestructive";
import AppLoader from "@/components/app/AppLoader";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DashboardPageContainer from "../../components/admin/DashboardPageContainer";
import DashboardPageHeader from "../../components/admin/DashboardPageHeader";
import AvailabilitySection from "./AvailabilitySection";
import BasicInformationSection from "./BasicInformationSection";
import SessionSettingsSection from "./SessionSettingsSection";
import SessionTypesSection from "./SessionTypesSection";
import useTrainerProfile from "./useTrainerProfile";
import useUpdateTrainerProfile from "./useUpdateTrainerProfile";

type FormData = Omit<
  TrainerProfileType,
  "TrainerID" | "CreatedAt" | "UpdatedAt" | "CreatedBy" | "UpdatedBy"
>;

export default function TrainerProfile() {
  const { data: profileData, isLoading, error } = useTrainerProfile();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateTrainerProfile({
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        setHasChanges(false);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update profile");
      },
    });

  // Memoize the profile to prevent unnecessary re-renders
  const profile = useMemo(() => profileData?.profile, [profileData?.profile]);

  useEffect(() => {
    if (!profile || formData) return;

    setFormData({
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
    });
  }, [profile]);

  if (isLoading) {
    return (
      <DashboardPageContainer>
        <div className="flex items-center justify-center h-64">
          <AppLoader />
        </div>
      </DashboardPageContainer>
    );
  }

  if (error) {
    return (
      <DashboardPageContainer>
        <AppAlertDestructive title="Error" description={error.message} />
      </DashboardPageContainer>
    );
  }

  if (!formData) {
    return (
      <DashboardPageContainer>
        <AppAlert title="Loading" description="Loading profile data..." />
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer>
      <DashboardPageHeader
        title="My Profile"
        description="Manage your trainer profile, availability, and session settings"
        actions={
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isUpdating}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        }
      />

      <div className="space-y-6">
        <BasicInformationSection
          formData={formData}
          onInputChange={(field, value) =>
            handleInputChange(field as keyof FormData, value)
          }
        />

        <AvailabilitySection
          formData={formData}
          onAvailabilityToggle={(day, isAvailable) =>
            handleAvailabilityToggle(
              day as keyof FormData["DefaultAvailability"],
              isAvailable
            )
          }
          onTimeSlotChange={(day, slotIndex, field, value) =>
            handleTimeSlotChange(
              day as keyof FormData["DefaultAvailability"],
              slotIndex,
              field,
              value
            )
          }
          onAddTimeSlot={(day) =>
            addTimeSlot(day as keyof FormData["DefaultAvailability"])
          }
          onRemoveTimeSlot={(day, slotIndex) =>
            removeTimeSlot(
              day as keyof FormData["DefaultAvailability"],
              slotIndex
            )
          }
        />

        <SessionSettingsSection
          formData={formData}
          onInputChange={(field, value) =>
            handleInputChange(field as keyof FormData, value)
          }
        />

        <SessionTypesSection
          formData={formData}
          onSessionTypeChange={handleSessionTypeChange}
          onAddSessionType={addSessionType}
          onRemoveSessionType={removeSessionType}
        />
      </div>
    </DashboardPageContainer>
  );

  function handleInputChange(
    field: keyof FormData,
    value: string | number | boolean
  ) {
    if (!formData) return;

    setFormData((prev) => ({
      ...prev!,
      [field]: value,
    }));
    setHasChanges(true);
  }

  function handleAvailabilityToggle(
    day: keyof FormData["DefaultAvailability"],
    isAvailable: boolean
  ) {
    if (!formData) return;

    setFormData((prev) => ({
      ...prev!,
      DefaultAvailability: {
        ...prev!.DefaultAvailability,
        [day]: {
          ...prev!.DefaultAvailability[day],
          IsAvailable: isAvailable,
          TimeSlots:
            isAvailable && prev!.DefaultAvailability[day].TimeSlots.length === 0
              ? [{ StartTime: "09:00", EndTime: "17:00" }]
              : prev!.DefaultAvailability[day].TimeSlots,
        },
      },
    }));
    setHasChanges(true);
  }

  function handleTimeSlotChange(
    day: keyof FormData["DefaultAvailability"],
    slotIndex: number,
    field: keyof TimeSlot,
    value: string
  ) {
    if (!formData) return;

    const updatedTimeSlots = [...formData.DefaultAvailability[day].TimeSlots];
    updatedTimeSlots[slotIndex] = {
      ...updatedTimeSlots[slotIndex],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev!,
      DefaultAvailability: {
        ...prev!.DefaultAvailability,
        [day]: {
          ...prev!.DefaultAvailability[day],
          TimeSlots: updatedTimeSlots,
        },
      },
    }));
    setHasChanges(true);
  }

  function addTimeSlot(day: keyof FormData["DefaultAvailability"]) {
    if (!formData) return;

    const newTimeSlot: TimeSlot = { StartTime: "09:00", EndTime: "17:00" };

    setFormData((prev) => ({
      ...prev!,
      DefaultAvailability: {
        ...prev!.DefaultAvailability,
        [day]: {
          ...prev!.DefaultAvailability[day],
          TimeSlots: [...prev!.DefaultAvailability[day].TimeSlots, newTimeSlot],
        },
      },
    }));
    setHasChanges(true);
  }

  function removeTimeSlot(
    day: keyof FormData["DefaultAvailability"],
    slotIndex: number
  ) {
    if (!formData) return;

    const updatedTimeSlots = formData.DefaultAvailability[day].TimeSlots.filter(
      (_, index) => index !== slotIndex
    );

    setFormData((prev) => ({
      ...prev!,
      DefaultAvailability: {
        ...prev!.DefaultAvailability,
        [day]: {
          ...prev!.DefaultAvailability[day],
          TimeSlots: updatedTimeSlots,
        },
      },
    }));
    setHasChanges(true);
  }

  function handleSessionTypeChange(
    index: number,
    field: keyof SessionType,
    value: string | number | boolean | undefined
  ) {
    if (!formData) return;

    const updatedSessionTypes = [...formData.SessionTypes];
    updatedSessionTypes[index] = {
      ...updatedSessionTypes[index],
      [field]: value,
    };

    setFormData((prev) => ({
      ...prev!,
      SessionTypes: updatedSessionTypes,
    }));
    setHasChanges(true);
  }

  function addSessionType() {
    if (!formData) return;

    const newSessionType: SessionType = {
      TypeName: "New Session Type",
      Duration: 60,
      MaxParticipants: 1,
      IsActive: true,
    };

    setFormData((prev) => ({
      ...prev!,
      SessionTypes: [...prev!.SessionTypes, newSessionType],
    }));
    setHasChanges(true);
  }

  function removeSessionType(index: number) {
    if (!formData) return;

    const updatedSessionTypes = formData.SessionTypes.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev!,
      SessionTypes: updatedSessionTypes,
    }));
    setHasChanges(true);
  }

  function handleSave() {
    if (!formData) return;
    updateProfile(formData);
  }
}
