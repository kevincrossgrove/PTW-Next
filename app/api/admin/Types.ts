export interface AdminInviteResponse {
  inviteID: string;
}

export type AcceptInviteResponse =
  | { success: true; redirectTo: string }
  | { success: false; error: string };

export interface InviteRecord {
  Email: string;
  Role: "admin";
  ExpiresAt: string;
  CreatedAt: string;
  UpdatedAt: string;
  CreatedBy: string;
}
