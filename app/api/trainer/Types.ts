import { DefaultFields } from "@/lib/db-helpers";

export interface ContactRecord extends DefaultFields {
  Role: "Parent" | "Player" | "Coach";
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  TrainerID: string;
}

export interface CreateContactResponse {
  contact: ContactRecord & { id: string };
}