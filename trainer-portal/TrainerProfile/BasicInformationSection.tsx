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
import PhoneInput, { isValidUSPhone } from "@/components/app/PhoneInput";
import { z } from "zod/v4";

interface ValidationErrors {
  DisplayName?: string;
  Email?: string;
  PhoneNumber?: string;
}

interface BasicInformationSectionProps {
  formData: {
    DisplayName: string;
    Email: string;
    PhoneNumber?: string;
    Location?: string;
    Bio?: string;
  };
  onInputChange: (field: string, value: string) => void;
  validationErrors?: ValidationErrors;
}


const basicInfoSchema = z.object({
  DisplayName: z.string().min(1, "Display name is required"),
  Email: z.email("Please enter a valid email address (e.g., name@example.com)"),
  PhoneNumber: z
    .string()
    .optional()
    .refine(
      (phone) => !phone || isValidUSPhone(phone),
      "Please enter a valid 10-digit US phone number"
    ),
});

export type BasicInfoValidationResult = {
  isValid: boolean;
  errors: ValidationErrors;
};

export function validateBasicInfo(
  data: BasicInformationSectionProps["formData"]
): BasicInfoValidationResult {
  try {
    basicInfoSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Zod validation errors:", error.issues);
      const errors: ValidationErrors = {};
      error.issues.forEach((err) => {
        const field = err.path[0] as keyof ValidationErrors;
        console.log(
          `Field: ${field}, Message: ${err.message}, Code: ${err.code}`
        );
        errors[field] = err.message;
      });
      console.log("Final errors object:", errors);
      return { isValid: false, errors };
    }
    console.log("Non-Zod error:", error);
    return { isValid: false, errors: {} };
  }
}

export default function BasicInformationSection({
  formData,
  onInputChange,
  validationErrors = {},
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
              className={validationErrors.DisplayName ? "border-red-500" : ""}
            />
            {validationErrors.DisplayName && (
              <p className="text-sm text-red-500">
                {validationErrors.DisplayName}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.Email || ""}
              onChange={(e) => onInputChange("Email", e.target.value)}
              placeholder="your.email@example.com"
              className={validationErrors.Email ? "border-red-500" : ""}
            />
            {validationErrors.Email && (
              <p className="text-sm text-red-500">{validationErrors.Email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <PhoneInput
              id="phoneNumber"
              value={formData.PhoneNumber || ""}
              onChange={(value) => onInputChange("PhoneNumber", value)}
              className={validationErrors.PhoneNumber ? "border-red-500" : ""}
            />
            {validationErrors.PhoneNumber && (
              <p className="text-sm text-red-500">
                {validationErrors.PhoneNumber}
              </p>
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
