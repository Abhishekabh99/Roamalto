import type { ColumnType, Generated } from "kysely";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export type UserRole = "admin" | "agent" | "viewer";
export type InquiryChannel = "whatsapp" | "email" | "form";
export type BookingStatus = "new" | "consulting" | "docs" | "booked" | "closed";
export type EventType = "page_view" | "cta_click" | "book_click" | "itinerary_open";

export interface UsersTable {
  id: Generated<string>;
  email: string;
  name: string | null;
  role: UserRole;
  created_at: ColumnType<Date, string | Date | undefined, never>;
}

export interface SessionsTable {
  id: Generated<string>;
  user_id: string;
  token: string;
  expires: ColumnType<Date, string | Date, string | Date>;
}

export interface VerificationTokensTable {
  identifier: string;
  token: string;
  expires: ColumnType<Date, string | Date, string | Date>;
}

export interface AccountsTable {
  id: Generated<string>;
  user_id: string;
  type: string;
  provider: string;
  provider_account_id: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: ColumnType<number | null, number | null, number | null>;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  oauth_token_secret: string | null;
  oauth_token: string | null;
}

export interface PackagesTable {
  id: Generated<string>;
  slug: string;
  title: string;
  days: number;
  price_from: number | null;
  highlights: string[] | null;
  active: ColumnType<boolean, boolean | undefined, never>;
  created_at: ColumnType<Date, string | Date | undefined, never>;
}

export interface ItinerariesTable {
  id: Generated<string>;
  package_id: string;
  day_no: number;
  title: string;
  bullets: string[] | null;
}

export interface LeadsTable {
  id: Generated<string>;
  name: string;
  email: string;
  phone: string;
  country: string;
  travel_window: string;
  notes: string | null;
  source: string | null;
  utm: ColumnType<JsonValue | null, JsonValue | null | undefined, JsonValue | null>;
  created_at: ColumnType<Date, string | Date | undefined, never>;
}

export interface InquiriesTable {
  id: Generated<string>;
  lead_id: string;
  channel: InquiryChannel;
  message: string;
  created_at: ColumnType<Date, string | Date | undefined, never>;
}

export interface BookingsTable {
  id: Generated<string>;
  lead_id: string;
  package_id: string;
  status: BookingStatus;
  amount_estimate: number | null;
  meta: ColumnType<JsonValue | null, JsonValue | null | undefined, JsonValue | null>;
  created_at: ColumnType<Date, string | Date | undefined, never>;
}

export interface EventsTable {
  id: Generated<string>;
  type: EventType;
  path: string;
  session_id: string | null;
  meta: ColumnType<JsonValue | null, JsonValue | null | undefined, JsonValue | null>;
  created_at: ColumnType<Date, string | Date | undefined, never>;
}

export interface VisitsTable {
  id: Generated<string>;
  path: string;
  ua_hash: string;
  utm: ColumnType<JsonValue | null, JsonValue | null | undefined, JsonValue | null>;
  created_at: ColumnType<Date, string | Date | undefined, never>;
}

export interface AuditLogTable {
  id: Generated<string>;
  user_id: string | null;
  action: string;
  subject: string;
  details: ColumnType<JsonValue | null, JsonValue | null | undefined, JsonValue | null>;
  created_at: ColumnType<Date, string | Date | undefined, never>;
}

export interface Database {
  users: UsersTable;
  sessions: SessionsTable;
  accounts: AccountsTable;
  verification_tokens: VerificationTokensTable;
  packages: PackagesTable;
  itineraries: ItinerariesTable;
  leads: LeadsTable;
  inquiries: InquiriesTable;
  bookings: BookingsTable;
  events: EventsTable;
  visits: VisitsTable;
  audit_log: AuditLogTable;
}
