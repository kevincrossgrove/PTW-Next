import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BasicInformationSectionProps {
  formData: {
    DisplayName: string;
    Email?: string;
    PhoneNumber?: string;
    Location?: string;
    Bio?: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export default function BasicInformationSection({
  formData,
  onInputChange,
}: BasicInformationSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Your public profile information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name *</Label>
            <Input
              id="displayName"
              value={formData.DisplayName}
              onChange={(e) => onInputChange("DisplayName", e.target.value)}
              placeholder="Your display name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.Email || ""}
              onChange={(e) => onInputChange("Email", e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.PhoneNumber || ""}
              onChange={(e) => onInputChange("PhoneNumber", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.Location || ""}
              onChange={(e) => onInputChange("Location", e.target.value)}
              placeholder="City, State"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.Bio || ""}
            onChange={(e) => onInputChange("Bio", e.target.value)}
            placeholder="Tell clients about your experience and training philosophy..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}