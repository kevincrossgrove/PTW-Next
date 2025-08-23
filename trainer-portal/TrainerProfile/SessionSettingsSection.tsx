import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SessionSettingsSectionProps {
  formData: {
    DefaultSessionDuration: number;
    DefaultBufferTime: number;
    BookingWindowDays: number;
  };
  onInputChange: (field: string, value: number) => void;
}

export default function SessionSettingsSection({
  formData,
  onInputChange,
}: SessionSettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Settings</CardTitle>
        <CardDescription>
          Default settings for your training sessions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="defaultDuration">
              Default Session Duration (minutes)
            </Label>
            <Input
              id="defaultDuration"
              type="number"
              min="15"
              step="15"
              value={formData.DefaultSessionDuration}
              onChange={(e) =>
                onInputChange("DefaultSessionDuration", parseInt(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bufferTime">
              Buffer Time Between Sessions (minutes)
            </Label>
            <Input
              id="bufferTime"
              type="number"
              min="0"
              step="5"
              value={formData.DefaultBufferTime}
              onChange={(e) =>
                onInputChange("DefaultBufferTime", parseInt(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookingWindow">Booking Window (days)</Label>
            <Input
              id="bookingWindow"
              type="number"
              min="1"
              max="365"
              value={formData.BookingWindowDays}
              onChange={(e) =>
                onInputChange("BookingWindowDays", parseInt(e.target.value))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}