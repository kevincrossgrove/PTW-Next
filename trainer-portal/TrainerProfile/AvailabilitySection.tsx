import { TimeSlot } from "@/app/api/trainer/Types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Plus, Trash2 } from "lucide-react";

const DAYS = [
  { key: "Monday", label: "Monday" },
  { key: "Tuesday", label: "Tuesday" },
  { key: "Wednesday", label: "Wednesday" },
  { key: "Thursday", label: "Thursday" },
  { key: "Friday", label: "Friday" },
  { key: "Saturday", label: "Saturday" },
  { key: "Sunday", label: "Sunday" },
] as const;

interface AvailabilitySectionProps {
  formData: {
    DefaultAvailability: Record<
      string,
      {
        IsAvailable: boolean;
        TimeSlots: TimeSlot[];
      }
    >;
  };
  onAvailabilityToggle: (day: string, isAvailable: boolean) => void;
  onTimeSlotChange: (
    day: string,
    slotIndex: number,
    field: keyof TimeSlot,
    value: string
  ) => void;
  onAddTimeSlot: (day: string) => void;
  onRemoveTimeSlot: (day: string, slotIndex: number) => void;
}

export default function AvailabilitySection({
  formData,
  onAvailabilityToggle,
  onTimeSlotChange,
  onAddTimeSlot,
  onRemoveTimeSlot,
}: AvailabilitySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Default Availability
        </CardTitle>
        <CardDescription>
          Set your typical weekly schedule. You can customize individual weeks
          later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {DAYS.map(({ key, label }) => (
            <div key={key} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.DefaultAvailability[key].IsAvailable}
                    onCheckedChange={(checked) =>
                      onAvailabilityToggle(key, !!checked)
                    }
                  />
                  <Label className="font-medium">{label}</Label>
                </div>
                {formData.DefaultAvailability[key].IsAvailable && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddTimeSlot(key)}
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Time Block
                  </Button>
                )}
              </div>

              {formData.DefaultAvailability[key].IsAvailable && (
                <div className="space-y-2 ml-6">
                  {formData.DefaultAvailability[key].TimeSlots.map(
                    (timeSlot, slotIndex) => (
                      <div
                        key={slotIndex}
                        className="flex items-center gap-2"
                      >
                        <Input
                          type="time"
                          value={timeSlot.StartTime}
                          onChange={(e) =>
                            onTimeSlotChange(
                              key,
                              slotIndex,
                              "StartTime",
                              e.target.value
                            )
                          }
                          className="w-32"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                          type="time"
                          value={timeSlot.EndTime}
                          onChange={(e) =>
                            onTimeSlotChange(
                              key,
                              slotIndex,
                              "EndTime",
                              e.target.value
                            )
                          }
                          className="w-32"
                        />
                        {formData.DefaultAvailability[key].TimeSlots.length >
                          1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveTimeSlot(key, slotIndex)}
                            className="text-red-600 hover:text-red-700 px-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  )}
                  {formData.DefaultAvailability[key].TimeSlots.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No time blocks set for this day
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}