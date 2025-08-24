import { SessionType } from "@/app/api/trainer/Types";
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
import { DollarSign, Plus, Trash2, Users } from "lucide-react";

interface SessionTypesSectionProps {
  formData: {
    SessionTypes: SessionType[];
  };
  onSessionTypeChange: (
    index: number,
    field: keyof SessionType,
    value: string | number | boolean | undefined
  ) => void;
  onAddSessionType: () => void;
  onRemoveSessionType: (index: number) => void;
}

export default function SessionTypesSection({
  formData,
  onSessionTypeChange,
  onAddSessionType,
  onRemoveSessionType,
}: SessionTypesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Session Types
        </CardTitle>
        <CardDescription>
          Define the different types of training sessions you offer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {formData.SessionTypes.map((sessionType, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Session Type {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveSessionType(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Session Name</Label>
                  <Input
                    value={sessionType.TypeName}
                    onChange={(e) =>
                      onSessionTypeChange(index, "TypeName", e.target.value)
                    }
                    placeholder="e.g., 1-on-1 Training"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    min="15"
                    step="15"
                    value={sessionType.Duration}
                    onChange={(e) =>
                      onSessionTypeChange(
                        index,
                        "Duration",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Participants</Label>
                  <Input
                    type="number"
                    min="1"
                    value={sessionType.MaxParticipants}
                    onChange={(e) =>
                      onSessionTypeChange(
                        index,
                        "MaxParticipants",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Price (optional)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={sessionType.Price || ""}
                      onChange={(e) =>
                        onSessionTypeChange(
                          index,
                          "Price",
                          e.target.value ? parseFloat(e.target.value) : undefined
                        )
                      }
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={sessionType.IsActive}
                  onCheckedChange={(checked) =>
                    onSessionTypeChange(index, "IsActive", !!checked)
                  }
                />
                <Label>Active (available for booking)</Label>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={onAddSessionType}
            className="w-full gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Session Type
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}