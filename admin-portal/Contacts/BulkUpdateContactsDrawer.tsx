"use client";

import AppDrawer from "@/components/app/AppDrawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ContactRecordWithTrainer } from "@/app/api/admin/Types";
import { useState } from "react";

interface BulkUpdateContactsDrawerProps {
  open: boolean;
  onClose: () => void;
  contacts: ContactRecordWithTrainer[];
  onUpdate: (updates: BulkUpdateData) => void;
  isLoading?: boolean;
}

interface FieldUpdate {
  id: string;
  field: string;
  value: string;
  clearField: boolean;
}

export interface BulkUpdateData {
  contactIds: string[];
  updates: Omit<FieldUpdate, 'id'>[];
}

const UPDATABLE_FIELDS = [
  { value: "Role", label: "Role", color: "" },
  { value: "Email", label: "Email (clear only)", color: "" },
  { value: "PhoneNumber", label: "Phone Number (clear only)", color: "" },
];

const FIELD_PERMISSIONS = {
  Role: { canUpdate: true },
  Email: { canUpdate: false },
  PhoneNumber: { canUpdate: false },
} as const;

const ROLES = ["Parent", "Player", "Coach"] as const;

interface FieldState {
  enabled: boolean;
  action: 'update' | 'clear';
  value: string;
}

export default function BulkUpdateContactsDrawer({
  open,
  onClose,
  contacts,
  onUpdate,
  isLoading = false,
}: BulkUpdateContactsDrawerProps) {
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({
    Role: { enabled: false, action: 'update', value: '' },
    Email: { enabled: false, action: 'clear', value: '' },
    PhoneNumber: { enabled: false, action: 'clear', value: '' },
  });

  function handleFieldToggle(fieldName: string, enabled: boolean) {
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        enabled,
        value: enabled ? prev[fieldName].value : '',
      }
    }));
  }

  function handleActionChange(fieldName: string, action: 'update' | 'clear') {
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        action,
        value: action === 'clear' ? '' : prev[fieldName].value,
      }
    }));
  }

  function handleValueChange(fieldName: string, value: string) {
    setFieldStates(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
      }
    }));
  }

  function handleSubmit() {
    const enabledFields = Object.entries(fieldStates).filter(([_, state]) => state.enabled);
    
    if (enabledFields.length === 0) {
      return;
    }

    const bulkUpdateData: BulkUpdateData = {
      contactIds: contacts.map(c => c.id),
      updates: enabledFields.map(([field, state]) => ({
        field,
        value: state.action === 'clear' ? '' : state.value,
        clearField: state.action === 'clear',
      })),
    };

    onUpdate(bulkUpdateData);
  }

  function handleClose() {
    setFieldStates({
      Role: { enabled: false, action: 'update', value: '' },
      Email: { enabled: false, action: 'clear', value: '' },
      PhoneNumber: { enabled: false, action: 'clear', value: '' },
    });
    onClose();
  }

  return (
    <AppDrawer
      open={open}
      onClose={handleClose}
      headerTitle="Bulk Update Contacts"
      headerDescription={`Update ${contacts.length} selected contact${contacts.length === 1 ? '' : 's'}`}
      body={
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Select the fields you want to update for the selected contacts:
            </div>

            {UPDATABLE_FIELDS.map((field) => {
              const fieldPermissions = FIELD_PERMISSIONS[field.value as keyof typeof FIELD_PERMISSIONS];
              const fieldState = fieldStates[field.value];
              
              return (
                <div key={field.value} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`enable-${field.value}`}
                        checked={fieldState.enabled}
                        onChange={(e) => handleFieldToggle(field.value, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`enable-${field.value}`} className="font-medium">
                        {field.label}
                      </Label>
                    </div>
                    
                    {!fieldPermissions?.canUpdate && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Clear only
                      </span>
                    )}
                  </div>

                  {fieldState.enabled && (
                    <div className="space-y-3 ml-6">
                      {fieldPermissions?.canUpdate ? (
                        // Role field - can update or clear
                        <div className="space-y-3">
                          <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`action-${field.value}`}
                                value="update"
                                checked={fieldState.action === 'update'}
                                onChange={() => handleActionChange(field.value, 'update')}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">Update to new value</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name={`action-${field.value}`}
                                value="clear"
                                checked={fieldState.action === 'clear'}
                                onChange={() => handleActionChange(field.value, 'clear')}
                                className="rounded border-gray-300"
                              />
                              <span className="text-sm">Clear field</span>
                            </label>
                          </div>

                          {fieldState.action === 'update' && (
                            <div>
                              <Label className="text-sm">
                                Select New Role
                              </Label>
                              <div className="flex flex-wrap gap-3 mt-2">
                                {ROLES.map((role) => (
                                  <Badge
                                    key={role}
                                    variant={fieldState.value === role ? "default" : "outline"}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium hover:opacity-80 transition-opacity flex items-center justify-center"
                                    onClick={() => handleValueChange(field.value, role)}
                                  >
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                              {fieldState.value && (
                                <div className="text-xs text-gray-600 mt-2">
                                  Selected: <span className="font-medium">{fieldState.value}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        // Email/Phone fields - clear only
                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                          <p className="text-sm text-yellow-800">
                            ✓ This will clear the {field.label.toLowerCase()} field for all selected contacts
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading || !Object.values(fieldStates).some(state => state.enabled)}
            >
              {isLoading ? "Updating..." : "Update Contacts"}
            </Button>
          </div>
        </div>
      }
    />
  );
}