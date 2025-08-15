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

export interface FetchContactsResponse {
  contacts: (ContactRecord & { id: string })[];
}

export interface FetchContactResponse {
  contact: ContactRecord & { id: string };
}