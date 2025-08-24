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
import { useState } from "react";

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
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/; // Simple international phone number validation
    if (phone && !phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handleEmailChange = (value: string) => {
    onInputChange("Email", value);
    if (value) validateEmail(value);
    else setEmailError("");
  };

  const handlePhoneChange = (value: string) => {
    onInputChange("PhoneNumber", value);
    if (value) validatePhone(value);
    else setPhoneError("");
  };

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
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="your.email@example.com"
              className={emailError ? "border-red-500" : ""}
            />
            {emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.PhoneNumber || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="(555) 123-4567"
              className={phoneError ? "border-red-500" : ""}
            />
            {phoneError && (
              <p className="text-sm text-red-500">{phoneError}</p>
            )}
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